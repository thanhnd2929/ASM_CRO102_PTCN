import { StyleSheet, Text, View, PermissionsAndroid, TouchableOpacity, FlatList, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Run = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [watchId, setWatchId] = useState(null);
  const [runResults, setRunResults] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const MAX_HISTORY_SIZE = 20; // Giới hạn số lượng lịch sử vị trí

  const currentUser = auth().currentUser;
  const uid = currentUser ? currentUser.uid : null;

  const haversineDistance = (coords1, coords2) => {
    const toRad = (angle) => (angle * Math.PI) / 180;

    const R = 6371; // Bán kính trái đất tính bằng km
    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Khoảng cách tính bằng km
    return distance;
  };

  const calculateTotalDistance = (history) => {
    let totalDistance = 0;
    for (let i = 1; i < history.length; i++) {
      totalDistance += haversineDistance(history[i - 1], history[i]);
    }
    return totalDistance.toFixed(2); // Làm tròn kết quả thành 2 chữ số thập phân
  };

  const startWatchingLocation = () => {
    const id = Geolocation.watchPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        const newLocation = { latitude, longitude, timestamp: position.timestamp };

        // Lưu tọa độ vào Firebase trong bảng của người dùng
        try {
          if (!uid) return; // Nếu chưa có UID, không thực hiện thao tác
          await firestore().collection('users').doc(uid).collection('locations').add(newLocation);
          console.log('Location saved to Firebase:', newLocation);
        } catch (error) {
          console.error('Error saving location to Firebase:', error);
        }

        setCurrentLocation(newLocation);

        setLocationHistory(prevHistory => {
          const newHistory = [...prevHistory, newLocation];
          if (newHistory.length > MAX_HISTORY_SIZE) {
            newHistory.shift(); // Xóa phần tử đầu tiên nếu vượt quá giới hạn
          }
          return newHistory;
        });

        console.log(latitude, longitude);
      },
      error => console.warn('Error', error.message),
      { enableHighAccuracy: true, distanceFilter: 2, interval: 5000, fastestInterval: 5000 }
    );
    setWatchId(id);
    setStartTime(Date.now()); // Lưu thời gian bắt đầu
  };

  const stopWatchingLocation = async () => {
    if (watchId !== null) {
      console.log('Stopping location watch with ID:', watchId);
      Geolocation.clearWatch(watchId);
      setWatchId(null);

      // Tính tổng khoảng cách từ khi bắt đầu đến khi dừng
      const distance = calculateTotalDistance(locationHistory);

      // Tính tổng thời gian chạy
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2); // Thời gian chạy tính bằng giây

      // Đẩy tổng quãng đường và tổng thời gian vào Firestore
      await pushRunResultToFirebase(distance, duration);

      // Đặt tổng quãng đường và tổng thời gian về giá trị mới nhất
      setTotalDistance(distance);
      setElapsedTime(duration);
      setLocationHistory([]); // Xóa lịch sử vị trí
    }
  };

  const pushRunResultToFirebase = async (distance, duration) => {
    try {
      if (!uid) return; // Nếu chưa có UID, không thực hiện thao tác

      const today = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại theo định dạng YYYY-MM-DD
      const timestamp = new Date().toISOString(); // Thời gian hiện tại

      // Lưu tổng khoảng cách và thời gian vào Firestore trong tài liệu của người dùng theo ngày và phiên
      const result = { totalDistance: distance, duration, timestamp };
      await firestore()
        .collection('users')
        .doc(uid)
        .collection('dailyDistances')
        .doc(`${today}_${timestamp}`)
        .set(result, { merge: true });

      console.log('Run result saved to Firebase:', distance, duration);

      // Cập nhật danh sách kết quả chạy
      setRunResults(prevResults => [...prevResults, result]);
    } catch (error) {
      console.error('Error saving run result to Firebase:', error);
    }
  };

  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Location');
      } else {
        console.log('Location permission denied');
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchRunResults = async () => {
    try {
      if (!uid) return; // Nếu chưa có UID, không thực hiện thao tác

      const querySnapshot = await firestore()
        .collection('users')
        .doc(uid)
        .collection('dailyDistances')
        .get();

      const results = querySnapshot.docs.map(doc => doc.data());
      setRunResults(results);
    } catch (error) {
      console.error('Error fetching run results from Firebase:', error);
    }
  };

  useEffect(() => {
    requestPermission();
    fetchRunResults(); // Fetch run results khi component mount

    // Clean up watchPosition on unmount
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [uid]);

  useEffect(() => {
    setTotalDistance(calculateTotalDistance(locationHistory));
  }, [locationHistory]);

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  const renderRunResult = ({ item }) => (
    <View style={styles.runResultItem}>
      <Text style={styles.runResultText}>Date: {item.timestamp.split('T')[0]}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 4}}>
        <Text style={styles.runResultText}>Distance: {item.totalDistance} km</Text>
        <Text style={styles.runResultText}>
          Duration: {item.duration ? formatDuration(item.duration) : 'Chưa có thời gian'}
        </Text>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.runResultItem}>
      <Text style={styles.runResultText}>No run results available</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Running</Text>

      <TouchableOpacity onPress={startWatchingLocation} disabled={watchId !== null}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Start Running</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={stopWatchingLocation} disabled={watchId === null}>
        <View style={[styles.button, { backgroundColor: 'red' }]}>
          <Text style={styles.buttonText}>Stop</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.totalDistance}>Total Distance: {totalDistance} km</Text>

      <FlatList
        data={runResults}
        renderItem={renderRunResult}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={renderEmptyList}
        style={styles.runResultsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  button: {
    backgroundColor: 'green',
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  totalDistance: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  totalDuration: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  runResultsContainer: {
    marginTop: 20,
    marginBottom: 70,
  },
  runResultItem: {
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 5,
    borderRadius: 5,
  },
  runResultText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600'
  },
});

export default Run;

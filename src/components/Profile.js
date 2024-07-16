import { Image, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon2 from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';




const Profile = () => {
  const [fullname, setFullname] = useState('');
  const [loading, setLoading] = useState(true); // Thêm state loading
  const navigation = useNavigation();

  

  const handleLogout = async () => {
    // Hỏi người dùng có muốn đăng xuất không
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Đăng xuất',
          onPress: async () => {
            try {
              await auth().signOut();
              // Đăng xuất thành công, điều hướng tới màn hình đăng nhập (ví dụ: navigate tới màn hình Login)
              // Nếu bạn sử dụng React Navigation, bạn có thể sử dụng hàm navigate từ hook useNavigation
              navigation.navigate('Login');
              console.log('User signed out successfully');
            } catch (error) {
              console.error('Error signing out: ', error);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };


  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const uid = currentUser.uid;
        console.log('User UID:', uid); // Kiểm tra uid
        try {
          const userDocument = await firestore().collection('users').doc(uid).get();
          if (userDocument.exists) {
            const userData = userDocument.data();
            console.log('User Data:', userData); // Kiểm tra dữ liệu người dùng
            setFullname(userData.fullname);
          } else {
            console.log('User document does not exist.');
          }
        } catch (error) {
          console.log('Error fetching user data: ', error);
        }
      } else {
        console.log('No user is logged in.');
      }
      setLoading(false); // Kết thúc trạng thái loading
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignSelf: 'center' }}>
      <View>
        <Image
          resizeMode='contain'
          style={{ alignSelf: 'center', width: 100, height: 90, marginTop: 40 }}
          source={require('../img/avt.png')}
        />
        <Image
          resizeMode='contain'
          style={{ alignSelf: 'center', position: 'absolute', top: 108, left: 200 }}
          source={require('../img/avt_edit.png')}
        />
        <Text
          style={{ fontSize: 20, fontWeight: 'bold', color: '#000', alignSelf: 'center', marginTop: 10 }}
        >
          {fullname || 'No Fullname Found'}
        </Text>
      </View>

      <View style={{ width: 380, alignSelf: 'center', flexDirection: 'column', padding: 10, borderRadius: 10, margin: 10, borderColor: "#d3d3d3", borderWidth: 1 }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 8 }}
          onPress={() => navigation.navigate('EditProfile')}>
          <Icon name='file-document-multiple' size={25} color='#000' />
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', marginLeft: 20 }}>Edit profile information</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 8 }}>
          <Icon name='bell' size={25} color='#000' />
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', marginLeft: 20 }}>Notifications</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 8 }}>
          <Icon2 name='language' size={25} color='#000' />
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', marginLeft: 20 }}>Language</Text>
        </View>

        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 8 }}
          onPress={handleLogout}
        >
          <Icon2 name='log-out' size={25} color='#000' />
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', marginLeft: 20 }}>Log out</Text>
        </TouchableOpacity>



      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});

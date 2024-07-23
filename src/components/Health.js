import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from './Header';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Health = () => {
  const [userData, setUserData] = useState(null);
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');

  const currentUser = auth().currentUser;
  const uid = currentUser ? currentUser.uid : null;

  const fetchUserData = async () => {
    if (uid) {
      try {
        const userDoc = await firestore().collection('users').doc(uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          setUserData(data);
          if (data.weight && data.height) {
            calculateBMI(data.weight, data.height);
          } else {
            setBmiResult('Chưa có dữ liệu');
            setBmiCategory('');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [uid]);

  const calculateBMI = (weight, height) => {
    const weightInKg = parseFloat(weight);
    const heightInMeters = parseFloat(height) / 100; // chuyển đổi cm sang mét
    if (!isNaN(weightInKg) && !isNaN(heightInMeters) && heightInMeters > 0) {
      const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
      setBmiResult(bmi);
      categorizeBMI(bmi);
    } else {
      setBmiResult('Chưa có dữ liệu');
      setBmiCategory('');
    }
  };

  const categorizeBMI = (bmi) => {
    let category = '';
    if (bmi < 18.5) {
      category = 'Thiếu cân';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      category = 'Cân đối';
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Thừa cân';
    } else {
      category = 'Béo phì';
    }
    setBmiCategory(category);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', }}>
      <Header title={'BMI'} />
      <View style={{ width: '80%', height: 400, backgroundColor: '#D5D7F2', alignSelf: 'center', marginTop: 100, borderRadius: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: '600', color: '#000', alignSelf: 'center', marginTop: 20 }}>BMI Results</Text>
        {bmiResult && (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            {bmiResult === 'Chưa có dữ liệu' ? (
              <Text style={{ fontSize: 20, color: '#000' }}>{bmiResult}</Text>
            ) : (
              <>
                <Text style={{ fontSize: 20, color: '#000' }}>{`Your BMI: ${bmiResult}`}</Text>
                <Text style={{ fontSize: 18, color: '#000', marginTop: 10 }}>{`Category: ${bmiCategory}`}</Text>
                <Text style={{ fontSize: 18, color: '#000', marginTop: 10, padding: 8, textAlign: 'justify' }}>
                  {bmiCategory === 'Thiếu cân' && 'Thực đơn gợi ý: Thêm các thực phẩm giàu protein và calo vào bữa ăn.'}
                  {bmiCategory === 'Cân đối' && 'Thực đơn gợi ý: Duy trì chế độ ăn uống cân bằng và vận động thường xuyên.'}
                  {bmiCategory === 'Thừa cân' && 'Thực đơn gợi ý: Giảm lượng calo và chất béo, tăng cường vận động.'}
                  {bmiCategory === 'Béo phì' && 'Thực đơn gợi ý: Tham khảo bác sĩ dinh dưỡng để có chế độ ăn uống phù hợp.'}
                </Text>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  genderButton: {
    width: 130,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#8D92F2',
  },
  genderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  submitButton: {
    width: 180,
    height: 48,
    backgroundColor: '#8D92F2',
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Health;

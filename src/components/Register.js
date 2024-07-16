import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Wrapper from './Wrapper';
import firestore from '@react-native-firebase/firestore'; // Thêm Firestore


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [rePassword, setRePassword] = useState('');

  const navigation = useNavigation();

  const onRegister = () => {
    if (!email || !password || !rePassword || !fullname) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (password !== rePassword) {
      Alert.alert('Lỗi', 'Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const {uid} = userCredential.user
        console.log('UID của người dùng:', uid); // Log uid ra console để kiểm tra
        return userCredential.user.updateProfile({
          displayName: fullname,
        })
        .then(() => {
          return firestore().collection('users').doc(uid).set({
            fullname: fullname,
            email: email,
            password: password
          })
        })

      })
      .then(() => {
        ToastAndroid.show('Tạo tài khoản thành công', ToastAndroid.SHORT);
        setEmail('');
        setPassword('');
        setRePassword('');
        setFullname('');
      })
      .catch(err => {
        if (err.code === 'auth/email-already-in-use') {
          ToastAndroid.show('Địa chỉ email đã tồn tại', ToastAndroid.SHORT);
        }

        if (err.code === 'auth/invalid-email') {
          ToastAndroid.show('Địa chỉ email không hợp lệ', ToastAndroid.SHORT);
        }

        console.log(`Lỗi tạo tài khoản: ${err}`);
      });

    const user = auth().currentUser;

    if (user) {
      console.log('Full Name:', user.displayName);
      console.log('Email:', user.email);
      // Bạn có thể lấy thêm các thuộc tính khác như photoURL nếu đã được thiết lập
    }
  };

  return (
    <Wrapper disableAvoidStatusBar={true}>
      <View style={{ flex: 1, backgroundColor: '#D5D7F2' }}>
        <Image
          style={{ width: 400, height: 130, alignSelf: 'center', marginTop: 40 }}
          source={require('../img/register_img.png')}
        />
        <Text
          style={{
            fontSize: 24,
            color: '#fff',
            fontWeight: 'bold',
            alignSelf: 'center',
            marginTop: 20,
          }}>
          Wellcome Back
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: '#fff',
            fontWeight: '400',
            alignSelf: 'center',
            marginVertical: 8,
            marginBottom: 18,
          }}>
          Please Log into your existing account
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Fullname"
          placeholderTextColor="#828282"
          value={fullname}
          onChangeText={value => setFullname(value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#828282"
          value={email}
          onChangeText={value => setEmail(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#828282"
          value={password}
          onChangeText={value => setPassword(value)}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Re Password"
          placeholderTextColor="#828282"
          value={rePassword}
          onChangeText={value => setRePassword(value)}
          secureTextEntry
        />

        <TouchableOpacity
          style={{
            alignSelf: 'center',
            width: 200,
            height: 46,
            backgroundColor: '#8D92F2',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            elevation: 2,
            margin: 20,
          }}
          onPress={onRegister}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>
            Register
          </Text>
        </TouchableOpacity>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#828282', marginTop: 10, fontSize: 16 }}>
            already have a account?{' '}
            <Text
              onPress={() => navigation.navigate('Login')}
              style={{ color: '#3D46F2' }}>
              Login
            </Text>
          </Text>
        </View>
      </View>
    </Wrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  input: {
    height: 48,
    width: 340,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: 8,
    borderColor: '#d3d3d3',
    elevation: 3,
    alignSelf: 'center',
  },
});

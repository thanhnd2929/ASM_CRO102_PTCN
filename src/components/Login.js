import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Alert
} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import CheckBox from 'react-native-check-box';
import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {

  const [isChecked, setIsChecked] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

 
  const onLogin = () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }


    auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log('Login response:', res);
        ToastAndroid.show('Đăng nhập thành công', ToastAndroid.SHORT);
        
        navigation.navigate('BottomTab'); // Chuyển sang màn hình Home
        setEmail('');
        setPassword('');
      })
      .catch(err => {
        console.log(`Lỗi đăng nhập: ${err}`);
        let errorMessage = 'Đã có lỗi xảy ra';
        switch (err.code) {
          case 'auth/user-not-found':
            errorMessage = 'Người dùng không tồn tại';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Địa chỉ email không hợp lệ';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Mật khẩu không đúng';
            break;
          default:
            errorMessage = 'Đã có lỗi xảy ra';
        }
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      });
      
  }

  return (
    <View style={{flex: 1, backgroundColor: '#D5D7F2'}}>
      <Image
        style={{width: 290, height: 130, alignSelf: 'center', marginTop: 40}}
        source={require('../img/login_img.png')}
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
          marginBottom: 18
        }}>
        Please Log into your existing account
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#828282"
        value={email}
        onChangeText={value => setEmail(value)}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#828282"
        value={password}
        onChangeText={value => setPassword(value)}
        multiline
      />

      <View style={{marginVertical: 12, marginLeft: 28}}>
        <CheckBox
          isChecked={isChecked}
          onClick={() => setIsChecked(!isChecked)}
          rightText="Remember Password"
          rightTextStyle={{color: '#6B5E5E', fontSize: 14, fontWeight: '400'}}
        />
      </View>

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
        onPress={onLogin}>
        <Text style={{fontSize: 16, fontWeight: '800', color: '#fff'}}>
          Login
        </Text>
      </TouchableOpacity>

      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: '#828282', marginTop: 36, fontSize: 16}}>
          Don’t have account? Click{' '}
          <Text onPress={() => navigation.navigate('Resgister')} style={{color: '#3D46F2'}}>Register</Text>
        </Text>
        <Text style={{color: '#828282', marginTop: 10, fontSize: 16}}>
          Forget Password? Click <Text style={{color: '#3D46F2'}}>Reset</Text>
        </Text>
      </View>
    </View>
  );
};

export default Login;

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

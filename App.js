import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Home from './src/components/Home'
import Login from './src/components/Login'
import Register from './src/components/Register'
import TabNavigator from './src/navigator/TabNavigator'
import auth from '@react-native-firebase/auth';
import EditProfile from './src/components/EditProfile'
import Profile from './src/components/Profile'
import Run from './src/components/Run'
import Health from './src/components/Health'
import YogaAndBMI from './src/components/YogaAndBMI'
import messaging from '@react-native-firebase/messaging';
import YogaScreen from './src/components/YogaScreen'
import ThienScreen from './src/components/ThienScreen'
import MusicScreen from './src/components/MusicScreen'
import AlarmScreen from './src/components/AlarmScreens'



const App = () => {

  const Stack = createNativeStackNavigator();

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    } catch (error) {
      console.error('Failed to get FCM token:', error);
    }
  };

  useEffect(() => {
    requestUserPermission()
    getToken()
  }, [])



  return (
    <NavigationContainer>
      <StatusBar backgroundColor='#D5D7F2' barStyle='light-content' />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Resgister' component={Register} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='BottomTab' component={TabNavigator} />
        <Stack.Screen name='EditProfile' component={EditProfile} />
        <Stack.Screen name='Profile' component={Profile} />
        <Stack.Screen name='Run' component={Run} />
        <Stack.Screen name='Health' component={Health} />
        <Stack.Screen name='Yoga' component={YogaAndBMI} />
        <Stack.Screen name='YogaScreen' component={YogaScreen} />
        <Stack.Screen name='Thien' component={ThienScreen} />
        <Stack.Screen name='Music' component={MusicScreen} />
        <Stack.Screen name='Alarm' component={AlarmScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
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


const App = () => {

  const Stack = createNativeStackNavigator();

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

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})
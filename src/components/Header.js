import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title }) => {
  const navigation = useNavigation();
  console.log("header ....s");
  const handleGoBack = () => {
    console.log('Back icon pressed');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Pressable  onPress={handleGoBack}>
      <Icon  
          name='arrowleft'
          size={30}
          color='#000'/>
      </Pressable>
      
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    backgroundColor: '#8D92F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  icon: {
    position: 'absolute',
    left: 10,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 24
  },
});

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Health = () => {
  const [selectedGender, setSelectedGender] = useState(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  const genderButtonStyle = (gender) => {
    if (selectedGender === gender) {
      return {
        backgroundColor: '#8D92F2',
        borderColor: '#000',
      };
    }
    return {
      borderColor: '#8D92F2',
    };
  };

  const genderTextStyle = (gender) => {
    if (selectedGender === gender) {
      return {
        color: '#fff',
      };
    }
    return {
      color: '#8D92F2',
    };
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 10, marginTop: 30, flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <TouchableOpacity
          style={[styles.genderButton, genderButtonStyle('male')]}
          onPress={() => handleGenderSelect('male')}
        >
          <Icon name='male' size={25} color={genderTextStyle('male').color} />
          <Text style={[styles.genderText, genderTextStyle('male')]} >Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, genderButtonStyle('female')]}
          onPress={() => handleGenderSelect('female')}
        >
          <Icon name='female' size={25} color={genderTextStyle('female').color} />
          <Text style={[styles.genderText, genderTextStyle('female')]} >Female</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rowContainer}>
        <View style={styles.column}>
          <Text style={styles.label}>Weight {'(cm)'}</Text>
          <TextInput
            style={[styles.input, { width: 110 }]}
            placeholder="kg"
            value={weight}
            onChangeText={setWeight}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Height {'(m)'}</Text>
          <TextInput
            style={[styles.input, { width: 110 }]}
            placeholder="cm"
            value={height}
            onChangeText={setHeight}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Birthday</Text>
          <TextInput
            style={[styles.input, { width: 110 }]}
            placeholder="Birthday"
            value={birthday}
            onChangeText={setBirthday}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
      >
        <Text style={styles.submitButtonText}>SUBMIT</Text>
      </TouchableOpacity>

      <View style={{width: '80%', height: 400, backgroundColor: '#D5D7F2',alignSelf: 'center', marginTop: 20, borderRadius: 20}}>
          <Text style={{fontSize: 24, fontWeight: '600', color: '#000',alignSelf: 'center', marginTop: 20}}>BMI Results</Text>
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
  input: {
    height: 48,
    width: 340,
    marginVertical: 8,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#D5D7F2',
    color: 'black',
    borderRadius: 8,
    borderColor: '#d3d3d3',
    elevation: 3,
    alignSelf: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
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
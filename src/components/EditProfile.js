import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Header from './Header'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import DatePicker from 'react-native-datepicker'

const EditProfile = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [genre, setGenre] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [birthday, setBirthday] = useState('');

    const handleDateChange = (date) => {
        setBirthday(date);
    };

    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth().currentUser;
            if (currentUser) {
                const uid = currentUser.uid;
                try {
                    const userDocument = await firestore().collection('users').doc(uid).get();
                    if (userDocument.exists) {
                        const userData = userDocument.data();
                        setFullname(userData.fullname || '');
                        setEmail(userData.email || '');
                        setGenre(userData.genre || '');
                        setWeight(userData.weight || '');
                        setHeight(userData.height || '');
                        setBirthday(userData.birthday || '');
                    } else {
                        console.log('User document does not exist.');
                    }
                } catch (error) {
                    console.log('Error fetching user data: ', error);
                }
            } else {
                console.log('No user is logged in.');
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async () => {
        const currentUser = auth().currentUser;
        if (currentUser) {
            const uid = currentUser.uid;
            try {
                await firestore().collection('users').doc(uid).update({
                    fullname,
                    email,
                    genre,
                    weight,
                    height,
                    birthday,
                });
                Alert.alert('User information updated successfully');
                // Optional: Navigate back to Profile screen or show a success message
                navigation.goBack();
            } catch (error) {
                console.log('Error updating user information: ', error);
            }
        }
    };

    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <Header title={'Edit Profile'} />
            <View style={{ marginTop: 80 }}>
                <Text style={styles.label}>Fullname</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Fullname'
                    value={fullname}
                    onChangeText={setFullname}
                />
            </View>
            <View style={{ marginTop: 8 }}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={{ marginTop: 8 }}>
                <Text style={styles.label}>Genre</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Genre'
                    value={genre}
                    onChangeText={setGenre}
                />
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
                onPress={handleSubmit}
            >
                <Text style={styles.submitButtonText}>SUBMIT</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    label: {
        marginLeft: 28,
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
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
        marginTop: 60,
    },
    submitButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});

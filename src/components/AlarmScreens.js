import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PushNotification from 'react-native-push-notification';

const AlarmScreen = () => {
  const [reminderText, setReminderText] = useState('');
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleSetReminder = () => {
    const now = new Date();
    const reminderDate = new Date(reminderTime);

    // Nếu thời gian nhắc nhở đã qua trong ngày, đặt cho ngày mai
    if (reminderDate <= now) {
      reminderDate.setDate(now.getDate() + 1);
    }

    const notificationId = Math.random().toString(36).substring(7);

    // Đặt thông báo
    PushNotification.localNotificationSchedule({
      id: notificationId,
      title: 'Reminder',
      message: `Reminder: ${reminderText}`,
      date: reminderDate, // Thời gian để thông báo hiện
      allowWhileIdle: true, // Cho phép thông báo khi thiết bị đang ở chế độ ngủ
    });

    Alert.alert('Reminder Set', `You will be reminded: ${reminderText} at ${reminderDate.toLocaleTimeString()}`);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || reminderTime;
    setShowPicker(Platform.OS === 'ios');
    setReminderTime(currentTime);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set a Reminder</Text>
      <TextInput
        style={styles.input}
        placeholder="Reminder Text"
        value={reminderText}
        onChangeText={setReminderText}
      />
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.timePicker}>
        <Text style={styles.timeText}>{reminderTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
      <Button title="Set Reminder" onPress={handleSetReminder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  timePicker: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
  },
  timeText: {
    fontSize: 18,
  },
});

export default AlarmScreen;

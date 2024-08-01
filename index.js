/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import TrackPlayer from 'react-native-track-player';
import PushNotification from 'react-native-push-notification';
import { playbackService } from './src/service/trackPlayerService';

PushNotification.configure({
    onRegister: function (token) {
        console.log("TOKEN:", token);
    },
    onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    // onAction: function (notification) {
    //   console.log("ACTION:", notification.action);
    //   console.log("NOTIFICATION:", notification);
    // },
    // onRegistrationError: function(err) {
    //   console.error(err.message, err);
    // },
    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
});

// Tạo kênh thông báo
PushNotification.createChannel(
    {
        channelId: "reminder-channel", // ID duy nhất cho kênh thông báo
        channelName: "Reminder Channel", // Tên của kênh thông báo
        channelDescription: "A channel to manage reminder notifications", // Mô tả của kênh
        playSound: true, // Phát âm thanh khi nhận thông báo
        soundName: "default", // Âm thanh mặc định
        importance: 4, // Độ quan trọng của thông báo
        vibrate: true, // Rung khi nhận thông báo
    },
    (created) => console.log(`createChannel returned '${created}'`) // Kiểm tra xem kênh đã được tạo chưa
);

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => playbackService);

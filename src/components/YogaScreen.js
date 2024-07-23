import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import Header from './Header';

const YogaScreen = () => {
    const videos = [
        { id: 'v7AYKMP6rOE', title: '30-Minute Yoga for Beginners' },
        { id: '4pKly2JojMw', title: 'Morning Yoga Routine' },
        { id: 'X3-gKPNyrTA', title: 'Yoga for Relaxation and Stress Relief' },
    ];

    return (
        <View style={{flex: 1}}>
            <Header title='Yoga Videos'/>
            <ScrollView style={styles.container}>
                {videos.map(video => (
                    <View key={video.id} style={styles.videoContainer}>
                        <Text style={styles.videoTitle}>{video.title}</Text>
                        <YoutubePlayer height={200} play={false} videoId={video.id} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
   
    videoContainer: {
        marginBottom: 24,
    },
    videoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

export default YogaScreen;

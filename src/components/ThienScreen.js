import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import Header from './Header';

const ThienScreen = () => {

    const videos  = [
        { id: 'U9YKY7fdwyg', title: '10-Minute Meditation For Beginners'},
        { id: 'JslvBcIVtDg', title: 'How To Meditate For Beginners (Animated)'},
        { id: '4pLUleLdwY4', title: 'Meditation for Anxiety'},

    ]

    return (
        <View style={{ flex: 1 }}>
            <Header title='Thien Videos' />
            <ScrollView style={styles.container}>
                {videos.map(video => (
                    <View key={video.id} style={styles.videoContainer}>
                        <Text style={styles.videoTitle}>{video.title}</Text>
                        <YoutubePlayer height={200} play={false} videoId={video.id} />
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default ThienScreen


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
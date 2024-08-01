import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, { useTrackPlayerEvents, Event, State, useProgress } from 'react-native-track-player';
import { setupPlayer, addTracks } from '../service/trackPlayerService';

// Playlist Item Component
const PlaylistItem = ({ index, title, isCurrent, onPress }) => (
    <TouchableOpacity onPress={() => onPress(index)}>
        <Text style={{ ...styles.playlistItem, backgroundColor: isCurrent ? '#666' : 'transparent' }}>
            {title}
        </Text>
    </TouchableOpacity>
);

// Playlist Component
const PlayList = ({ queue, currentTrack, onItemPress }) => (
    <View style={styles.playlist}>
        <FlatList
            data={queue}
            renderItem={({ item, index }) => (
                <PlaylistItem
                    index={index}
                    title={item.title}
                    isCurrent={currentTrack === index}
                    onPress={onItemPress}
                />
            )}
            keyExtractor={item => item.id}
        />
    </View>
);

const MusicScreen = () => {
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [queue, setQueue] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [duration, setDuration] = useState(0);
    
    const { position } = useProgress();

    useEffect(() => {
        async function initializePlayer() {
            const isSetup = await setupPlayer();
            if (isSetup) {
                const queue = await TrackPlayer.getQueue();
                setQueue(queue);
                if (queue.length <= 0) {
                    await addTracks();
                    const updatedQueue = await TrackPlayer.getQueue();
                    setQueue(updatedQueue);
                }
                setIsPlayerReady(true);
            } else {
                setIsPlayerReady(false);
            }
        }
        initializePlayer();
    }, []);

    const updateTrackDuration = async (index) => {
        const trackObject = await TrackPlayer.getTrack(index);
        if (trackObject && trackObject.duration) {
            setDuration(trackObject.duration);
            console.log(`Track duration: ${trackObject.duration} seconds`);
        } else {
            console.log('Track duration not available');
        }
    };

    useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackState], async (event) => {
        if (event.type === Event.PlaybackTrackChanged) {
            const index = await TrackPlayer.getCurrentTrack();
            setCurrentTrack(index);
            updateTrackDuration(index);
        }
        if (event.type === Event.PlaybackState && event.state === State.Playing) {
            const index = await TrackPlayer.getCurrentTrack();
            setCurrentTrack(index);
            updateTrackDuration(index);
        }
    });

    const handlePlay = async () => {
        try {
            await TrackPlayer.play();
            const index = await TrackPlayer.getCurrentTrack();
            updateTrackDuration(index);
        } catch (e) {
            console.error(e);
        }
    };

    const handlePause = async () => {
        try {
            await TrackPlayer.pause();
        } catch (e) {
            console.error(e);
        }
    };

    const handleNext = async () => {
        try {
            await TrackPlayer.skipToNext();
        } catch (e) {
            console.error(e);
        }
    };

    const handlePrevious = async () => {
        try {
            await TrackPlayer.skipToPrevious();
        } catch (e) {
            console.error(e);
        }
    };

    const handleTrackChange = async (index) => {
        try {
            await TrackPlayer.skip(index);
            updateTrackDuration(index);
        } catch (e) {
            console.error(e);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (!isPlayerReady) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#bbb" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.controls}>
                <Button title="Previous" color="#777" onPress={handlePrevious} />
                <Button title="Play" color="#777" onPress={handlePlay} />
                <Button title="Pause" color="#777" onPress={handlePause} />
                <Button title="Next" color="#777" onPress={handleNext} />
            </View>
            <View style={styles.progress}>
                <Text style={styles.progressText}>{formatTime(position)}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={position}
                    minimumTrackTintColor="#1db954"
                    maximumTrackTintColor="#444"
                    thumbTintColor="#1db954"
                    onSlidingComplete={async value => {
                        await TrackPlayer.seekTo(value);
                    }}
                />
                <Text style={styles.progressText}>{formatTime(duration)}</Text>
            </View>
            <PlayList queue={queue} currentTrack={currentTrack} onItemPress={handleTrackChange} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#112'
    },
    playlist: {
        marginTop: 20,
    },
    playlistItem: {
        padding: 10,
        marginVertical: 5,
        color: '#fff',
        borderRadius: 5,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    progress: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    progressText: {
        color: '#fff',
    },
    slider: {
        flex: 1,
        height: 40,
        marginHorizontal: 10,
    }
});

export default MusicScreen;

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import Video from 'react-native-video';
import Header from './Header';

const MusicScreen = () => {
  const [currentTrack, setCurrentTrack] = useState(null);

  const tracks = [
    { id: '1', title: 'Track 1', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: '2', title: 'Track 2', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: '3', title: 'Track 3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    // Thêm các bài nhạc khác tại đây
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setCurrentTrack(item.url)}>
      <Text style={styles.trackItem}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title='Music'/>
      <FlatList
        data={tracks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      {currentTrack && (
        <Video
          source={{ uri: currentTrack }}
          audioOnly={true}
          controls={true}
          style={styles.audioPlayer}
        />
      )}
    </View>
  );
};

export default MusicScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
  trackItem: {
    fontSize: 18,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    textAlign: 'center',
  },
  audioPlayer: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
  },
});

import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, FlatList, Modal, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Home = () => {
  const [data, setData] = useState([]);
  const [content, setContent] = useState('');
  const [createAt, setCreateAt] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewContent, setViewContent] = useState('');

  const currentUser = auth().currentUser;
  const uid = currentUser ? currentUser.uid : null;

  const handleSavePost = async () => {
    if (!content) {
      Alert.alert('Lỗi', 'Vui lòng điền nội dung.');
      return;
    }

    try {
      if (isEditing) {
        // Sửa post
        await firestore().collection('users').doc(uid).collection('posts').doc(currentId).update({
          content,
          createAt: firestore.FieldValue.serverTimestamp()
        });
        Alert.alert('Thành công', 'Đã cập nhật dữ liệu thành công.');
      } else {
        // Thêm post mới
        await firestore().collection('users').doc(uid).collection('posts').add({
          content,
          createAt: firestore.FieldValue.serverTimestamp()
        });
        Alert.alert('Thành công', 'Đã thêm dữ liệu thành công.');
      }
      setModalVisible(false);
      setContent('');
      setIsEditing(false);
      setCurrentId(null);
      fetchData();
    } catch (error) {
      console.error('Error saving post: ', error);
      Alert.alert('Lỗi', 'Không thể lưu dữ liệu.');
    }
  }

  const handleDeletePost = async (id) => {
    try {
      await firestore().collection('users').doc(uid).collection('posts').doc(id).delete();
      Alert.alert('Thành công', 'Đã xoá dữ liệu thành công.');
      fetchData();
    } catch (error) {
      console.error('Error deleting post: ', error);
      Alert.alert('Lỗi', 'Không thể xoá dữ liệu.');
    }
  };

  const fetchData = async () => {
    try {
      const postCollections = await firestore().collection('users').doc(uid).collection('posts').get();
      const postData = postCollections.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createAt: data.createAt ? data.createAt.toDate().toLocaleDateString() : 'Unknown'
        };
      });
      setData(postData);
    } catch (error) {
      console.error('Error fetching post: ', error);
    }
  };

  useEffect(() => {
    if (uid) {
      fetchData();
    }
  }, [uid]);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <View>
          <Text style={styles.itemTitle}>{item.createAt}</Text>
          <Text ellipsizeMode='tail' numberOfLines={1} style={styles.itemContent}
            onPress={() => {
              setViewContent(item.content);
              setViewModalVisible(true);
            }}
          >{item.content}</Text>
        </View>
        <View style={styles.itemActions}>
          <TouchableOpacity onPress={() => {
            setIsEditing(true);
            setCurrentId(item.id);
            setContent(item.content);
            setModalVisible(true);
          }}>
            <Image style={styles.itemIcon} source={require('../img/Pencil.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeletePost(item.id)}>
            <Image style={styles.itemIcon} source={require('../img/vector.png')} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#D5D7F2' }}>
      <ScrollView style={{ margin: 15 }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id} />
      </ScrollView>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Image source={require('../img/plus.png')} />
      </TouchableOpacity>

      {/* ADD & UPDATE MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{isEditing ? 'Edit Post' : 'Add New Post'}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Content"
              value={content}
              onChangeText={setContent}
              multiline={true}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSavePost}
              >
                <Image style={{ width: 25, height: 25 }} source={require('../img/check.png')} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#9395D3' }]}
                onPress={() => setModalVisible(false)}
              >
                <Image source={require('../img/cancel.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DETAILS MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={viewModalVisible}
        onRequestClose={() => setViewModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Xem nội dung</Text>
            <ScrollView style={styles.viewContent}>
              <Text style={styles.fullContentText}>{viewContent}</Text>
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#9395D3' }]}
              onPress={() => setViewModalVisible(false)}
            >
              <Image source={require('../img/cancel.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingLeft: 16,
    marginVertical: 8,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  itemContent: {
    fontSize: 14,
    fontWeight: '900',
    color: '#9395D3',
    width: 250,
    marginTop: 4,
  },
  itemStatus: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  itemIcon: {
    marginHorizontal: 8,
  },
  button: {
    width: 70,
    height: 70,
    backgroundColor: '#9395D3',
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 85,
    right: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  modalInput: {
    width: '100%',
    height: 180,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top'
  },
  modalButton: {
    backgroundColor: '#9395D3',
    borderRadius: 15,
    padding: 10,
    margin: 10,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  viewContent: {
    width: '100%',
    height: 180,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  fullContentText: {
    fontSize: 16,
    color: '#000'
  }
});

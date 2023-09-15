import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Album from '../component/Album';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { storage } from '../../App';

function AddAlbum() {
  const navigation = useNavigation();

  function createAlbum() {
    navigation.navigate('Camera', { newAlbum: true });
  }

  return (
    <Pressable onPress={createAlbum} style={styles.iconContainer}>
      <AntDesign name="plus" color="black" size={48} />
    </Pressable>
  );
}

function GalleryScreen() {
  const [albumState, setAlbumState] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const albumsJSON = storage.getString('albums');
      let albums = null;
      if (albumsJSON) {
        albums = JSON.parse(albumsJSON);
      } else {
        albums = [];
      }

      setAlbumState(albums);
    }, []),
  );

  function PressableAlbum({ image, name }) {
    function viewAlbum() {
      navigation.navigate('Album', { album: name });
      return null;
    }

    return (
      <Pressable onPress={viewAlbum}>
        <Album imageURL={image} />
      </Pressable>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={albumState}
        style={styles.flatlist}
        // numColumns={2}
        renderItem={({ item }) => (
          <PressableAlbum image={item.image} name={item.name} />
        )}
        ListFooterComponent={AddAlbum}
      />
      {/* <AddAlbum /> */}
    </View>
  );
}

export default GalleryScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'black',
  },
  flatlist: {
    flex: 1,
    marginTop: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Album from '../component/Album';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { storage } from '../../App';
import createAlbum from '../util/createAlbum';
import { Routes } from '../Routes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import updateAlbum from '../util/updateAlbum';

function AddAlbum(newUri, path) {
  const navigation = useNavigation();

  function onButtonPress() {
    createAlbum(newUri, path);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Camera' }],
    });
  }

  return (
    <Pressable onPress={onButtonPress} style={styles.iconContainer}>
      <AntDesign name="plus" color="black" size={48} />
    </Pressable>
  );
}

type Props = NativeStackScreenProps<Routes, 'AlbumSelector'>;
function AlbumSelector({ navigation, route }: Props) {
  const albumsJSON = storage.getString('albums');
  let albums = null;
  if (albumsJSON) {
    albums = JSON.parse(albumsJSON);
  } else {
    albums = [];
  }

  function PressableAlbum({ image, name }) {
    function appendAlbum() {
      updateAlbum(route.params.newUri, name);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Camera' }],
      });
      return null;
    }

    return (
      <Pressable onPress={appendAlbum}>
        <Album imageURL={image} />
      </Pressable>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Please select an album to save to</Text>
      </View>

      <FlatList
        data={albums}
        style={styles.flatlist}
        // numColumns={2}
        renderItem={({ item }) => (
          <PressableAlbum image={item.image} name={item.name} />
        )}
        ListFooterComponent={AddAlbum(route.params.newUri, route.params.path)}
      />
      {/* <AddAlbum /> */}
    </View>
  );
}

export default AlbumSelector;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatlist: {
    flex: 1,
    marginTop: 10,
  },
  title: {
    paddingTop: 10,
    justifyContent: 'center',
  },
  titleText: {
    color: 'black',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

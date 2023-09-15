import React, { useState } from 'react';
import {
  Button,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { storage } from '../../App';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<Routes, 'AlbumSelector'>;
function CarouselScreen({ navigation, route }: Props) {
  const width = Dimensions.get('window').width;
  const [imageState, setImageState] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const imagesJSON = storage.getString(route.params.album);
      const images = JSON.parse(imagesJSON);

      setImageState(images);
    }, [route.params.album]),
  );

  function CarouselItem({ index }) {
    function buttonPress() {
      navigation.navigate('Camera', {
        imageURI: imageState[index],
        album: route.params.album,
      });
    }

    return (
      <View
        style={{
          flex: 1,
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{ uri: imageState[index] }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <Button title="Use" onPress={buttonPress} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop={false}
        width={width}
        data={imageState}
        // autoPlay={true}
        // autoPlayInterval={50}
        renderItem={({ index }) => <CarouselItem index={index} />}
      />
    </View>
  );
}

export default CarouselScreen;

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

function Album({ imageURL }) {
  return (
    <View style={styles.container}>
      <Image
        source={{ width: 200, height: 200, uri: imageURL }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
  },
});

export default Album;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Pressable,
} from 'react-native';
import Video, { LoadError, OnLoadData } from 'react-native-video';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Alert } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import type { NativeSyntheticEvent } from 'react-native';
import type { ImageLoadEventData } from 'react-native';

import { useIsFocused } from '@react-navigation/core';
import { Routes } from '../Routes';
import { useIsForeground } from '../hooks/useIsForeground';
import { SAFE_AREA_PADDING } from '../Constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { storage } from '../../App';
import createAlbum from '../util/createAlbum';
import updateAlbum from '../util/updateAlbum';

const requestSavePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  if (permission == null) return false;
  let hasPermission = await PermissionsAndroid.check(permission);
  if (!hasPermission) {
    const permissionRequestResult = await PermissionsAndroid.request(
      permission,
    );
    hasPermission = permissionRequestResult === 'granted';
  }
  return hasPermission;
};

const isVideoOnLoadEvent = (
  event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>,
): event is OnLoadData => 'duration' in event && 'naturalSize' in event;

type Props = NativeStackScreenProps<Routes, 'Media'>;
export function MediaPage({ navigation, route }: Props): React.ReactElement {
  if (!route.params) return <View></View>;
  const { path, type } = route.params;

  const [hasMediaLoaded, setHasMediaLoaded] = useState(false);
  const isForeground = useIsForeground();
  const isScreenFocused = useIsFocused();
  const [savingState, setSavingState] = useState<'none' | 'saving' | 'saved'>(
    'none',
  );

  useEffect(() => {
    setSavingState('none');
  }, [setSavingState, route]);

  const onMediaLoad = useCallback(
    (event: OnLoadData | NativeSyntheticEvent<ImageLoadEventData>) => {
      console.log(
        `Image loaded. Size: ${event.nativeEvent.source.width}x${event.nativeEvent.source.height}`,
      );
    },
    [],
  );
  const onMediaLoadEnd = useCallback(() => {
    console.log('media has loaded.');
    setHasMediaLoaded(true);
  }, []);

  const onMediaLoadError = useCallback((error: LoadError) => {
    console.log(`failed to load media: ${JSON.stringify(error)}`);
  }, []);

  const onSavePressed = useCallback(async () => {
    try {
      setSavingState('saving');

      const hasPermission = await requestSavePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission denied!',
          'Vision Camera does not have permission to save the media to your camera roll.',
        );
        return;
      }
      let newUri = await CameraRoll.save(`file://${path}`, {
        type: type,
        album: 'Transparent Overlay',
      });

      // If new album
      if (route?.params?.newAlbum) {
        createAlbum(newUri, path);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Camera' }],
        });
      } else {
        // If album is set
        if (route?.params?.album) {
          updateAlbum(newUri, route?.params?.album);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Camera' }],
          });
        } else {
          navigation.navigate('AlbumSelector', { newUri: newUri, path: path });
        }
      }

      setSavingState('saved');
    } catch (e) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      setSavingState('none');
      Alert.alert(
        'Failed to save!',
        `An unexpected error occured while trying to save your ${type}. ${message}`,
      );
    }
  }, [path, type]);

  const source = useMemo(() => ({ uri: `file://${path}` }), [path]);

  const screenStyle = useMemo(
    () => ({ opacity: hasMediaLoaded ? 1 : 0 }),
    [hasMediaLoaded],
  );

  return (
    <View style={[styles.container, screenStyle]}>
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        onLoadEnd={onMediaLoadEnd}
        onLoad={onMediaLoad}
      />

      <Pressable style={styles.closeButton} onPress={navigation.goBack}>
        <IonIcon name="close" size={35} color="white" style={styles.icon} />
      </Pressable>

      <Pressable
        style={styles.saveButton}
        onPress={onSavePressed}
        disabled={savingState !== 'none'}>
        {savingState === 'none' && (
          <IonIcon
            name="download"
            size={35}
            color="white"
            style={styles.icon}
          />
        )}
        {savingState === 'saved' && (
          <IonIcon
            name="checkmark"
            size={35}
            color="white"
            style={styles.icon}
          />
        )}
        {savingState === 'saving' && <ActivityIndicator color="white" />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: SAFE_AREA_PADDING.paddingTop,
    left: SAFE_AREA_PADDING.paddingLeft,
    width: 40,
    height: 40,
  },
  saveButton: {
    position: 'absolute',
    bottom: SAFE_AREA_PADDING.paddingBottom,
    left: SAFE_AREA_PADDING.paddingLeft,
    width: 40,
    height: 40,
  },
  icon: {
    textShadowColor: 'black',
    textShadowOffset: {
      height: 0,
      width: 0,
    },
    textShadowRadius: 1,
  },
});

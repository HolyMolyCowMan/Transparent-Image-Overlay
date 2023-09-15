import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import CameraScreen from './src/screens/CameraScreen';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { MediaPage } from './src/screens/MediaPage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GalleryScreen from './src/screens/GalleryScreen';
import { MMKV } from 'react-native-mmkv';
import AlbumSelector from './src/screens/AlbumSelector';
import CarouselScreen from './src/screens/CarouselScreen';

export const storage = new MMKV();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CameraPhotoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Media"
        component={MediaPage}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AlbumSelector"
        component={AlbumSelector}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function GalleryCarouselStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Album"
        component={CarouselScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function App(): React.ReactElement | null {
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>();

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission);
  }, []);

  console.log(`Re-rendering Navigator. Camera: ${cameraPermission}`);

  if (cameraPermission == null) {
    // still loading
    return null;
  }

  if (cameraPermission !== 'authorized') {
    Camera.requestCameraPermission().then(setCameraPermission);
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="CameraPhoto"
            component={CameraPhotoStack}
            options={{
              headerShown: false,
              tabBarLabel: 'Camera',
              tabBarIcon: () => {
                return <IonIcon name="camera" color="black" size={24} />;
              },
            }}
          />
          <Tab.Screen
            name="GalleryCarousel"
            component={GalleryCarouselStack}
            options={{
              tabBarLabel: 'Gallery',
              headerShown: false,
              tabBarIcon: () => {
                return <IonIcon name="image" color="black" size={24} />;
              },
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
export default App;

import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import CameraOpen from './src/components/CameraOpen';
import * as Medialibrary from 'expo-media-library'
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import PicAndLocation from './src/components/PicAndLocation';


export default function App() {
  const [hasCameraPermissions, setHasCameraPermissions] = useState(null);
  const [toggleCamera, setToggleCamera] = useState(false);
  const [image, setImage] = useState(null);
  const [currentLocation, setCurrentLocation] = useState();
  const cameraRef = useRef(null)

  const getCameraPermissions = async () => {
    Medialibrary.requestPermissionsAsync();
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    let {status} = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted') {
      alert('Please allow permissions in settings')
      return;
    } 

    setHasCameraPermissions(cameraStatus.status === 'granted');
  }


  const handleOpenCamera = async () => {
    getCameraPermissions();
    setToggleCamera(true)
    
  }

  const takePicture = async () => {
    let currentLocation = await Location.getCurrentPositionAsync({});
    setCurrentLocation(currentLocation);
    if(cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data)
        setImage(data.uri)
      } catch(e) {
        console.log(e)
      }
    }
    console.log(currentLocation)
    setToggleCamera(false);
    savePic();
  }

  const savePic = async () => {
    if(image) {
      try {
        await Medialibrary.createAssetAsync(image);
        alert('Pic Saved!');
        // setImage(null);
      } catch(e) {
        console.log(e)
      }
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={{fontSize: 26}}>My Camera App!</Text>
      {(image && !toggleCamera) &&  <PicAndLocation image={image} location={currentLocation} />}
      { !toggleCamera && <Button onPress={handleOpenCamera} title='Open Camera'></Button>}
      {toggleCamera && <CameraOpen cameraRef={cameraRef} takePic={takePicture} />}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

});

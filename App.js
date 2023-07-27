import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import CameraOpen from './src/components/CameraOpen';
import * as Medialibrary from 'expo-media-library'
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import PicAndLocation from './src/components/PicAndLocation';
// import axios from 'axios';

const API = 'http://localhost:5000/api/v1/mycamera';
const API_URL = 'http://192.168.1.9:5000/api/v1/mycamera';

export default function App() {
  const [hasCameraPermissions, setHasCameraPermissions] = useState(null);
  const [toggleCamera, setToggleCamera] = useState(false);
  const [image, setImage] = useState(null);
  const [currentLocation, setCurrentLocation] = useState();
  const cameraRef = useRef(null);

  useEffect(  () => {
    getPictures();
  }, [])

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
        setImage(data.uri)
      } catch(e) {
        console.log(e)
      }
    }
    setToggleCamera(false);
    savePic();
  }

  const savePic = async () => {
    if(image) {
      try {
        await Medialibrary.createAssetAsync(image);
        alert('Pic Saved!');
        sendData();
      } catch(e) {
        console.log(e)
      }
    }
  }

//   const getData = async () => {
//     try {
//       const res = await fetch(API_URL);
//       const data = res.json();
//       console.log(data)
//     }  catch(e) {
//     console.log(e)
//   }
// }

const getPictures = () => {
  fetch(API_URL)
    .then( response => {
      if(!response.ok) {
        throw new Error("Error HTTP: " + response.status)
      }
      return response.json()
    })
    .then( (data) => console.log("My data: ", data) )
    .catch( (error) => console.log(error) )
}

  const sendData = async () => {

    const formData = new FormData();
    formData.append('lat', currentLocation.coords.latitude);
    formData.append('lon', currentLocation.coords.longitude);
    formData.append('picture', {
      name: new Date() + "_picture",
      uri: image,
      type: 'image/jpg'
    })

    const options = {
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        // 'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      body: formData
    }

    try {
      const response = await fetch(API_URL, options);
      const data = await response.json();
      console.log(data)
      return data;
    } catch(e) {
      console.log('Error: ', e)
    }

      
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={{fontSize: 26}}>My Camera App!</Text>
      {(image && !toggleCamera) &&  <PicAndLocation image={image} location={currentLocation} />}
      { !toggleCamera && <Button onPress={handleOpenCamera} title='Open Camera'></Button>}
      {toggleCamera && <CameraOpen cameraRef={cameraRef} takePic={takePicture} handleClose={() => setToggleCamera(false)} />}

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

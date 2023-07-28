import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import CameraOpen from './src/components/CameraOpen';
import * as Medialibrary from 'expo-media-library'
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import PicAndLocation from './src/components/PicAndLocation';

const API_URL = 'http://192.168.1.9:5000/api/v1/mycamera';

export default function App() {

  const cameraRef = useRef();
  const [hasCameraPermissions, setHasCameraPermissions] = useState();

  const [image, setImage] = useState();

  const [toggleCamera, setToggleCamera] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();

  // useEffect(  () => {
  //   getPictures();
  // }, [])

  const getCameraPermissions = async () => {

    try {
      const [cameraStatus, locationStatus] = await Promise.all([
        Camera.requestCameraPermissionsAsync(),
        Location.requestForegroundPermissionsAsync(),
      ]); 

      if(cameraStatus.status === 'granted' && locationStatus.status === 'granted') {
        setHasCameraPermissions(true)
        setToggleCamera(true)
      } else {
        alert('Please allow all the permissions!')
      }
 
    } catch(e) {
      console.log('Error requesting permissions: ', e)
    }

    // const cameraStatus = await Camera.requestCameraPermissionsAsync();
    // const mediaLibraryPermission = await Medialibrary.requestPermissionsAsync();

    // setHasCameraPermissions(cameraStatus.status === 'granted');
    // let {status} = await Location.requestForegroundPermissionsAsync();
    // if(status !== 'granted') {
    //   alert('Please allow location permissions in settings')
    //   return;
    // } 
  }

  const handleOpenCamera = () => {
    getCameraPermissions();
    // console.log("🚀 ~ file: App.js:60 ~ handleOpenCamera ~ hasCameraPermissions:", hasCameraPermissions)
    // if(hasCameraPermissions) {
    //   console.log('open')
    //   setToggleCamera(true)
    // }
    
  }

  const takePicture = async () => {

    let currentLocation = await Location.getCurrentPositionAsync({});
    setCurrentLocation(currentLocation);

    if(cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync({});
        setImage(data.uri)
        setToggleCamera(false);
        savePic(data.uri, currentLocation);

      } catch(e) {
        console.log('Error during taking picture: ', e)
      }
    }

  }

  const savePic = async (pic, location) => {
    if(pic) {
      try {
        // El error esta aqui creo. 
        await Medialibrary.createAssetAsync(pic);
        const response = await sendData(pic, location);
        if(response) {
          alert('Pic Saved!');
        } else {
          alert('Something went wrong. Try again');
        }
        
      } catch(e) {
        console.log('Error during saving picture: ', e)
      }
    }
  }


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

  const sendData = async (pic, location) => {

    const abortControler = new AbortController();
    const signal = abortControler.signal;
    let timerId;
    const formData = new FormData();
    formData.append('lat', location.coords.latitude);
    formData.append('lon', location.coords.longitude);
    formData.append('picture', {
      name: new Date() + "_picture",
      uri: pic,
      type: 'image/jpg'
    })

    const options = {
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      method: 'POST',
      body: formData,
      signal: signal,
    }

    try {

      const timeOut = 3000; 
      timerId = setTimeout(() => {
        abortControler.abort()
      }, timeOut);

      const response = await fetch(API_URL, options);
      if(!response.ok) {
        throw new Error('Error HTTP: ', response.status)
      }
      const data = await response.json();
      console.log(data)
      return data;
    } catch(e) {
      console.log('Error sending request: ', e);
    } finally {
      clearTimeout(timerId)
    }    
  }

 if(hasCameraPermissions === false) {
  return <Text>No camera permissions granted. Check settings.</Text>
}

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>My Camera App!</Text>
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  }

});

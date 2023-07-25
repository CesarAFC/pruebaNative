import React, { useState } from 'react';
import {Camera} from 'expo-camera'
import { StyleSheet } from 'react-native';
import MyButton from './Button';

function CameraOpen({cameraRef, onPress, takePic}) {
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

  return (
    <Camera type={cameraType} style={styles.camera} ref={cameraRef}>
        <MyButton title='Take pic' icon={'camera'} onPress={takePic}></MyButton>
    </Camera>
  )
}

const styles = StyleSheet.create({
    camera: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '90%',
        width: '100%',
    }
})

export default CameraOpen
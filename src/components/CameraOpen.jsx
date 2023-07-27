import React, { useState } from 'react';
import {Camera} from 'expo-camera'
import { View, StyleSheet } from 'react-native';
import MyButton from './Button';
import { Entypo } from '@expo/vector-icons'; 

function CameraOpen({cameraRef, handleClose, takePic}) {
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

  return (
    <Camera type={cameraType} style={styles.camera} ref={cameraRef}>
        <View style={styles.closeButton} >
            <Entypo name='circle-with-cross' size={32} color={'#fff'} onPress={handleClose}></Entypo> 
        </View>
        <MyButton title='Take pic' icon={'camera'} onPress={takePic}></MyButton>
    </Camera>
  )
}

const styles = StyleSheet.create({
    camera: {
        justifyContent: 'space-between',
        paddingTop: 10,
        alignItems: 'center',
        height: '90%',
        width: '100%',
    },
    closeButton: {
        width: '100%', 
        alignItems: 'flex-end', 
        paddingRight: 10
    }
})

export default CameraOpen;
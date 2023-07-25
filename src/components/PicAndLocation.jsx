import React from 'react'
import { Image, StyleSheet, View, Text } from 'react-native'

function PicAndLocation({image, location}) {
  return (
    <View style={styles.container} >
        <Image source={{uri: image}} style={styles.image}/>
        <View style={{padding: 4}} >
            <Text>Lat: {location.coords.latitude}</Text>
            <Text>Long: {location.coords.longitude}</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '50%',
        width: '70%',
    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 20,
      }
})
export default PicAndLocation
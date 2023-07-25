import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import {Entypo} from '@expo/vector-icons'

function MyButton({icon, title, onPress}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttons}>
        <Entypo name={icon} size={22} color={'#fff'} ></Entypo> 
        <Text style={styles.texts} >{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 30,
    },
    texts: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#fff',
        marginLeft: 10,
    }
})

export default MyButton
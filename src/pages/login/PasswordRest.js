import React ,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {View , Text ,TouchableOpacity  ,StyleSheet, TextInput , Alert } from 'react-native'

import {url} from '../../store/url'
const PasswordRest = () => {
    const navigation =useNavigation()
    const [phone , setPhone]=useState('')
    const [password , setPassword]=useState('')
    const getASyncData=async()=>{
  const phn = await AsyncStorage.getItem('phone')
  setPhone(phn)
    }
    const setAsuncData=async(key , value)=>{
        await AsyncStorage.setItem(key , value)
      }
      getASyncData()
        
  
    const handelPost=async()=>{
        try{
          if (!phone || !password) {
            Alert.alert('Please provide phone and password.');
            return;
          }
            const response = await axios.post(`${url}/change_forgot_password/` , {phone:phone , password:password})
            const res=await response.data
            if(response.status===200){
                setAsuncData('password' ,password)
                navigation.navigate('Login')
            }
        }catch(err){Alert.alert(err.message)}
    }
  
    return (
        <View style={styles.container}>
          <Text style={styles.style}>Password Reset</Text>
        <TextInput style={styles.input} value={phone}></TextInput>
        <TextInput style={styles.input} value={password} onChangeText={(txt)=>setPassword(txt)}></TextInput>
        <TouchableOpacity style={styles.button} onPress={()=>handelPost()}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20, // Add space below the text
  },
  input: {
    width: '80%', // Adjust the width as needed
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20, // Add space below the input field
  },
  button: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default PasswordRest;

import React ,{useState ,useEffect} from 'react'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {View , Text ,TouchableOpacity  ,StyleSheet, TextInput , Alert } from 'react-native'
import {url} from '../../store/url'
function ValidatePasswordOtp() {
    const navigation =useNavigation()
    const [otp , setOtp]=useState('')
    const getASyncData=async()=>{
      const phn = await AsyncStorage.getItem('phone')
      console.log(phn)
      setPhone(phn)
    }
    useEffect(()=>{getASyncData()} ,[])
  
    const [phone , setPhone]=useState('')
    const handelPost=async()=>{
        try{
          if (!phone || !otp) {
            Alert.alert('Please provide phone and otp.');
            return;
          }
            const response = await axios.post(`${url}/validate_forgot_otp/` , {phone:phone , otp:otp})
            const res=await response.data
            if(response.status===200){
                navigation.navigate('PasswordReset')
            }
        }catch(err){Alert.alert(err.message)}
    }
  
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Fill Your Otp</Text>
        <TextInput style={styles.input} value={phone}></TextInput>
        <TextInput style={styles.input} value={otp} onChangeText={(txt)=>setOtp(txt)}></TextInput>
        <TouchableOpacity style={styles.button} onPress={()=>handelPost()}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
      </View>
    )
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
      color:'black',
      fontWeight:'600'
    },
    input: {
      width: '80%', // Adjust the width as needed
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 20, // Add space below the input field
      color:'black',
      fontWeight:'600'
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

export default ValidatePasswordOtp

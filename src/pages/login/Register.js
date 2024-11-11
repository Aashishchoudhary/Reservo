import React ,{useState ,useEffect} from 'react'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {View , Text ,TouchableOpacity  ,StyleSheet, TextInput , Alert } from 'react-native'

import {url} from '../../store/url'

function Register() {
  const navigation =useNavigation()
  const [password , setpassword]=useState('')
  const [phone , setPhone]=useState('')
  const [email , setEmail]=useState('')

const setAsuncData=async(key , value)=>{
  await AsyncStorage.setItem(key , value)
}
async function getASyncData(){
  const value = await AsyncStorage.multiGet(['email'])
    
    
  
    setEmail(value[1][1])

}

useEffect(()=>{getASyncData()} ,[])
  

  const handelPost=async()=>{
      try{
        if (!phone||!email || !password) {
          Alert.alert('Please provide phone and password.');
          return;
        }
          const response = await axios.post(`${url}/register/` , {phone:phone , password:password ,email:email})
          const res=await response.data
          console.log(res)
          console.log(phone , password , email)
          if(response.status==200){
            console.log('inside')
            setAsuncData('password' ,password)
              navigation.navigate('Login')

          }
      }catch(err){Alert.alert(err)}
  }
  return (
    <View style={styles.container}>
    <TextInput style={styles.input} onChangeText={(e)=>setPhone(e)} value={phone}></TextInput>
    <TextInput style={styles.input} value={email}></TextInput>
    <TextInput style={styles.input} value={password} onChangeText={(txt)=>setpassword(txt)}></TextInput>
    <TouchableOpacity style={styles.button} onPress={()=>handelPost()}><Text style={styles.buttonText}>Register</Text></TouchableOpacity>
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

export default Register

import React ,{useState} from 'react'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {View , Text ,TouchableOpacity  ,StyleSheet, TextInput , Alert } from 'react-native'
import {url} from '../../store/url'
function RegisterOtp() {
    const navigation = useNavigation()
    const [phone , setPhone]=useState('')
    const [email , setEmail]=useState('')
    const setAsyncData=async(data)=>{
      
await AsyncStorage.multiSet(data)
    }

    const handlePost=async()=>{
      console.warn("OTP will send by sms or via Call")
        try{
          if (!phone && !email) {
            Alert.alert('Please provide phone and password.');
            return;
          }
            const response = await axios.post(`${url}/send-otp/` ,{phone:phone ,email:email})
           
            if (response.status==200){
              console.log('register otp' , phone , email)
                setAsyncData([['phone', phone] ,['email',email]])
                navigation.navigate("Validate")

                
            }
            
        }catch(err){Alert.alert(err.response.data.details)}
    }
  return (
    <View style={styles.container}>
      <Text style={styles.signUpText}>Sign Up</Text>
  <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder='Phone Number...' color={ phone?.length<10?"red":'black'}/>
  <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder='Email Number...' />
  
  <TouchableOpacity style={styles.button} onPress={() => handlePost()}>
    <Text style={styles.buttonText}>Submit</Text>
  </TouchableOpacity>
  <View  style={styles.logintxt}></View><Text >Already have an account? </Text>
  <TouchableOpacity  onPress={() => navigation.navigate('Login')}>
    <Text style={styles.clickableText}>Login</Text>
  </TouchableOpacity>
</View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // Add padding to the sides
  },
  signUpText: {
    fontSize: 24,
    marginBottom: 20, // Add some space between the title and input field
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20, // Add space below the input field
    fontSize: 18,
    color:'black'
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
  logintxt: {
    // Optional: You can use this style to create a line or separator between "Already have an account?" and "Login" if desired.
    borderTopWidth: 1,
    borderColor: 'gray',
    marginVertical: 20,
  },
  clickableText: {
    padding:5,
    color: 'blue',
    borderBottomColor:'black',
    borderBottomWidth:1.5,
  },
});

export default RegisterOtp

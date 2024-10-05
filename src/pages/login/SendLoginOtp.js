import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {url} from '../../store/url'
function SendLoginOtp() {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');

  const asyncData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
     
    } catch (err) {
      console.log(err);
    }
  };
  const handlePost = async () => {
    console.warn("OTP will send by sms or via Call")
    
     if (!phone ) {
        Alert.alert('Please provide phone.');
        return;
      }
      const response = await axios.post(`${url}/send-login-otp/`, {
        username: phone,
      });

      const res = await response.data
      if (res.status === 200) {
        asyncData('phone', phone);
        navigation.navigate('loginotp');
      }
      else if(res.status==405){
        Alert.alert(res.details)
      }
      else{
        Alert.alert('Try again Later...')
      }
    
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={phone}
        placeholder="Enter your phone or Email....."
        onChangeText={phn => setPhone(phn)}></TextInput>
      <TouchableOpacity style={styles.button} onPress={() => handlePost()}>
        <Text style={styles.buttonText}>GET OTP</Text>
      </TouchableOpacity>
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
});
export default SendLoginOtp;

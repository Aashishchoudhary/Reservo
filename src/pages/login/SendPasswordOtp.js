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
function SendPasswordOtp() {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');

  const asyncData = async (key, value) => {
    await AsyncStorage.setItem(key, value);
    console.log(key , value)
  };
  const handlePost = async () => {
    console.warn("OTP will send by sms or via Call")
    try {
      if (!phone ) {
        Alert.alert('Please provide phone.');
        return;
      }
      const response = await axios.post(
        `${url}/validate-phone-forgot//`,
        {username: phone},
      );
      
      if (response.status === 200) {
        asyncData('phone', phone);
        navigation.navigate('ValidateForgotPass');
      }
    } catch (err) {
      Alert.alert(err.response.data.details);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Get Otp to Reset password</Text>
      <TextInput
        style={styles.input}
        value={phone}
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
export default SendPasswordOtp;

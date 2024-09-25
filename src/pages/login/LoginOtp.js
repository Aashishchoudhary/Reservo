import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
 
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import jwtDecode from 'jwt-decode';

import {useDispatch} from 'react-redux';
import {setAuthToken, setUser} from '../../store/auth/authSlice';
import {url} from '../../store/url'
function LoginOtp() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
    async function  getASyncData() {
    try {
      const phn = await AsyncStorage.getItem('phone');
      setPhone(phn);
    } catch (err) {
      console.log(err);
    }
  };

  const setAsyncData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log('err', err);
    }
    console.log('done');
  };
  useEffect(()=>{getASyncData()} ,[])
  const handelPost = async () => {
    try {
      if (!phone || !otp) {
        Alert.alert('Please provide phone and otp.');
        return;
      }
      const response = await axios.post(`${url}/login-with-otp/`, {
        username: phone,
        otp: otp,
      });
      const data = await response.data
      if (response.status === 200) {
        dispatch(setAuthToken(data));
        dispatch(setUser(jwtDecode(data.access)));

        setAsyncData('authTokens', JSON.stringify(data));
        navigation.navigate('drwa', {
          screen: 'viewLib',
          params: {
            screen: 'viewLib',
          },
        });
      }
    } catch (err) {
      console.log(err.response.data.message);
    }
  };
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} value={phone}></TextInput>
      <TextInput
        style={styles.input}
        value={otp}
        onChangeText={txt => setOtp(txt)}></TextInput>
      <TouchableOpacity style={styles.button} onPress={() => handelPost()}>
        <Text style={styles.buttonText}>Login</Text>
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
export default LoginOtp;

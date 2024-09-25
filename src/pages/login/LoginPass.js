import React, {useEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  View
} from 'react-native';
import axios from 'axios';

import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setAuthToken ,setUser} from '../../store/auth/authSlice';

import {url} from '../../store/url'

import {useNavigation} from '@react-navigation/native';
const LoginPass = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [phone, setPhone] = useState();
  const [password, setPassword] = useState();

  async function getASyncData() {
    const userN = await AsyncStorage.getItem('phone');
    const passN = await AsyncStorage.getItem('password');
    setPassword(passN);
    setPhone(userN);
  }
  useEffect(()=>{getASyncData()} ,[])
 

  const setAsyncData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log(err);
    }
    console.log('done');
  };

  const loginHandle = async () => {
    try {
       if (!phone || !password) {
         Alert.alert('Please provide phone and password.');
         return;
       }
      const response = await axios.post(
        `${url}/passlogin/`,
        {username:phone, password:password},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.data;
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
      Alert.alert(err.response.data.details);
    }
  };
  return (
 
      <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={(txt) => setPhone(txt)}
        placeholder="Phone number"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={pswd => setPassword(pswd)}
        placeholder="Password"
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.loginButton} onPress={loginHandle}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity  onPress={() => navigation.navigate('sendloginotp')}>
        <Text style={styles.forgotPasswordButton}>Login With Otp</Text>
      </TouchableOpacity>
      <TouchableOpacity  onPress={() => navigation.navigate('sendForgotPasswordOtp')}>
        <Text style={styles.forgotPasswordButton}>Forgot Password</Text>
      </TouchableOpacity>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 15,
    width: '80%',
    alignItems: 'center',
    borderRadius: 5,
  },
  forgotPasswordButton: {
    
    padding: 15,
    width: '80%',
    alignItems: 'center',
    color:'blue',
   
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
export default LoginPass;

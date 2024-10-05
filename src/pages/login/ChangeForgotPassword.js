import React, {useState ,useCallback,useEffect} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import axios from 'axios';
import {useSelector ,useDispatch} from 'react-redux';
import { setLoading } from '../../store/auth/authSlice';
import { useFocusEffect } from '@react-navigation/native';

import {url} from '../../store/url'
const ChangeForgotPassword = () => {
    

 
    const user = useSelector(state=>state.auth.authTokens)
    
    const [password ,setPassword] = useState('')
    const [phone, setPhone] = useState('');
    async function  getASyncData() {
    try {
      const phn = await AsyncStorage.getItem('phone');
      setPhone(phn);
    } catch (err) {
      console.log(err);
    }
  };
 
  
    const dispatch =useDispatch()
    const postData = async () => {
     
      console.log('button');
      try {
        if (!username|| !password) {
          Alert.alert('Please provide both old and new password field.');
          return;
        }
        const response = await axios.put(
          `${url}/change-forgot-password/`,
          {
            username: phone,
            password: password,
          
          },
          { headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + String(user.access),
            },}
        );
        dispatch(setLoading(true))
        const res = await response.data;
        
        if(response.status==200){
          Alert.alert(res.details)
        }
      } catch (err) {
        Alert.alert(err.response.data.details);
      }
    };
    useFocusEffect(
      useCallback(() => {
        
        dispatch(setLoading(true))
    
        getASyncData()
        return () => {
          // Perform any cleanup here when the component is unmounted or loses focus
        };
      }, []))
  
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Password Change</Text>
        <TextInput
          style={styles.input}
          placeholder="old Password"
          value={username}
          ></TextInput>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(txt) => setPassword(txt)}></TextInput>
  
        <TouchableOpacity style={styles.button} onPress={() => postData()}>
          <Text style={styles.buttonText}>Login</Text>
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

export default ChangeForgotPassword;

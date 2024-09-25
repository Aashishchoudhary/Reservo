import React, {useState ,useCallback} from 'react';
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
const ChangePassword = () => {
  const userID = useSelector(state => state.auth.user);

 
  const user = useSelector(state=>state.auth.authTokens)
  const [oldPass, setOld] = useState('');
  const [newPass, setNewp] = useState('');

  const dispatch =useDispatch()

  const updateData = new FormData();
  updateData.append('old_password',oldPass)
  updateData.append('new_password',newPass)
  updateData.append('refresh',user.refresh)
  const postData = async () => {
   
    console.log('button');
    console.log(updateData)
    try {
      
      if (!oldPass|| !newPass) {
        Alert.alert('Please provide both old and new password field.');
         return;
      }
      
     const response = await axios.put(
        `${url}/change-password/${userID.user_id}/`,
        updateData,
        

        { 
          headers: {
            
            Authorization: "Bearer " + String(user.access),
          },
        }
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
  
      
      return () => {
        // Perform any cleanup here when the component is unmounted or loses focus
      };
    }, []))

  return (
    <View style={styles.container}>
      <Text style={styles.text}>PassWord Change</Text>
      <TextInput
        style={styles.input}
        placeholder="old Password"
        value={oldPass}
        onChangeText={(txt) => setOld(txt)}></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={newPass}
        onChangeText={(txt) => setNewp(txt)}></TextInput>

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

export default ChangePassword;

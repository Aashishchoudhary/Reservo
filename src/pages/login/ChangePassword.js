import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {setLoading} from '../../store/auth/authSlice';

import {useFocusEffect} from '@react-navigation/native';
import {url} from '../../store/url';
const ChangePassword = () => {
  const user = useSelector(state => state.auth.authTokens);
  const [oldPass, setOld] = useState('');
  const [newPass, setNewp] = useState('');

  const dispatch = useDispatch();

  const updateData = new FormData();
  updateData.append('old_password', oldPass);
  updateData.append('new_password', newPass);
  updateData.append('refresh', user.refresh);
  const postData = async () => {
  
      if (!oldPass || !newPass) {
        Alert.alert('Please provide both old and new password field.');
        return;
      }
      const response = await axios.patch(
        `${url}/change-password/`,updateData, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + user.access,
          },
        },
      );
      const res = await response.data;
      console.log(res)
      if (res.status == 200) {
        Alert.alert(res.details);
      }
      else if(res.status==400){
        Alert.alert(res.details);
      }
   
  };
  useFocusEffect(
    useCallback(() => {
      dispatch(setLoading(true));

      return () => {
        // Perform any cleanup here when the component is unmounted or loses focus
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Old Password"
        value={oldPass}
        onChangeText={txt => setOld(txt)}
        color={oldPass.length < 8 ? 'red' : 'green'}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={newPass}
        onChangeText={txt => setNewp(txt)}
        color={newPass.length < 8 ? 'red' : 'green'}
      />

      <TouchableOpacity style={styles.button} onPress={() => postData()}>
        <Text style={styles.buttonText}>Update</Text>
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
    color: 'black',
    fontWeight: '700',
  },
  input: {
    width: '80%', // Adjust the width as needed
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20, // Add space below the input field
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
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

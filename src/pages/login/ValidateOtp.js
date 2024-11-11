import React, {useState ,useEffect} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import {url} from '../../store/url'
function ValidateOtp() {
  const navigation = useNavigation();
  const [otp, setOtp] = useState('');
 
  const [email , setEmail]=useState('')
 
  async function getASyncData() {
    const value = await AsyncStorage.multiGet(['email'])
    
    console.log(value )
   
    setEmail(value[0][1])
  }
  useEffect(()=>{getASyncData()} ,[])

  
  const handelPost = async () => {
    try {
      if (!email|| !otp) {
        Alert.alert('Please provide otp.');
        return;
      }
      const response = await axios.post(`${url}/validate-otp/`, { email:email,otp: otp});
      
      if (response.status === 200) {
        navigation.navigate('Register');
      }
    } catch (e) {
      Alert.alert(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fill the OTP and proceed to register</Text>
    
      <TextInput style={styles.input} value={email}></TextInput>
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
export default ValidateOtp;

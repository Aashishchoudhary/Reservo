import {useEffect} from 'react';
import axios from 'axios';
import { url } from '../../store/url';

import { Linking } from 'react-native';
import {useSelector} from 'react-redux';
const AddLibrary = () => {
  const user = useSelector(state => state.auth.authTokens);

  const getData=async()=>{
    const response = await axios.get(`${url}/genrate-library-sign/`, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + String(user.access),
      },
    });
    const res= await response.data
    Linking.openURL(`https://libpot.com/?user=${res.user}&sign=${res.sign}`)
  }

useEffect(() => {
 getData()
   
}, []);

 

    return 
}


export default AddLibrary;

import {useCallback ,useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logoutUser, setAuthToken, setUser, setLoading} from './auth/authSlice';
import jwtDecode from 'jwt-decode';

import {useFocusEffect} from '@react-navigation/native';

import {url} from 'url';
import axios from 'axios';
const RefreshToken = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);

  const setAsyncData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log(err);
    }
  };

  const user = useSelector(state => state.auth.authTokens);
  
  let updateToken = async () => {
    try {
      let response = await axios.post(
        `${url}/refreshjwt/`,
        {refresh: user.refresh},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      let data = await response.data;

      if (response.status === 200) {
        dispatch(setAuthToken(data));
        dispatch(setUser(jwtDecode(data.access)));

        setAsyncData('authTokens', JSON.stringify(data));
      }

      dispatch(setLoading(false));
    } catch (err) {
     dispatch(logoutUser())
    }
  };

  useEffect(
    useCallback(() => {
      // Check if 'user' and 'updateToken' exist before executing
      if (user && updateToken) {
        if (loading) {
          updateToken();
        }
      }
  
      // Return cleanup function, if necessary
      return () => {};
    }, [loading, user]), // Add user and updateToken to dependency array
  );

  return ;
};

export default RefreshToken;

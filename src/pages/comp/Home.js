import {useEffect} from 'react';

import {useDispatch} from 'react-redux';
import {logoutUser} from '../../store/auth/authSlice'
import { useFocusEffect } from '@react-navigation/native';
function Home() {
  const dispatch = useDispatch();
  
  
    
  
  useEffect(() => {
    dispatch(logoutUser())
    clearAll()
  
  }, []);

  return <></>;
}

export default Home;

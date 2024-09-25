import React, {useState, useCallback } from 'react';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {useNavigation} from '@react-navigation/native';
import {url} from '../../store/url'
import {
  
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Linking,
  TextInput,
  Button,
  TouchableHighlight
} from 'react-native';

import axios from 'axios';
import {useSelector ,useDispatch } from 'react-redux';
import { setLoading ,setChecking } from '../../store/auth/authSlice';

import { useFocusEffect } from '@react-navigation/native';



const TotalCollection = ({route}) => {
    const dispatch = useDispatch()
   
const {id} = route.params

const user = useSelector(state=>state.auth.authTokens)
const navigation = useNavigation() 
    const [data ,setData] =useState([])
  

  useFocusEffect(
    useCallback(() => {
      
      
      fetchData()
     dispatch(setChecking(true))
      
      
    
      
      return () => {
        // Perform any cleanup here when the component is unmounted or loses focus
      };
    }, []))
 ;





    
     
      
        
        

    

const fetchData=async()=>{
try{
    const response = await axios.get(`${url}/total/${id}/` ,{
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(user.access),
          },
    }
    )
    const res = await response.data
    setData(res)
}catch(err){console.log(err)}
}



const currentMonthCollectiion = data.filter((x)=>{
    const currentDate= new Date().getMonth()
     const itemDate =new Date(x.collection_month).getMonth()
    if(currentDate ===itemDate){
        return true
    }
    return false
    })
    const currentMonthId=currentMonthCollectiion.map((x)=>x.id)
   
const postData=()=>{
  
}

  data.sort((a,b)=>{
  return b.id-a.id})
  const months ={
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec"
  }
 

    return (
      <KeyboardAwareScrollView style={styles.container}>
      
      <View style={styles.tectcon}><Text style={styles.collectionText}>
        Collection this month {currentMonthCollectiion.map((x) => x.amount)}
      </Text></View>
     
       

        {data.map((x) => (
          <TouchableOpacity
            key={x.id}
            onPress={() => navigation.navigate('viewTotal', { id: id, idt: x.id })}>
            <View style={styles.dataItem}>
              <Text style={styles.dataText}>
               {x.amount}{'               '}{'    '} {months[new Date(x.collection_month).getMonth()]}{' '}
                {new Date(x.collection_month).getFullYear()}
             
              </Text>
              
            </View>
          </TouchableOpacity>
        ))}
      
    </KeyboardAwareScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Set your desired background color
  },
 
  
  
  dataItem: {
    backgroundColor: '#847e7e', // Set your desired background color
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  dataText: {
    fontSize: 14,
    color: 'white',
  },
  collectionText: {
    fontSize: 16,
    fontWeight: 'bold',
   height:30,
   margin:10
  },
  tectcon:{
    backgroundColor:"#d8cfcf",
    borderRadius:5,
    alignItems: 'center',
   
    
    
  }
};
export default TotalCollection;

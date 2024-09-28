import axios from 'axios';
import React, {useState ,useCallback} from 'react';

import { useFocusEffect } from '@react-navigation/native';
import {View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {useSelector ,useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { setLoading } from '../../store/auth/authSlice';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {url} from '../../store/url'
const ViewSeatReservation = ({route}) => {

    const {LibId}=route.params
    const user = useSelector(state => state.auth.authTokens);
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [seatData , setSeatData] = useState({})
   
  const fetchSeatData=async()=>{
    const response = await axios.get(`${url}/booked-seat/${LibId}` ,{
      headers :{
        Authorization :"Bearer "+user.access
      }
    })
    const res = await response.data
    console.log('res',res)
    setSeatData(res)
  }
   
 
    const fetchData = async () => {
        try {
          const response = await axios.get(`${url}/view-seat/${LibId}/`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(user.access),
            },
          });
          const res = await response.data;
          
          console.log('data',res ,res.booked);
          setData(res);
        } catch (e) {
          console.log(e);
        }
      };
    

      useFocusEffect(
        useCallback(() => {
          fetchSeatData();
         
          fetchData()
          
          return () => {
            // Perform any cleanup here when the component is unmounted or loses focus
          };
        }, []))
    return (
      <KeyboardAwareScrollView>
          <View style={styles.seatContainer}>
      
      <View style={styles.seatItem}>
        <Text style={styles.seatLabelBooked}>Booked:</Text>
        <Text style={styles.seatValueBooked}>{seatData.booked}</Text>
      </View>
      <View style={styles.seatItem}>
        <Text style={styles.seatLabelVaccent}>Vacant:</Text>
        <Text style={styles.seatValueVaccent}>{seatData.vaccent}</Text>
      </View>
    </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' ,margin:10 }}>
      {data?.data?.map((item) => 
        <TouchableOpacity
          key={item.id}
          style={!item.booked?styles.chair:styles.chairBooked}
          onPress={() =>
            navigation.navigate('AddReservation', {
              Libid: LibId,
              SeatNum: item.seat_num,
            })
          }
        >
          {/* <Icon name="chair" size={30} color="black" />  */}
          <Text style={styles.chairNumber}>{item.seat_num}</Text>
        </TouchableOpacity>
      )}
    </View>
    </KeyboardAwareScrollView>
    );
}
const styles = StyleSheet.create({
  chair: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    backgroundColor: 'lightgreen',
    borderRadius: 5, // Make it round
  },
  chairNumber: {
    color: 'black',
    fontSize: 18,
  },
  chairBooked:{
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    backgroundColor: 'gray',
    borderRadius: 5, // Make it round
  },
  seatContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title:   
 {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'black'
  },
  seatItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  seatLabelBooked: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'green'
  },
  seatLabelVaccent: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'black'
  },
  seatValueBooked: {
    fontSize: 16,
    fontWeight:'bold',
    color:'green'
  },
  seatValueVaccent: {
    fontSize: 18,
    fontWeight:'bold',
    color:'black'
  },
});

export default ViewSeatReservation;

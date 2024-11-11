import axios from 'axios';
import React, {useState, useCallback} from 'react';

import {useFocusEffect} from '@react-navigation/native';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {
  BarChart,
  LineChart,
  PieChart,
  PopulationPyramid,
} from 'react-native-gifted-charts';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {url} from '../../store/url';

const renderDot = color => {
  return (
    <View
      style={{
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 10,
      }}
    />
  );
};

const renderLegendComponent = (booked, d1, vaccent, d2) => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 120,
            marginRight: 20,
          }}>
          {renderDot('#8F80F3')}
          <Text style={{color: 'white'}}>
            {booked}
            {d1}{' '}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', width: 120}}>
          {renderDot('#006DFF')}
          <Text style={{color: 'white'}}>
            {vaccent}
            {d2}
          </Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}></View>
    </>
  );
};
const renderLegendComponentAge = (d1, d2, d3, d4) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 10,
      }}>
      
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 120,
              marginRight: 20,
            }}>
            {renderDot('#8F80F3')}
            <Text style={{color: 'white'}}>below 20 ={d1} Students</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 120,
              marginRight: 20,
            }}>
            {renderDot('#8F80F3')}
            <Text style={{color: 'white'}}>20 to 25 ={d2} Students</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginBottom: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 120,
              marginRight: 20,
            }}>
            {renderDot('#8F80F3')}
            <Text style={{color: 'white'}}>25 to 30 ={d3} Students</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', width: 120}}>
            {renderDot('#006DFF')}
            <Text style={{color: 'white'}}>30+ = {d4} Students</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}></View>
      </View>
   
  );
};
const ViewSeatReservation = ({route}) => {
  const {LibId} = route.params;
  const user = useSelector(state => state.auth.authTokens);
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [seatData, setSeatData] = useState({});

  const fetchSeatData = async () => {
    const response = await axios.get(`${url}/booked-seat/${LibId}/`, {
      headers: {
        Authorization: 'Bearer ' + user.access,
      },
    });
    const res = await response.data;
    console.log('res', res);
    setSeatData(res);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/view-seat/${LibId}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(user.access),
        },
      });
      const res = await response.data;

      setData(res);
    } catch (e) {
      console.log(e);
    }
  };

  const pieData = [
    {
      value: seatData.vaccent,
      color: '#009FFF',
      gradientCenterColor: '#006DFF',
    },

    {
      value: seatData.booked,
      color: '#BDB2FA',
      gradientCenterColor: '#8F80F3',
      focused: true,
    },
  ];
  const pieDataGender = [
    {
      value: seatData.male,
      color: '#009FFF',
      gradientCenterColor: '#006DFF',
    },

    {
      value: seatData.female,
      color: '#BDB2FA',
      gradientCenterColor: '#8F80F3',
      focused: true,
    },
  ];
  const pieDataAge = [
    {
      value: seatData.above30,
      color: 'black',
      gradientCenterColor: '#de0953',
    },
    {
      value: seatData.above15,
      color: 'red',
      gradientCenterColor: '#006DFF',
    },
    {
      value: seatData.above20,
      color: 'blue',
      gradientCenterColor: '#34eb6e',
    },

    {
      value: seatData.above25,
      color: '#BDB2FA',
      gradientCenterColor: '#8F80F3',
      focused: true,
    },
  ];
  useFocusEffect(
    useCallback(() => {
      fetchSeatData();

      fetchData();

      return () => {
        // Perform any cleanup here when the component is unmounted or loses focus
      };
    }, []),
  );
  return (
    <KeyboardAwareScrollView>
      <>
        <View
          style={{
            padding: 6,
            borderRadius: 20,
            backgroundColor: '#232B5D',
          }}>
          <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
            Seats
          </Text>
          <View style={{padding: 20, alignItems: 'center'}}>
            <PieChart
              data={pieData}
              donut
              showGradient
              sectionAutoFocus
              radius={90}
              innerRadius={60}
              innerCircleColor={'#232B5D'}
              centerLabelComponent={() => {
                return (
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: 22,
                        color: 'white',
                        fontWeight: 'bold',
                      }}>
                      {seatData.booked}
                    </Text>
                    <Text style={{fontSize: 14, color: 'white'}}>booked</Text>
                  </View>
                );
              }}
            />
          </View>
          {renderLegendComponent(
            seatData.booked,
            ' Booked Seats',
            seatData.vaccent,
            ' Vaccent Seats',
          )}
        </View>
        <View
          style={{
            padding: 6,
            borderRadius: 20,
            backgroundColor: '#232B5D',
            marginTop: 5,
          }}>
          <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
            Seats
          </Text>
          <View style={{padding: 20, alignItems: 'center'}}>
            <PieChart
              data={pieDataGender}
              donut
              showGradient
              sectionAutoFocus
              radius={90}
              innerRadius={60}
              innerCircleColor={'#232B5D'}
            />
          </View>
          {renderLegendComponent(
            seatData.male,
            ' Male',
            seatData.female,
            ' Female',
          )}
        </View>
        <View
          style={{
            padding: 6,
            borderRadius: 20,
            backgroundColor: '#232B5D',
            marginTop: 5,
          }}>
          <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
            Seats
          </Text>
          <View style={{padding: 20, alignItems: 'center'}}>
            <PieChart
              data={pieDataAge}
              donut
              showGradient
              sectionAutoFocus
              radius={90}
              innerRadius={60}
              innerCircleColor={'#232B5D'}
            />
          </View>
          {renderLegendComponentAge(
            seatData.above15,
            seatData.above20,
            seatData.above25,
            seatData.above30,
          )}
        </View>
      </>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          margin: 10,
        }}>
        {data?.data?.map(item => (
          <TouchableOpacity
            key={item.id}
            style={!item.booked ? styles.chair : styles.chairBooked}
            onPress={() =>
              navigation.navigate('AddReservation', {
                Libid: LibId,
                SeatNum: item.seat_num,
              })
            }>
            {/* <Icon name="chair" size={30} color="black" />  */}
            <Text style={styles.chairNumber}>{item.seat_num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </KeyboardAwareScrollView>
  );
};
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
  chairBooked: {
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  seatItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  seatLabelBooked: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  seatLabelVaccent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  seatValueBooked: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  seatValueVaccent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ViewSeatReservation;

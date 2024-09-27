import React, {useState, useCallback} from 'react';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {url} from '../../store/url';
import {View, Text, RefreshControl} from 'react-native';

import axios from 'axios';
import {useSelector} from 'react-redux';

import {useFocusEffect} from '@react-navigation/native';

const TotalCollection = ({route}) => {
  const {id} = route.params;

  const user = useSelector(state => state.auth.authTokens);

  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/total/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(user.access),
        },
      });
      const res = await response.data;
      setData(res);
    } catch (err) {
      console.log(err);
    }
  };

  const currentMonthCollectiion = data.filter(x => {
    const currentDate = new Date().getMonth();
    const itemDate = new Date(x.collection_month).getMonth();
    if (currentDate === itemDate) {
      return true;
    }
    return false;
  });

  const months = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec',
  };

  const fetchPayment = async () => {
    await axios.get(`${url}/library-collection/${id}/`, {
      headers: {
        Authorization: 'Bearer ' + user.access,
      },
    });
  };
  useFocusEffect(
    useCallback(() => {
      fetchPayment();
      fetchData();
      return () => {
        // Perform any cleanup here when the component is unmounted or loses focus
      };
    }, [refreshing]),
  );
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.tectcon}>
        <Text style={styles.collectionText}>
          Collection this month {currentMonthCollectiion.map(x => x.amount)}
        </Text>
      </View>

      {data.map(x => (
        <View style={styles.dataItem} key={x.id}>
          <Text style={styles.dataText}>
            {months[new Date(x.collection_month).getMonth()]}{' '}
            {new Date(x.collection_month).getFullYear()}
          </Text>
          <Text style={styles.dataText}>{x.amount} </Text>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'black', // Set your desired background color
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    marginTop: 10,
  },
  dataText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  collectionText: {
    fontSize: 16,
    fontWeight: 'bold',
    height: 30,
    margin: 10,
  },
  tectcon: {
    backgroundColor: '#d8cfcf',
    borderRadius: 5,
    alignItems: 'center',
  },
};
export default TotalCollection;

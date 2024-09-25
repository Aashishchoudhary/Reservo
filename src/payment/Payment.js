import {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Text, RefreshControl} from 'react-native';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useFocusEffect} from '@react-navigation/native';
import {callRazorPayFunc_3_month , callRazorPay_one_month_Func} from './UserPayment';

import {url} from '../store/url';
import { TouchableOpacity } from 'react-native-gesture-handler';
const Payment = () => {
  const user = useSelector(state => state.auth.authTokens);
  const [data, setData] = useState([]);
  const [amount , setAmount] = useState()

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/view-subscription-details/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(user.access),
        },
      });
      const res = await response.data;
      setData(response.data);

      console.log(res);
    } catch (err) {
      console.log('error', err);
    }
  };

  const fetchAmount=async()=>{
    const response = await axios.get(`${url}/payment/`,{
      headers:{
        Authorization:"Bearer "+ user.access
      }
    })
    const res=await response.data
    console.log('am' , res)
    if(res.amount<70000){
      setAmount(63636)
    }
    else{
      setAmount(res.amount)
    }
  }
  useFocusEffect(
    useCallback(() => {
      fetchData();
fetchAmount()
      return () => {
        // Perform any cleanup here when the component is unmounted or loses focus
      };
    }, [refreshing]),
  );
  console.log(typeof data);
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {data?.map(item=>(<View key={item.id} style={styles.paymentContainer}>
        <View style={styles.payment}>
          <Text style={styles.totalAmount}>₹ {item.amount}</Text>
          <Text style={item.active?styles.status:styles.due}>{item.active?"Active":"Payment Due"}</Text>
        </View>
        <View style={styles.paymentItem}>
          <Text style={styles.date}>Paid on </Text>
          <Text style={styles.plan}>{item.start_date}</Text>
        </View>
        <View style={styles.paymentItem}>
          <Text style={styles.date}>Next date </Text>
          <Text style={styles.plan}>{item.expire_date}</Text>
        </View>
      </View>))}

      <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={()=>callRazorPay_one_month_Func(user)}
      >
        <Text style={styles.cardTitle}>One Month</Text>
        <Text style={styles.cardDescription}>₹ {Math.round(amount *0.0011)} </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={()=>callRazorPayFunc_3_month(user)}
      >
        <Text style={styles.cardTitle}>3 Months</Text>
        <Text style={styles.cardDescription}>₹ {Math.round(amount *0.0031)}</Text>
      </TouchableOpacity>
    </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  paymentContainer: {
    flexDirection: 'column',
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#d1d1d1',
    borderWidth: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4caf50',
  },
  due: {
    fontSize: 16,
    fontWeight: '600',
    color: 'red',
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  plan: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  payment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cardContainer: {
    flexDirection: 'row', // Arrange cards in a row
    justifyContent: 'space-around', // Space between cards
    alignItems: 'center', // Align items vertically
    marginVertical: 20, // Margin around container
    paddingHorizontal: 10, // Padding on sides
  },
  card: {
    flex: 1, // Equal width for each card
    backgroundColor: '#fff', // Card background color
    borderRadius: 15, // Rounded corners
    padding: 20, // Padding inside card
    marginHorizontal: 10, // Space between cards
    alignItems: 'center', // Center content
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow transparency
    shadowRadius: 5, // Shadow blur radius
    elevation: 5, // Android elevation for shadow
  },
  cardTitle: {
    fontSize: 18, // Font size for title
    fontWeight: 'bold', // Bold text
    color: '#333', // Dark text color
    marginBottom: 10, // Space below title
  },
  cardDescription: {
    fontSize: 16, // Font size for description
    color: '#666', // Lighter text color
  },
});

export default Payment;

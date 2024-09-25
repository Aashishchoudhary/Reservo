
import { Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';

import {url} from '../store/url'

     
       
    export const callRazorPay_one_month_Func = async(user) => {
      const response=await axios.get(`${url}/get-one-month-plan/`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.access,
        }
        })
        const res =await response.data
        var options = {
            description: 'Credits toward Your App Name',
            image: 'https://demo.png',
            currency: 'INR',
            key: `rzp_test_LV8uVJ5i2Lp8Jb`,
            order_id: res.id,
            amount: res.amount * 100,
            name: 'Your App Name',
            theme: { color: '#000000' }
        }
        RazorpayCheckout.open(options).then((data) => {
           console.log('signature ',data)
            axios.patch(`${url}/subscribed-user-one-model/`, {
                'razorpay_order_id' : data.razorpay_order_id,
                'razorpay_payment_id': data.razorpay_payment_id,
                'razorpay_signature': data.razorpay_signature,
                'amount':res.amount
                        
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + user.access,
                }
                }).then(re=>Alert.alert(re.data))
     
            },
            prefill={
              name: res.notes.name,
              email: res.notes.email,
              contact: res.notes.username,
            },
            notes= {
              address: "Razorpay Corporate Office",
            },
            theme= {
              color: "#3399cc",
            },
            );
    }
  
   
      
         
   export const callRazorPayFunc_3_month = async(user) => {
    const response=await axios.get(`${url}/get-three-month-plan/`, {
      headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.access,
      }
      })
      const res =await response.data
        var options = {
            description: 'Credits toward Your App Name',
            image: 'https://demo.png',
            currency: 'INR',
            key: `rzp_test_LV8uVJ5i2Lp8Jb`,
            order_id: res.id,
            amount: res.amount * 100,
            name: 'Your App Name',
            theme: { color: '#000000' }
        }
        RazorpayCheckout.open(options).then((data) => {
           console.log('signature ',data)
            axios.patch(`${url}/subscribed-user-three-model/`, {
                'razorpay_order_id' : data.razorpay_order_id,
                'razorpay_payment_id': data.razorpay_payment_id,
                'razorpay_signature': data.razorpay_signature,
                'amount':res.amount
                        
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + user.access,
                }
                }).then(re=>Alert.alert(re.data))
     
            },
            prefill={
              name: res.notes.name,
              email: res.notes.email,
              contact: res.notes.username,
            },
            notes= {
              address: "Razorpay Corporate Office",
            },
            theme= {
              color: "#3399cc",
            },
            );
    }




  


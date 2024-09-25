import React, {useState, useCallback} from 'react';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {url} from '../../store/url'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
 
  TextInput,
} from 'react-native';

import axios from 'axios';
import {useSelector} from 'react-redux';

import {useFocusEffect} from '@react-navigation/native';

const ViewTotal = ({route}) => {
  const user = useSelector(state => state.auth.authTokens);
  const {id, idt} = route.params;
  console.log(id , idt)
  const [data, setData] = useState();
  const getData = async() => {
    try {
      const response = await axios.get(`${url}/total/${id}/${idt}/`, {
        headers: {
          Authorization: 'Bearer ' + String(user.access),
        },
      });

      const res =await response.data;
      console.log('totallllllll',res)
      setData(res);
    } catch (err) {}
  };
useFocusEffect( useCallback(() => {
      
   
    getData()
    
    
    
  
    
    return () => {
      // Perform any cleanup here when the component is unmounted or loses focus
    };
  }, []))

  const [cost, setCost] = useState('');
  const [finCost, setFinCost] = useState('');

const updateData = new FormData()
if(cost)updateData.append('cost' , cost)
if(finCost)updateData.append('finalCost' , finCost)
  const patchData = () => {
    try {
      
      axios.patch(
        `${url}/total/${id}/${idt}/`,
       updateData,
        {
          headers: {
            Authorization: 'Bearer ' + String(user.access),
          },
        },
      );
      getData();
    } catch (err) {}
  };
  return (
    <KeyboardAwareScrollView style={styles.container}>
  <View>
    {data?.map((x) => (
      <View key={x.id}>
        <Text style={styles.text}>Amount: {x.amount}</Text>
        <Text style={styles.text}>{x.cost || 'null'}</Text>
        <Text style={styles.text}>Final Cost: {x.finalCost || 'null'}</Text>
      </View>
    ))}
  </View>

  <TextInput
    style={styles.input}
    multiline={true}
    numberOfLines={4}
    onChangeText={(text) => setCost(text)}
    value={cost}
    placeholder="detail expense..."
  />
  <TextInput
    style={styles.input}
    value={finCost}
    keyboardType="numeric"
    onChangeText={(txt) => setFinCost(txt)}
    placeholder="Final Cost"
  />

  <TouchableOpacity style={styles.touchableOpacity} onPress={() => patchData()}>
    <Text style={styles.touchableText}>Save</Text>
  </TouchableOpacity>
</KeyboardAwareScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Set your background color
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
  },
  touchableOpacity: {
    backgroundColor: 'blue', // Set your button background color
    padding: 15,
    alignItems: 'center',
  },
  touchableText: {
    color: '#fff', // Set your button text color
    fontSize: 18,
  },
});

export default ViewTotal;

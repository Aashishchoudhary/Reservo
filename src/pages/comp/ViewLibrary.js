import axios from 'axios';
import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {setLoading} from '../../store/auth/authSlice';
import {useFocusEffect} from '@react-navigation/native';

import {url} from '../../store/url'
clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {

  }

  console.log('Done. fff');
};
function ViewLibrary() {
  const user = useSelector(state => state.auth.authTokens);

  const navigation = useNavigation();
  const [data, setData] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/library-view/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(user.access),
        },
      });
      dispatch(setLoading(true));
      const res = await response.data;
 
      setData(res);
    } catch (e) {
      console.log('error',e);
    }
  };

  const subcheck=()=>{
  navigation.navigate('payment')
  }
const fetchPayametStatus=async()=>{
  const response = await axios.get(`${url}/check-subscription/` ,{
    headers :{
      Authorization:"Bearer "+user.access
    }
  })
  const res = await response.data
if (res.status==468){
  Alert.alert("Please conatct to the team there is some issue")
}
else if(res.status==469){
  Alert.alert(`Your subscription expired ${res.data} days ago`, '', [
   
    
    {text: 'Ok', onPress: () => subcheck()},
  ]);
}
}
  
  useFocusEffect(
    useCallback(() => {
      dispatch(setLoading(true));
     fetchData()
fetchPayametStatus()
      return () => {};
    }, [refreshing]),
  );
 
 
  return (
    <KeyboardAwareScrollView
     
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
       
     
      {data.length > 0 ? (
        <View  style={styles.container}>
          {data?.map(item => (
            <View  key={item.id}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ViewSeat', {LibId: item.id})
                }>
              <View style={styles.libraryItem}>
                <Text  style={styles.libraryName}>{item.name.slice(0,1).toUpperCase()+item.name.slice(1)}</Text>
            
              <Text style={styles.seatNumber}>
                Total Seats : {item.total_seat}
              </Text>
              </View>
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    navigation.navigate('ViwAlRe', {LibId: item.id})
                  }>
                  <Text style={styles.buttonText}>View All Entries</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    navigation.navigate('collection', {id: item.id})
                  }>
                  <Text style={styles.buttonText}>Total Collection</Text>
                </TouchableOpacity>
              
             </View>
             <View style={styles.buttonContainer}>
             
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('extra', {id: item.id})}>
                  <Text style={styles.buttonText}>Extra Student</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('half', {id: item.id})}>
                  <Text style={styles.buttonText}>Half Day</Text>
                </TouchableOpacity>
              
                </View>
             <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    navigation.navigate('previous', {id: item.id})
                  }>
                  <Text style={styles.buttonText}>Deleted Data</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('EditLibrary', {id: item.id})
                }>
                <Text style={styles.buttonText}>Edit Library</Text>
              </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addLibraryButton}
          onPress={() => navigation.navigate('AddLibrary')}>
          <Text style={styles.addLibraryText}>Add</Text>
        </TouchableOpacity>
      )}
     
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  libraryItem: {
    borderWidth: 1, // Add a border
    borderColor: '#ccc', // Border color
    borderRadius: 8, // Add rounded corners
    padding: 16, // Add some padding to create space
    marginVertical: 10, // Vertical margin between items
    backgroundColor: '#747575', // Background color
    shadowColor: 'rgba(0, 0, 0, 0.1)', // Shadow color
    shadowOffset: { width: 2, height: 2 }, // Shadow offset
    shadowRadius: 5, // Shadow radius
    shadowOpacity: 1, // Shadow opacity
    elevation: 3, // Android elevation
  },

  libraryName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8, // Add some margin between library name and seat number
  },

  seatNumber: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row', // Display buttons horizontally
    justifyContent: 'space-between', // Space them evenly in a row
    alignItems: 'center', // Center vertically
    marginVertical: 20, // Add some vertical margin for spacing
  },

  // Style for each button
  button: {
    flex: 1, // Make each button take up equal space
    backgroundColor: 'black',
    padding: 12,
    width:'40%',
    borderRadius: 20,
    marginHorizontal: 10, // Add horizontal margin between buttons
  },

  // Style for button text
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  addLibraryButton: {
    backgroundColor: 'green',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  addLibraryText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ViewLibrary;

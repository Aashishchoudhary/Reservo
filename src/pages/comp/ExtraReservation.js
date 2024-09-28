import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import RadioButtonRN from 'radio-buttons-react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {yyyymmdd} from './ImageModel';
import {setLoading, setChecking} from '../../store/auth/authSlice';
import {useFocusEffect} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import {imageSelectBox} from './ImageDownLoad';
import {url} from '../../store/url';
const ExtraReservation = ({route}) => {
  const {id} = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const userId = useSelector(state => state.auth.user);
  const [data, setData] = useState([]);
  const [filterdData, setFilteredData] = useState([]);

  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [mobile, setmobile] = useState('');
  const [stdate, setstdate] = useState(new Date());
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState('');
  const [adress, setAdress] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [adharcard, setAdharcard] = useState(null);
  const [photo, setPhoto] = useState(null);
  const user = useSelector(state => state.auth.authTokens);

  const [check, setCheck] = useState(false);
  const [display, setDisplay] = useState(false);

  const updateData = new FormData();
  if (name) updateData.append('name', name);
  if (mobile) updateData.append('mobile_number', mobile);
  if (stdate) updateData.append('start_date', yyyymmdd(stdate));
  if (endDate) updateData.append('end_date', yyyymmdd(endDate));
  if (dob) updateData.append('dob', yyyymmdd(dob));
  if (adress) updateData.append('adress', adress);
  if (gender) updateData.append('gender', gender['label']);
  if (amount) updateData.append('amount', amount);
  if (adharcard) updateData.append('adharcard', adharcard);
  if (photo) updateData.append('photo', photo);

  const funCheck = () => {
    setCheck(true);
  };
  const selectGender = [
    {
      label: 'Male',
    },
    {
      label: 'Female',
    },
  ];
  const createRoom = async () => {
    try {
      // Call signatureGenration() and handle potential errors
      const response = await axios.get(`${url}/create-signature/`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',

          Authorization: 'Bearer ' + String(user.access),
        },
      });
      const res = await response.data;

      // Construct the complete URL with all necessary parameters
      const url = `${url}/chat-page/?libid=${id}&user_id=${userId['user_id']}&sign=${res['sign']}&url=add-extra-time`;
      console.log(url);
      // Perform navigation using navigation.navigate
      navigation.navigate('QR', {data: url});
    } catch (error) {
      // Handle errors gracefully, e.g., display an error message or retry logic
      console.error('Error creating room:', error);
      // You can add error handling specific to your application's requirements
    }
  };

  const postData = async () => {
    try {
      await axios.post(`${url}/extra-student/${id}/`, updateData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + String(user.access),
        },
      });
      console.warn('Data Saved');

      setCheck(false);
      fetchData();
    } catch (err) {
      console.log(err.response.data);
      // Alert.alert('Something went wrong please try again later');
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/extra-student/${id}/`, {
        headers: {
          Authorization: 'Bearer ' + String(user.access),
        },
      });

      const res = await response.data;

      const newData = res.slice().sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
      });
      console.log(newData);
      setFilteredData(newData);
      setData(res);
    } catch (err) {
      Alert.alert(err.response.data);
    }
  };

  const expireDate = () => {
    setDisplay(false);
    const newData = data.slice().sort((a, b) => {
      return new Date(a.end_date) - new Date(b.end_date);
    });
    console.log(newData);
    setFilteredData(newData);
  };
  const admissionDate = () => {
    setDisplay(false);
    const newData = data.slice().sort((a, b) => {
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
    console.log(newData);
    setFilteredData(newData);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(setLoading(true));
      fetchData();
      dispatch(setChecking(true));
      return () => {
        // Perform any cleanup here when the component is unmounted or loses focus
      };
    }, []),
  );
  // alert type
  const filterFun = () => {
    Alert.alert('Apply Filter', '', [
      {text: 'Cancel', onPress: () => setDisplay(false), style: 'cancel'},
      {text: 'Expire', onPress: () => expireDate()},
      {text: 'New Entries', onPress: () => admissionDate()},
    ]);
  };
  const searchText = text => {
    if (text) {
      const newData = data.filter(item => {
        const itemData = item.name.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      setFilteredData(data);
      setSearch(text);
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.btncontainer}>
        <TouchableOpacity style={styles.btnbutton} onPress={() => createRoom()}>
          <Text style={styles.btnbuttonText}>Show QR</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.subCon}>
          <TextInput
            style={styles.textInputStyle}
            onChangeText={text => searchText(text)}
            value={search}
            underlineColorAndroid="transparent"
            placeholder="Search Here"
          />
        </View>
        <View style={styles.buttonConatiner}>
          <TouchableOpacity
            onPress={() => setDisplay(true)}
            style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
          {display && filterFun()}
          {!check && (
            <TouchableOpacity
              onPress={() => funCheck()}
              style={styles.filterButton}>
              <Text style={styles.filterButtonText}>ADD Entery</Text>
            </TouchableOpacity>
          )}
          {check && (
            <TouchableOpacity
              onPress={() => setCheck(false)}
              style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Hide Button</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {check && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            value={name}
            placeholder="name....."
            onChangeText={e => setName(e)}
          />

          <TextInput
            style={styles.input}
            value={mobile}
            placeholder="Mobile number....."
            onChangeText={e => setmobile(e)}
            color={mobile.length > 9 ? 'green' : 'red'}
          />
          <TextInput
            style={styles.input}
            value={amount}
            placeholder="amount....."
            onChangeText={e => setAmount(e)}
          />
          <TextInput
            style={styles.input}
            value={adress}
            placeholder="address....."
            onChangeText={e => setAdress(e)}
          />
          <View style={styles.dateCon}>
            <Text style={styles.dateLabel}>DOB</Text>
            <DatePicker
              style={styles.dateBox}
              date={dob}
              mode="date"
              onDateChange={setDob}
            />
          </View>
          <View>
            <Text>{gender}</Text>
          </View>
          <RadioButtonRN
            data={selectGender}
            selectedBtn={e => setGender(e['label'])}
          />

          <View style={styles.dateCon}>
            <Text style={styles.dateLabel}>From</Text>
            <DatePicker
              style={styles.dateBox}
              date={stdate}
              mode="date"
              onDateChange={setstdate}
            />
            <Text style={styles.dateLabel}>To</Text>
            <DatePicker
              style={styles.dateBox}
              date={endDate}
              mode="date"
              onDateChange={setEndDate}
            />
          </View>

          <TouchableOpacity onPress={() => imageSelectBox(setPhoto)}>
            {
              <Image
                source={{
                  uri: photo
                    ? photo.uri
                    : 'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
                }}
                style={styles.image}
              />
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => imageSelectBox(setAdharcard)}>
            {
              <Image
                source={{
                  uri: adharcard
                    ? adharcard.uri
                    : 'https://cdn.pixabay.com/photo/2022/11/09/00/44/aadhaar-card-7579588_1280.png',
                }}
                style={styles.image}
              />
            }
          </TouchableOpacity>

          <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => postData()}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {filterdData?.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          onPress={() =>
            navigation.navigate('editExtra', {id: id, idt: item.id})
          }>
          <View
            key={item.id}
            style={[
              styles.container,
              index % 2 ? styles.evenStyle : styles.oddStyle,
            ]}>
            <Text style={styles.name}>
              {item.name.slice(0, 1).toUpperCase() + item.name.slice(1)}
            </Text>
            <Text style={styles.endDate}>{item.end_date}</Text>
            {new Date(item.end_date) < new Date() && (
              <Text style={styles.expired}>Expired</Text>
            )}
            {new Date(item.end_date) > new Date() && (
              <Text style={styles.expiring}>
                Days Left{' '}
                {Math.floor(
                  (new Date(item.end_date).getTime() - new Date().getTime()) /
                    86400000,
                )}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  itemStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
  container: {
    // backgroundColor: 'lightgray',
    padding: 10,
    margin: 8,
    height: 80,
    borderRadius: 10,
  },
  evenStyle: {
    backgroundColor: 'lightgray',
  },
  oddStyle: {
    backgroundColor: '#fff',
  },
  seatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 17,
  },
  endDate: {
    color: 'blue',
  },
  expired: {
    color: 'red',
  },
  expiring: {
    color: 'green',
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  subCon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius:10
  },
  textInputStyle: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
  },
  filterButton: {
    padding: 5,
    borderRadius: 5,
  },
  filterButtonText: {
    color: 'black',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  filterItem: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
    margin: 5,
  },
  filterItemText: {
    color: 'white',
  },
  image: {
    width: '80%',
    height: 300,
    borderRadius: 8,
    margin: 8,
    marginLeft: 30,
  },
  input: {
    height: 40,
    // borderWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  date: {
    alignItems: 'center',

    borderColor: 'black',
    borderWidth: 1,
    margin: 10,
  },
  dateBox: {
    height: 40,
    width: 370,
    backgroundColor: '#dddbd9',
  },
  btncontainer: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-between', // Distribute buttons evenly
    marginTop: 10, // Add spacing
  },
  btnbutton: {
    backgroundColor: '#f5f5f5', // Light background
    borderRadius: 10, // Rounded corners
    padding: 10, // Margin around text
    flex: 1, // Make buttons equal width
    backgroundColor: '#413e3e',
    margin: 5,
  },
  btnbuttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  buttonConatiner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formContainer: {
    margin: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
  },
  dateLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
    padding: 10,
    backgroundColor: 'black',
    width: 80,
    borderRadius: 10,
  },
  searchContainer:{
margin:5,
borderRadius:20
  }
});

export default ExtraReservation;

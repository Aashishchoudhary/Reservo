import axios from 'axios';
import React, {useState, useCallback, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {  yyyymmdd} from './ImageModel';
import { btnImage , imageSelectBox } from './ImageDownLoad';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Linking,
  TextInput,
} from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import {useSelector, useDispatch} from 'react-redux';

import ViewShot from 'react-native-view-shot';
import DatePicker from 'react-native-date-picker';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {setLoading ,setChecking} from '../../store/auth/authSlice';
import {useNavigation} from '@react-navigation/native';
import {url} from '../../store/url'
const EditAllREs = ({route}) => {
  const user = useSelector(state => state.auth.authTokens);
  const userId= useSelector((state)=>state.auth.user)
  const dispatch = useDispatch();
  const {idt ,LibId} = route.params;
 
  const navigation = useNavigation();
 

  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [mobile, setmobile] = useState('');
  const [stdate, setstdate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [dob , setDob]=useState(new Date())
  const [gender , setGender]=useState('')
  const[adress , setAdress]= useState('')
  const [adharcard, setAdharcard] = useState(null);
  const [photo, setPhoto] = useState(null);

  const updateData = new FormData();
  if (name) updateData.append('name', name);
  if (mobile) updateData.append('mobile_number', mobile);
  if (stdate) updateData.append('start_date', yyyymmdd(stdate));
  if (endDate) updateData.append('end_date', yyyymmdd(endDate));
  if(dob)updateData.append('dob' , yyyymmdd(dob))
  if(adress)updateData.append('adress' ,adress)
  if(gender)updateData.append('gender',gender['label'])
  if (amount) updateData.append('amount', amount);
  if (adharcard) updateData.append('adharcard', adharcard);
  if (photo) updateData.append('photo', photo);
  console.log(name, mobile, amount);

// room creation 
// chat room creation  and qr code
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
    const url = `${url}/chat-page/?libid=${LibId}&id=${idt}&user_id=${userId['user_id']}&sign=${res['sign']}`;
    console.log(url)
    // Perform navigation using navigation.navigate
    navigation.navigate('QR', { data: url });
  } catch (error) {
    // Handle errors gracefully, e.g., display an error message or retry logic
    console.error('Error creating room:', error);
    // You can add error handling specific to your application's requirements
  }
};


  // screen shot genrator
  const ref = useRef();

  const snapShot = () => {
    ref.current.capture().then(uri => {
      CameraRoll.save(uri, {type: 'photo'});
     console.warn("Invoice Downloaded")
      
    });
  };

  // whatsapp url
  const initiateWhatsApp = num => {
    let url = 'whatsapp://send?&phone=91' + num;
    Linking.openURL(url)
      .then(data => {
        console.log('WhatsApp Opened');
      })
      
      .catch(() => {
        Alert.alert('Make sure Whatsapp installed on your device');
      });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/edit-reservation-view/${idt}/`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + String(user.access),
        },
      });
      const res = await response.data;
      console.log('resss',res)
      setData(res);
      setDob(res.data[0]['dob']? new Date(res.data[0]['dob']):new Date())
      setEndDate(res.data[0]['end_date']? new Date(res.data[0]['end_date']):new Date())
      // setstdate(res.data[0]['start_date']? new Date(res.data[0]['start_date']):new Date())
      dispatch(setChecking(true))
    } catch (err) {
      console.log(err.response.data)
      Alert.alert('something went wrong please try agian later');
    }
  };
  const patchData = async () => {
    try {
       await axios.patch(
        `${url}/edit-reservation-view/${idt}/`,
        updateData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + String(user.access),
          },
        },
      );
     
    
      fetchData()
    } catch (err) {
      console.log(err.response.data)
      Alert.alert('something went wrong please try agian later');
    }
  };
  const postData = async () => {
    try {
      const response = await axios.post(
        `${url}/edit-reservation-view/${idt}/`,
        updateData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + String(user.access),
          },
        },
      );
    
      console.log(response);
      ;
      await fetchData()
      await imageVerify()
    } catch (err) {
      console.log(err.response.data);
      Alert.alert('something went wrong please try agian later');
    }
  };
  const deleteData = async () => {
    try {
      const response = await axios.delete(`${url}/edit-reservation-view/${idt}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(user.access),
        },
      });
      const res = await response.data;
      console.log(response);
      
    } catch (err) {
      Alert.alert('something went wrong please try agian later');
    }
  };
 
  useFocusEffect(
    useCallback(() => {
      dispatch(setLoading(true));
      fetchData();
      return () => {
        // Perform any cleanup here when the component is unmounted or loses focus
      };
    }, []),
  );
  const date = new Date().toDateString();
  const selectGender = [
    {
      label: 'Male'
     },
     {
      label: 'Female'
     }
    ];
  return (
    <KeyboardAwareScrollView>
    {!data?.data?.length &&<View style={styles.btncontainer}><TouchableOpacity style={styles.btnbutton} onPress={() => createRoom()}>
        <Text style={styles.btnbuttonText}>Show QR</Text>
      </TouchableOpacity>
      </View>}
      <View>
      {data?.data?.map(item => (
          <View key={item.id}>
            <ViewShot
              style={styles.container}
              ref={ref}
              options={{
                fileName: 'Your-File-Name',
                format: 'jpg',
                quality: 1,
              }}>
              <View style={styles.header}>
                <Text style={styles.title}>Invoice</Text>
              </View>
              <View style={styles.invoiceInfoContainer}>
                <View style={styles.invoiceInfo}>
                  <Text style={styles.label}>Library:</Text>
                  <Text style={styles.total}>{data?.library_name}</Text>                  
                </View>
              </View>
              <View style={styles.invoiceInfoContainer}>
                <View style={styles.invoiceInfo}>
                  <Text style={styles.label}>Contact:</Text>
                  <Text style={styles.total}>{data?.mobile_number}</Text>                  
                </View>
              </View>
              <View style={styles.invoiceInfoContainer}>
                <View style={styles.invoiceInfo}>
                  <Text style={styles.label}>Invoice Date:</Text>
                  <Text style={styles.total}>{date}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.header}>
                <Text style={styles.title}>Info</Text>
                <View style={styles.customerInfo}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.total}>{item.name}</Text>
                </View>
                <View style={styles.customerInfo}>
                  <Text style={styles.label}>Mobile:</Text>
                  <Text style={styles.total}>{item.mobile_number}</Text>
                </View>
                <View style={styles.customerInfo}>
                  <Text style={styles.label}>Seat No:</Text>
                  <Text style={styles.total}>{data?.seat_num}</Text>
                </View>
              </View>

              <View style={styles.divider} />
              <View style={styles.customerInfo}>
                <Text style={styles.label}>Amount:</Text>
                <Text style={styles.total}>Rs-{item.amount}</Text>
              </View>
              <View style={styles.customerInfo}>
                <Text style={styles.label}>Till Date:</Text>
                <Text style={styles.total}>{item.end_date}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.nameText}>
                <Text style={styles.nameText}>A aashish kalwaniya Product</Text>
              </View>
            </ViewShot>
            {item.photo && (
              <TouchableOpacity
                style={styles.imageBtn}
                onPress={() => btnImage(`${url}${item.photo}`)}>
                <Image
                  style={styles.image}
                  source={{uri: `${url}${item.photo}`}}
                />
              </TouchableOpacity>
            )}
            {item.adharcard && (
              <TouchableOpacity
                style={styles.imageBtn}
                onPress={() =>
                  btnImage(`${url}${item.adharcard}`)
                }>
                <Image
                  style={styles.image}
                  source={{uri: `${url}${item.adharcard}`}}
                />
              </TouchableOpacity>
            )}
          </View>
        ))}
        <View style={styles.buttonContainer}>
        {data?.data?.length > 0 && (
          <TouchableOpacity  style={styles.button} onPress={() => snapShot()}>
            <Text style={styles.buttonText}>Download Invoice</Text>
          </TouchableOpacity>
        )}

        {data?.data?.map((item)=> <TouchableOpacity key={item.id} style={styles.button} onPress={() => initiateWhatsApp(item.mobile_number)}>
            <Text style={styles.buttonText}>Share on Whatsapp</Text>
          </TouchableOpacity>)}
      </View></View>

      {data?.data?.length < 1 ? (
        <View>
          <TextInput
            style={styles.input}
            value={name}
            placeholder='name.....'
            onChangeText={e => setName(e)}
          />

          

          <TextInput
            style={styles.input}
            value={mobile}
            placeholder='Mobile number.....'
            onChangeText={e => setmobile(e)}
          />
          <TextInput
            style={styles.input}
            value={amount}
            placeholder='amount.....'
            onChangeText={e => setAmount(e)}
          />
        <TextInput
          style={styles.input}
          value={adress}
          placeholder='address.....'
          onChangeText={e => setAdress(e)}
        />
        <View style={styles.dateCon}>
    <Text style={styles.label}>DOB</Text>
    <DatePicker
      style={styles.dateBox}
      date={dob}
      mode="date"
      onDateChange={setDob}
    />
</View>
<RadioButtonRN
  data={selectGender}
  selectedBtn={(e) => setGender(e)}
/>

<View style={styles.dateCon}>
      <Text style={styles.label}>From</Text>
      <DatePicker
        style={styles.dateBox}
        date={stdate}
        mode="date"
        onDateChange={setstdate}
      />
      <Text style={styles.label}>To</Text>
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

          <View style={styles.buttonContainer}><TouchableOpacity style={styles.button}  onPress={() => postData()}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity></View>
        </View>
      ) : (
        <View>
          {data?.data?.map((x, index) => (
            <View key={index}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={text => setName(text)}
                placeholder={x.name}
              />

              

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={mobile}
                onChangeText={e => setmobile(e)}
                placeholder={x.mobile_number.toString()}
              />
              <TextInput
                style={styles.input}
                value={amount}
                keyboardType="numeric"
                onChangeText={e => setAmount(e)}
                placeholder={x.amount.toString()}
              />
                <View style={styles.dateCon}>
      
      
      <Text style={styles.label}>{x.end_date}</Text>
      <DatePicker
        style={styles.dateBox}
        date={endDate}
        mode="date"
        onDateChange={setEndDate}
      />
    </View>

              <TouchableOpacity onPress={() => imageSelectBox(setPhoto)}>
                {x.photo?.length > 1 ? (
                  <Image
                    source={{
                      uri: photo ? photo.uri : `${url}${x.photo}`,
                    }}
                    style={styles.image}
                  />
                ) : (
                  <Image
                    source={{
                      uri: photo
                        ? photo.uri
                        : 'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
                    }}
                    style={styles.image}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => imageSelectBox(setAdharcard)}>
                {x.adharcard?.length > 0 ? (
                  <Image
                    source={{
                      uri: adharcard
                        ? adharcard.uri
                        : `${url}${x.adharcard}`,
                    }}
                    style={styles.image}
                  />
                ) : (
                  <Image
                    source={{
                      uri: adharcard
                        ? adharcard.uri
                        : 'https://cdn.pixabay.com/photo/2022/11/09/00/44/aadhaar-card-7579588_1280.png',
                    }}
                    style={styles.image}
                  />
                )}
              </TouchableOpacity>
            </View>
          ))}

<View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => patchData()}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
          </View>
        </View>
      )}

<View style={styles.buttonContainer}> 
      {data?.data?.length > 0 && (
<TouchableOpacity style={styles.button} onPress={() => deleteData()}>
          <Text style={styles.buttonText}> Delete</Text>
        </TouchableOpacity>
        )}
        </View>
       
    
        
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#d0d3cd',
    
  },
  dateCon: {
    padding: 20,
    backgroundColor:'lightgray',
    
  },
  
  header: {
    alignItems: 'left',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  invoiceInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  invoiceInfo: {
    flexDirection: 'row',
  },

  text: {
    marginLeft: 5,
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  customerInfoContainer: {
    marginTop: 20,
  },
  customerInfo: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemsContainer: {
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  itemName: {
    fontSize: 16,
  },
  itemDetails: {},
  itemTotal: {
    fontWeight: 'bold',
    
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginRight: 5, // Add some spacing between label and total
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  total: {
    fontSize: 16,
    marginLeft:15,
    color: '#555',
    fontWeight: 'bold',
  },
  image: {
    width: '80%',
    height: 300,
    borderRadius: 8,
    margin: 8,
     marginLeft:30
  },
  input: {
    height: 40,
    // borderWidth: 1,
    borderBottomWidth:1,
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
  nameText:{
    color:'brown' ,
    fontSize:17 ,
   
    alignItems:'center',
    
  } ,imageBtn:{
    width:'100%'
  } ,
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
  buttonContainer: {
    flexDirection: 'row', // Display buttons horizontally
    justifyContent: 'space-between', // Space them evenly in a row
    alignItems: 'center', // Center vertically
    marginVertical: 20, // Add some vertical margin for spacing
  },
  date:{
    alignItems:'center',
 
    borderColor:'black',
    borderWidth:1,
    margin:10
    
  },
  dateBox:{
    height:30
  } ,
  btncontainer: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-between', // Distribute buttons evenly
    marginTop: 20, // Add spacing
  },
  btnbutton: {
    backgroundColor: '#f5f5f5', // Light background
    borderRadius: 10, // Rounded corners
    padding: 10, // Margin around text
    flex: 1, // Make buttons equal width
    backgroundColor:'#413e3e',
    margin:5

  },
  btnbuttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color:"#FFFFFF"
  },
  
  

});

export default EditAllREs;
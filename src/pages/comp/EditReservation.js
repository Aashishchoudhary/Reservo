import axios from 'axios';
import React, {useState, useCallback, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {yyyymmdd} from './ImageModel';
import {btnImage, imageSelectBox} from './ImageDownLoad';
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
import {useSelector} from 'react-redux';

import ViewShot from 'react-native-view-shot';
import DatePicker from 'react-native-date-picker';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {setLoading, setChecking} from '../../store/auth/authSlice';
import {useNavigation} from '@react-navigation/native';
import {url} from '../../store/url';
const EditReservation = ({route}) => {
  const user = useSelector(state => state.auth.authTokens);
  const userId = useSelector(state => state.auth.user);
 
  const {idt, LibId} = route.params;

  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [mobile, setmobile] = useState('');
  const [stdate, setstdate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState('');
  const [adress, setAdress] = useState('');
  const [adharcard, setAdharcard] = useState(null);
  const [photo, setPhoto] = useState(null);

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
      console.log(url);
      // Perform navigation using navigation.navigate
      navigation.navigate('QR', {data: url});
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
      console.warn('Invoice Downloaded');
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
      setData(res);
      setDob(res.data[0]['dob'] ? new Date(res.data[0]['dob']) : new Date());
      setEndDate(
        res.data[0]['end_date']
          ? new Date(res.data[0]['end_date'])
          : new Date(),
      );
      
     
    } catch (err) {
     
     console.log(err)
    }
  };
  const patchData = async () => {
    try {
      await axios.patch(`${url}/edit-reservation-view/${idt}/`, updateData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + String(user.access),
        },
      });

      fetchData();
    } catch (err) {
      console.log(err.response.data);
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
      await fetchData();
  
    } catch (err) {
      console.log(err.response.data);
      Alert.alert('something went wrong please try agian later');
    }
  };
  const deleteData = async () => {
    try {
      await axios.delete(
        `${url}/edit-reservation-view/${idt}/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + String(user.access),
          },
        },
      );
     
    Alert.alert("Data Deleted")
    } catch (err) {
      Alert.alert('something went wrong please try agian later');
    }
  };

  useFocusEffect(
    useCallback(() => {
   
      fetchData();
      return () => {
        // Perform any cleanup here when the component is unmounted or loses focus
      };
    }, []),
  );
  const date = new Date().toDateString();
  const selectGender = [
    {
      label: 'Male',
    },
    {
      label: 'Female',
    },
  ];
  return (
    <KeyboardAwareScrollView>
      {!data?.data?.length && (
        <View style={styles.btncontainer}>
          <TouchableOpacity
            style={styles.btnbutton}
            onPress={() => createRoom()}>
            <Text style={styles.btnbuttonText}>Show QR</Text>
          </TouchableOpacity>
        </View>
      )}
      <View>
      {data?.data?.map(item => (
          <View key={item.id}>
            <ViewShot
              style={styles.container}
              ref={ref}
              options={{
                fileName: `${item.name}`,
                format: 'jpg',
                quality: 1,
              }}>
       
      {/* Header with Company Info */}
      <View style={styles.header}>
        <Text style={styles.companyName}>{data.library_name.slice(0,1).toUpperCase()+data.library_name.slice(1)}</Text>
        <Text style={styles.companyDetails}>{data.address}</Text>
        <Text style={styles.companyDetails}>Phone: {data.mobile_number}</Text>
        <Text style={styles.companyDetails}>Email: info@company.com</Text>
      </View>

      {/* Invoice Details */}
      <View style={styles.invoiceInfo}>
        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Seat No. :</Text>
          <Text style={styles.value}> {data.seat_num}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{new Date().toDateString()}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Due Date:</Text>
          <Text style={styles.value}>{item.end_date}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Amount :</Text>
          <Text style={styles.value}>₹ {item.amount}</Text>
        </View>
        
      </View>

      {/* Client Information */}
      <View style={styles.clientInfo}>
        <Text style={styles.sectionTitle}>Bill To:</Text>
        <Text style={styles.clientName}>{item.name.slice(0,1).toUpperCase()+item.name.slice(1)}</Text>
        <Text style={styles.clientDetails}>{item.adress}</Text>
        <Text style={styles.clientDetails}>Phone: {item.mobile_number}</Text>
        <Text style={styles.clientDetails}>Preapring For: {item.field}</Text>
        <Text style={styles.clientDetails}>Gender: {item.gender}</Text>
      </View>

      
       

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Product made by Labeo</Text>
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
                onPress={() => btnImage(`${url}${item.adharcard}`)}>
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
            <TouchableOpacity style={styles.button} onPress={() => snapShot()}>
              <Text style={styles.buttonText}>Download Invoice</Text>
            </TouchableOpacity>
          )}

          {data?.data?.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.button}
              onPress={() => initiateWhatsApp(item.mobile_number)}>
              <Text style={styles.buttonText}>Share on Whatsapp</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {data?.data?.length < 1 ? (
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

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => postData()}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.formContainer}>
          {data.data?.map((x, index) => (
            <View key={index}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={text => setName(text)}
                placeholder={x.name}
              />

              <TextInput
                style={styles.input}
                value={amount}
                keyboardType="numeric"
                onChangeText={e => setAmount(e)}
                placeholder={x.amount.toString()}
              />

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={mobile}
                onChangeText={e => setmobile(e)}
                placeholder={x.mobile_number.toString()}
                color={mobile.length > 9 ? 'green' : 'red'}
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
                {x.photo?.length > 0 ? (
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
                        : 'https://cdn.pixabay.com/photo/2022/11/09/00/44/aadhaar-card-7579588_1280.png',
                    }}
                    style={styles.image}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => imageSelectBox(setAdharcard)}>
                {x.adharcard?.length > 0 ? (
                  <Image
                    source={{
                      uri: adharcard ? adharcard.uri : `${url}${x.adharcard}`,
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

      <View style={styles.buttonContainerDelete}>
        {data?.data?.length > 0 && (
          <TouchableOpacity style={styles.buttonDelete} onPress={() => deleteData()}>
            <Text style={styles.buttonTextDelete}> Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  companyDetails: {
    fontSize: 14,
    color: '#555',
  },
  invoiceInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  invoiceHeader: {
    marginBottom: 10,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  clientInfo: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  clientDetails: {
    fontSize: 15,
    color: '#555',
    fontWeight:'600'
  },
  
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  formContainer:{
    margin:10,
    borderRadius:20,
    backgroundColor:"#fff",
    shadowColor:'#000'

  },
 
 
  dateLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight:'bold',
    textAlign:'center',
    margin:20,
    padding:10,
    backgroundColor:'black',
    width:80,
    borderRadius:10 
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  input: {
    height: 40,
    
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingHorizontal: 10,
    marginBottom: 16,
    fontWeight:'bold',
    fontSize:16,
    color:'black'
   
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
  nameText: {
    color: 'brown',
    fontSize: 17,

    alignItems: 'center',
  },
  imageBtn: {
    width: '100%',
  },
  button: {
    flex: 1, // Make each button take up equal space
    backgroundColor: 'black',
    padding: 12,
    width: '40%',
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
  // Add some vertical margin for spacing
    
  },
  date: {
    alignItems: 'center',

    borderWidth: 1,
    margin: 10,
  },
  dateBox: {
    height: 40,
    width:370,
    backgroundColor:'#dddbd9',
  },
  btncontainer: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-between', // Distribute buttons evenly
    marginTop: 10, // Add spacing,
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
  buttonDelete:{
    flex: 1, // Make each button take up equal space
    backgroundColor: '#f38619',
    padding: 12,
    
    borderRadius: 20,
    marginHorizontal: 10,
  },
  buttonContainerDelete:{
    width:"90%",
    marginLeft:20,
    marginBottom:20
  },
  buttonTextDelete:{
    fontSize:16,
    textAlign:'center',
    color:'black',
    fontWeight:'bold'
  }
});

export default EditReservation;

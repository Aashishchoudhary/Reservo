import React, {useState ,useCallback ,useRef} from 'react';
import {View, StyleSheet, Alert ,TouchableOpacity , TextInput ,Text ,Image ,Linking} from 'react-native';
import axios from 'axios';
import { yyyymmdd } from './ImageModel';
import { useSelector ,useDispatch } from 'react-redux';


import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { btnImage  ,imageSelectBox } from './ImageDownLoad';
import { useFocusEffect } from '@react-navigation/native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import ViewShot from 'react-native-view-shot';
import DatePicker from 'react-native-date-picker';
import RadioButtonRN from 'radio-buttons-react-native';

import {url} from '../../store/url'

const ViewHalfTimer = ({route}) => {
  const { idt}=route.params

 
   const user = useSelector(state => state.auth.authTokens)

   const [data , setData]=useState([])
 
  
   
   const [name, setName] = useState('');
   const [mobile, setmobile] = useState('');
   const [stdate, setstdate] = useState(new Date());
   const [endDate, setEndDate] = useState(new Date());
   const [amount, setAmount] = useState('');
   const [dob , setDob]=useState(new Date())
   const [gender , setGender]=useState('')
   const[adress , setAdress]= useState('')
   const [adharcard, setAdharcard] = useState('');
   const [photo, setPhoto] = useState('');

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
 


   const ref = useRef();

  const snapShot = () => {
    ref.current.capture().then(uri => {
      CameraRoll.save(uri, {type: 'photo'});
      
    });
  };


// create room 











  const fetchdata = async () => {
    try {
      const response = await axios.get(`${url}/half-day-student-view/${idt}/`,{
        headers: {
          Authorization: 'Bearer ' + String(user.access),
        },
      });
    
      const res = await response.data;
      console.log(res)
      setData(res)
      setDob(res.data[0]['dob']? new Date(res.data[0]['dob']):new Date())
      setEndDate(res.data[0]['end_date']? new Date(res.data[0]['end_date']):new Date())
      setstdate(res.data[0]['start_date']? new Date(res.data[0]['start_date']):new Date())
    } catch (err) {
      Alert.alert('Somrthing went wrong Please try after sometime');
    }
  };

 

  const deleteData = async () => {
    try {
      await axios.delete(`${url}/half-day-student-view/${idt}/`, {
        headers: {
          Authorization: 'Bearer ' + String(user.access),
        },
      });
      console.warn("Data Deleted")
      fetchdata()
    } catch (e) {
      Alert.alert('Something went wrong please try again later');
    }
  };
  const patchData = async () => {
    try {
       await axios.patch(`${url}/half-day-student-view/${idt}/`,updateData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + String(user.access),
        },
      });
      console.warn("Data Saved")
      await fetchdata()
      await imageVerify()
    } catch (e) {
      console.log(e.response.data)
      Alert.alert('Something went wrong please try again later');
    }
  };
  const initiateWhatsApp = num => {
    // Check for perfect 10 digit length
   

    let url = 'whatsapp://send?&phone=91' +num;
    Linking.openURL(url)
      .then((data) => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        Alert.alert('Make sure Whatsapp installed on your device');
      });
  };
  useFocusEffect(
    useCallback(() => {
      
   
      fetchdata()
      
      return () => {
        // Perform any cleanup here when the component is unmounted or loses focus
      };
    }, []))
     const date = new Date().toDateString();
  return  (
    <KeyboardAwareScrollView>
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
          <Text style={styles.value}> None</Text>
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
        
          <TouchableOpacity  style={styles.button} onPress={() => snapShot()}>
            <Text style={styles.buttonText}>Download Invoice</Text>
          </TouchableOpacity>
       

        
          {data?.data?.map((item)=>
          <TouchableOpacity key={item.id} style={styles.button} onPress={() => initiateWhatsApp(`${item.mobile_number}`)}>
            <Text style={styles.buttonText}>Share on Whatsapp</Text>
          </TouchableOpacity>
        )}
       
      </View></View>

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
                <Text style={styles.dateLabel}>End Date</Text>
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
    

      <View style={styles.buttonContainerDelete}>
  
          <TouchableOpacity style={styles.button} onPress={() => deleteData()}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        
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
    fontSize: 14,
    color: '#555',
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
    margin:20,
    borderRadius:20,
    backgroundColor:"#fff",
    shadowColor:'#000'

  },
 
 
  dateLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight:'bold',
    textAlign:'left',
    margin:20,
    padding:10,
    backgroundColor:'black',
    width:110,
    borderRadius:10 ,
    textAlign:'center'
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
  height: 40,
    width:370,
    backgroundColor:'#dddbd9',
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
buttonContainerDelete: {
  flexDirection: 'row', // Display buttons horizontally
  justifyContent: 'space-between', // Space them evenly in a row
  alignItems: 'center', // Center vertically
  // Add some vertical margin for spacing

  margin:10,
  marginBottom:50
 
},
});

export default ViewHalfTimer;

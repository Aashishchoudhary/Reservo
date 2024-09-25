import React ,{useState , useCallback} from 'react';
import {View, StyleSheet ,Text ,TextInput ,TouchableOpacity ,Alert} from 'react-native';
import axios from 'axios';
import { setLoading } from '../../store/auth/authSlice';
import { useDispatch , useSelector } from 'react-redux';
import {useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Geolocation from '@react-native-community/geolocation';
import {url} from '../../store/url'
const EditLibrary = ({route}) => {

    const {id} = route.params

    const [name, setName] = useState("");
    const [facilty, setFacilty] = useState("");
    const [locality, setlocality] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [pincode, setPincode] = useState("");
    const [imageOne, setImageOne] = useState(null);
    const [imageTwo, setimageTwo] = useState(null);
    const [imageThree, setimageThree] = useState(null);
    const [imageFour, setimageFour] = useState(null);
    const [imageFive, setimageFive] = useState(null);
    const [imageSix, setimageSix] = useState(null);
    const [imageSeven, setimageSeven] = useState(null);
    const [price, setPrice] = useState("");
    const [mobile_number, setMobileNumber] = useState("");
    const [whatsapp_number, setWhatsappNumber] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [total_seat, setTotalSeat] = useState("");

    
    const getLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
              setLatitude(latitude)
              setLongitude(longitude)
            },
            error => console.error(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
          );
      };

      const uploadData = new FormData();
      if(name)uploadData.append("name", name);
      if(facilty)uploadData.append("facilty", facilty);
      if(locality)uploadData.append("locality", locality);
      if(city)uploadData.append("city", city);
      if(district)uploadData.append("district", district);
      if(pincode)uploadData.append("pincode", pincode);
    
      // Optional image fields (null values are omitted)
      if (imageOne) uploadData.append("imageOne", imageOne);        
      if (imageTwo)   uploadData.append("imageTwo", imageTwo);
      if (imageThree) uploadData.append("imageThree", imageThree)
      if (imageFour)  uploadData.append("imageFour", imageFour)
      if (imageFive)  uploadData.append("imageFive", imageFive)
      if (imageSix)   uploadData.append("imageSix", imageSix);
      if (imageSeven) uploadData.append("imageSeven", imageSeven)
      
    
      if(price)uploadData.append("price", price);
      if(mobile_number)uploadData.append("mobile_number", mobile_number);
      if(whatsapp_number)uploadData.append("whatsapp_number", whatsapp_number);
      if(longitude)uploadData.append("longitude", longitude);
      if(latitude)uploadData.append("latitude", latitude);
      if(total_seat)uploadData.append("total_seat", total_seat);
    
    const dispatch = useDispatch()
    const user = useSelector(state=>state.auth.authTokens)
    const [data , setData] = useState([])


    const handleSubmit = async () => {
   
        try {
         const response= await axios
            .patch(`${url}/library-view/${id}/`, uploadData, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: "Bearer " + String(user.access),
              },
            })
            
            if(response.status == 201){
                Alert.alert('Updated')
                
            }
            
            
        } catch (err) {
           Alert.alert(err.response.data);
        }
      };
    const fetchData = async()=>{
        try{
const response = await axios.get(`${url}/library-view/${id}/` , {
    headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',

        Authorization: 'Bearer ' + String(user.access),
      },
})
const res = await response.data
setData(res)
        }catch(err){console.log()}
    }

    useFocusEffect(
        useCallback(() => {
          
          dispatch(setLoading(true))
          fetchData()
          getLocation()
          
          return () => {
            // Perform any cleanup here when the component is unmounted or loses focus
          };
        }, []))
          
          const handleSeat = (text) => {
            if (text < 201) {
              setTotalSeat(text);
            } else {
              Alert.alert("seat should be less than 201");
            }
          };
       
            return (
                <KeyboardAwareScrollView>

{data?.data?.map((x, index) => (
  <View key={index}>
    <TextInput
      style={styles.input}
      value={name}
      onChangeText={(text) => setName(text)}
      placeholder={x.name}
    />
   
              <TextInput
                style={styles.input}
                keyboardType = 'numeric'
                value={mobile_number}
                onChangeText={(text) => setMobileNumber(text)}
                placeholder={(x.mobile_number).toString()}
                
              />
            
                <TextInput
                  style={styles.input}
                  value={total_seat}
                  keyboardType = 'numeric'
                  onChangeText={(x) => handleSeat(x)}
                  placeholder={(x.total_seat).toString()}
                  
                /></View>
              ))}
              
              <TouchableOpacity style={styles.touchableOpacity} onPress={()=>handleSubmit()}><Text style={styles.touchableText}>Update</Text></TouchableOpacity>
                </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
      touchableOpacity: {
        backgroundColor: '#3498db',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
      },
      touchableText: {
        color: '#fff',
        fontSize: 16,
      },
    
})

export default EditLibrary;

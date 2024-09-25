import {useState ,useEffect ,useCallback} from 'react';
import {View, StyleSheet ,Text ,TextInput ,TouchableOpacity ,Alert} from 'react-native';
import { selectImage,openCamera } from './ImageModel';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useSelector ,useDispatch } from 'react-redux';
import { setLoading } from '../../store/auth/authSlice';
import {url} from '../../store/url'
import { useFocusEffect } from '@react-navigation/native';
const AddLibrary = () => {


  const dispatch = useDispatch()

    const navigation = useNavigation()
    const user = useSelector(state => state.auth.authTokens);
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



// geo location
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

// setloading refresh jwt
// useEffect(()=>{},[])
// console.log('add library')

useFocusEffect(
  useCallback(() => {
    // Your code here
    console.log('Screen is focused'); // Replace with your desired logic
    dispatch(setLoading(true))
    fetchData()
    // Cleanup function (optional)
    return () => {
      // Perform any cleanup here when the component is unmounted or loses focus
    };
  }, [])
);

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


  const fetchData = async ()=>{
    try{
const response = await axios.get("${url}/add-library/", {
  headers: {
   
        Accept: 'application/json',
    Authorization: "Bearer " + String(user.access),
  },
})
const res = await response.data
console.log(res.count)

if (res.count>4){
  Alert.alert('you can not add more , please contact to HELP center')
}

    }
    catch(err){
      console.log(err)
    }
  }

  const handleSubmit = async () => {
   
    try {
     const response= await axios
        .post("${url}/add-library/", uploadData, {
          headers: {
           
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            Authorization: "Bearer " + String(user.access),
          },
        })
      
        if(response.status == 201){
            console.log('view in' ,response.status)
            navigation.navigate('viewlib')
        }
        
        // navigation.goBack()
    } catch (err) {
      // Alert.alert("something went wrong")
        Alert.alert(err.response.data.deatils);
    }
  };


 




useEffect(() => {
    getLocation()
   
}, []);

  const handleSeat = (text) => {
    if (text < 201) {
      setTotalSeat(text);
    } else {
      Alert.alert("seat should be less than 201");
    }
  };
    return (
        <KeyboardAwareScrollView>
            <TextInput
        style={styles.input}
        value={name}
        onChangeText={(text) => setName(text)}
        placeholder="name"
      />
      
      
      
      <TextInput
        style={styles.input}
        value={mobile_number}
        onChangeText={(text) => setMobileNumber(text)}
        placeholder="mobile number"
        required
      />
     
      
      <TextInput
        style={styles.input}
        value={total_seat}
        keyboardType = 'numeric'
        onChangeText={(x) => handleSeat(x)}
        placeholder="total seats"
        required
      />
      <TouchableOpacity style={styles.touchableOpacity} onPress={()=>handleSubmit()}><Text style={styles.touchableText}>Add</Text></TouchableOpacity>
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

export default AddLibrary;

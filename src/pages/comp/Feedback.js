import {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';
import {url} from '../../store/url';
import {useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import { imageSelectBox } from './ImageDownLoad';
const Feedback = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.authTokens);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [msg, setMsg] = useState('');
  const [img, setImg] = useState('');
  const [showForm, setShowForm] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  const fetchData = async () => {
    const response = await axios.get(`${url}/feedback/`, {
      headers: {
        Authorization: 'Bearer ' + user.access,
      },
    });
    const res = await response.data;
    setData(res);
    console.log(res);
  };

  const uploadData = new FormData();
  if (msg) {
    uploadData.append('message', msg);
  }
  if (img) {
    uploadData.append('img', img);
  }
  const postFeedback = async () => {
   
    try {
      await axios.post(`${url}/feedback/`, uploadData, {
        headers: {
          
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + user.access,
        },
      });
      Alert.alert('data Saved');
      setShowForm(false)
    } catch (err) {
      Alert.alert('there is some issue'), console.log(err);
    }
  };
  const formFunction = () => {
    setShowForm(!showForm);
  };
  useEffect(() => {
    fetchData();
  }, [refreshing]);

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.cont}>
        <TouchableOpacity onPress={formFunction} style={styles.toggleButton}>
          <Text style={styles.toggleText}>
            {showForm ? 'Hide Form' : 'Show Form'}
          </Text>
        </TouchableOpacity>

        {showForm && (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              value={msg}
              onChangeText={text => setMsg(text)}
              placeholder="Write your valuable feedback, feature request, or any issue you have within the app"
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              onPress={() => imageSelectBox(setImg)}
              style={styles.imageContainer}>
              <Image
                source={{
                  uri: img
                    ? img.uri
                    : 'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
                }}
                style={styles.image}
              />
            </TouchableOpacity>
            <TouchableOpacity  onPress={postFeedback}>
              <Text style={{color:"black" , fontSize:16}}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {data?.map(item => (
        <View key={item.id} style={styles.dataContainer}>
          <Text style={styles.text}>{item.message.slice(0, 100)}</Text>
          <TouchableOpacity
            disabled={item.resolved ? false : true}
            onPress={() =>
              item.resolved
                ? navigation.navigate('viewfeedback', {id: item.id})
                : ''
            }
            style={item.resolved ? styles.btn : styles.btnWait}>
            <Text style={styles.btnText}>
              {item.resolved ? 'View' : 'wait..'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    backgroundColor: '#e2dcd8',
    borderRadius: 10,
  },
  text: {
    margin: 5,
    marginLeft: 10,
    color: 'black',
    fontSize: 16,
    fontWeight: '800',
    width: '75%',
  },
  btn: {
    marginRight: 10,
    padding: 15,
    backgroundColor: 'black',
    width: 80,
    height: '90%',
    marginTop: 10,
    borderRadius: 10,
  },
  btnText: {
    color: 'white',
    
  },
  btnWait: {
    marginRight: 10,
    padding: 15,
    backgroundColor: 'gray',
    width: 80,
    height: '80%',
    marginTop: 10,
    borderRadius: 10,
    fontSize:15
  },
  cont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  toggleButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
  
  },
  toggleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    textAlignVertical: 'top',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    resizeMode: 'cover',
  },
});

export default Feedback;

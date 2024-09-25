import {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import {url} from '../../store/url';
import {useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
const Feedback = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.authTokens);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, [refreshing]);

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {data?.map(item => (
        <View key={item.id} style={styles.dataContainer}>
          <Text style={styles.text}>{item.message.slice(0, 100) }=={item.id}</Text>
          <TouchableOpacity
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
    height: '70%',
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
    height: '70%',
    marginTop: 10,
    borderRadius: 10,
  },
});

export default Feedback;

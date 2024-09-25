import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import axios from 'axios';
import {setLoading} from '../../store/auth/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {url} from '../../store/url'
const PreviousStudent = ({route}) => {
  const {id} = route.params;

  const user = useSelector(state => state.auth.authTokens);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}/previous-student/${id}/`, {
        headers: {
          Authorization: 'Bearer ' + String(user.access),
        },
      });
      const res = await response.data;
      setFilteredDataSource(res);
      setMasterDataSource(res);
    } catch (err) {
      console.log(err);
    }
  };

  // search data
  const searchText = text => {
    if (text) {
      const newData = masterDataSource.filter(item => {
        const itemData = item.name.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  //shorted by id
  masterDataSource.sort((a, b) => {
    return b.id - a.id;
  });

  useFocusEffect(
    useCallback(() => {
      ;
      fetchData();

      return () => {
        // Perform any cleanup here when the component is unmounted or loses focus
      };
    }, []),
  );

  return (
    <View>
      <View style={styles.container}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={text => searchText(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
        />
      </View>
      {filteredDataSource.map(item => (
        <TouchableOpacity
          key={item.id}
          onPress={() =>
            navigation.navigate('viewPrevious', {id: id, idt: item.id})
          }
          style={styles.touchableItem}>
          <View style={styles.itemView}>
            <Text style={styles.itemText}>
              {item.name.slice(0, 1).toUpperCase() + item.name.slice(1)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  touchableItem: {
    // backgroundColor: 'lightgray', // Set your desired background color
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  itemView: {
    // You can add additional styling for the container view here
  },
  itemText: {
    fontSize: 18, // Set your desired font size
    fontWeight: 'bold', // Set your desired font weight
    color: 'black', // Set your desired text color
  },

  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
});

export default PreviousStudent;

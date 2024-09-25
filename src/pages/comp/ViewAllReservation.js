import React, {useState, useCallback} from 'react';

import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {setLoading} from '../../store/auth/authSlice';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {url} from '../../store/url'
const ViewAllReservation = ({route}) => {
  const navigation = useNavigation();
  const {LibId} = route.params;
  const dispatch = useDispatch();
  const [display, setDisplay] = useState(false);
  const user = useSelector(state => state.auth.authTokens);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  const searchFilterFunction = text => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item?.data[0]?.name
          ? item?.data[0]?.name.toUpperCase()
          : ''.toUpperCase();
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

  const shortedData = () => {
    setDisplay(false);
    const dtt = masterDataSource.slice().sort((a, b) => {
      const aEndDate = a.data?.[0]?.end_date || '';
      const bEndDate = b.data?.[0]?.end_date || '';

      if (aEndDate === '' && bEndDate === '') {
        // If both are empty, consider them equal.
        return 0;
      } else if (aEndDate === '') {
        // If only aEndDate is empty, b should come before a.
        return 1;
      } else if (bEndDate === '') {
        // If only bEndDate is empty, a should come before b.
        return -1;
      } else {
        return new Date(aEndDate) - new Date(bEndDate);
      }
    });
    setFilteredDataSource(dtt);
  };
  const admissionData = () => {
    setDisplay(false);
    const dtt = masterDataSource.slice().sort((a, b) => {
      const aEndDate = a.data?.[0]?.updated_at||'';
      const bEndDate = b.data?.[0]?.updated_at||'';
      if (aEndDate === '' && bEndDate === '') {
        // If both are empty, consider them equal.
        return 0;
      } else if (aEndDate === '') {
        // If only aEndDate is empty, b should come before a.
        return 1;
      } else if (bEndDate === '') {
        // If only bEndDate is empty, a should come before b.
        return -1;
      } else {
        return new Date(bEndDate)-new Date(aEndDate) ;
      }
    });
    setFilteredDataSource(dtt);
  };

  //
  const fetchData = async () => {
    const response = await axios.get(`${url}/all-seat-reservation-view/${LibId}/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(user.access),
      },
    });

    const res = await response.data;
    setFilteredDataSource(res);
    setMasterDataSource(res);
  };
  useFocusEffect(
    useCallback(() => {
      ;
      fetchData();

      return () => {};
    }, [refreshing]),
  );

  // alert type
  const filterFun = () => {
    Alert.alert('Apply Filter', '', [
      {text: 'Cancel', onPress: () => setDisplay(false), style: 'cancel'},
      {text: 'Expire', onPress: () => shortedData()},
      {text: 'New Entries', onPress: () => admissionData()},
    ]);
  };

  return (
    <KeyboardAwareScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.container}>
        <View style={styles.subCon}>
          <TextInput
            style={styles.textInputStyle}
            onChangeText={text => searchFilterFunction(text)}
            value={search}
            underlineColorAndroid="transparent"
            placeholder="Search Here"
          />
          <TouchableOpacity
            onPress={() => setDisplay(true)}
            style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
          {display && filterFun()}
        </View>
        {filteredDataSource?.map(item => (
          <TouchableOpacity key={item.id}
            onPress={() =>
              navigation.navigate('EditAllRes', {
                idt: item?.ser?.map(y => y.id), LibId:LibId
              })
            }
            style={styles.container}>
            <View key={item.id}>
              <Text style={styles.seatNumber}>{item.seat_num}</Text>
              {item?.data?.map(x => (
                <View key={x.id}>
                  <Text style={styles.name}>{x.name}</Text>
                  <Text style={styles.endDate}>{x.end_date}</Text>
                  {new Date(x.end_date) < new Date() && (
                    <Text style={styles.expired}>Expired</Text>
                  )}
                  {new Date(x.end_date) > new Date() && (
                    <Text style={styles.expiring}>
                      Days Left{' '}
                      {Math.floor(
                        (new Date(x.end_date).getTime() -
                          new Date().getTime()) /
                          86400000,
                      )}
                    </Text>
                  )}
                </View>
              ))}
            </View>
            <View style={styles.divider} />
          </TouchableOpacity>
        ))}
      </View>
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
    backgroundColor: 'lightgray',
    padding: 10,
    margin: 5,
  },
  seatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
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
});

export default ViewAllReservation;

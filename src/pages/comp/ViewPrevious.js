import React ,{useState , useCallback} from 'react';
import {View, StyleSheet ,Text ,TouchableOpacity ,Image} from 'react-native';
import axios from 'axios';
import { setLoading } from '../../store/auth/authSlice';
import { useDispatch , useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { btnImage } from './ImageDownLoad';

import {url} from '../../store/url'
const ViewPrevious = ({route}) => {
    const {id ,idt} = route.params
    const [data , setData] = useState([])
    const user = useSelector(state=>state.auth.authTokens)
    const dispatch = useDispatch()


    const fetchData =async()=>{
        try{
            const response = await axios.get(`${url}/previous-student/${id}/${idt}/`,{
                headers: {
                    Authorization: 'Bearer ' + String(user.access),
                  },
            })
            const res = await response.data
            setData(res)
            
        }catch(err){console.log(err)}
    }

    useFocusEffect(
        useCallback(() => {
          
          
          fetchData()
          
          return () => {
            // Perform any cleanup here when the component is unmounted or loses focus
          };
        }, []))
    return (
      <View>
  {data?.map((x) => (
    <View key={x.id} style={styles.invoiceContainer}>
      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Name:</Text>
        <Text style={styles.fieldValue}>{x.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Amount:</Text>
        <Text style={styles.fieldValue}>{x.amount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.fieldLabel}>Start Date:</Text>
        <Text style={styles.fieldValue}>{x.created_on}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.fieldLabel}>End Date:</Text>
        <Text style={styles.fieldValue}>{x.end_date}</Text>
      </View>
     
      <View style={styles.row}></View>

      {x.photo && (
        <TouchableOpacity  onPress={() => btnImage(`${url}${x.photo}`)}>
          <Image style={styles.image} source={{ uri: `${url}${x.photo}` }} />
        </TouchableOpacity>
      )}
      {x.adharcard && (
        <TouchableOpacity onPress={() => btnImage(`${url}${x.adharcard}`)}>
          <Image style={styles.image} source={{ uri: `${url}${x.adharcard}` }} />
        </TouchableOpacity>
      )}
    </View>
  ))}
</View>

    );
}

const styles = StyleSheet.create({
  invoiceContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fieldLabel: {
    fontWeight: 'bold',
  },
  fieldValue: {
    marginLeft: 8,
  },
  productText: {
    fontStyle: 'italic',
    marginTop: 8,
  },
  image: {
    width: 200,
    height: 200,
    marginLeft:70
  },

});

export default ViewPrevious;

import {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {url} from '../../store/url';
const ViewFeedback = ({route}) => {
  const user = useSelector(state => state.auth.authTokens);
  const {id} = route.params;
  const [data, setData] = useState([]);
  const fetchData = async () => {
    const response = await axios.get(`${url}/feedback/${id}/`, {
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
  }, []);
  return (
    <View style={styles.container}>
      
        <Text style={styles.text}>{data.reply}</Text>
     
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        
    },
    text:{
        margin:10,
        color:'black',
        fontSize:17
        
    }
});

export default ViewFeedback;

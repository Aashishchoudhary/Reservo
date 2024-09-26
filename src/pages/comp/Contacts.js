import React from 'react';
import { StyleSheet, View ,Text ,Image ,TouchableOpacity ,Linking,Alert } from 'react-native';
import call from '../../image/call.png'
import whatsapp from '../../image/whatsapp.png'
import email from '../../image/email.png'

const Contacts = () => {

    const initiateWhatsApp = () => {
        // Check for perfect 10 digit length
       
    
        let url = 'whatsapp://send?&phone=916367032851';
        Linking.openURL(url)
          .then((data) => {
            console.log('WhatsApp Opened');
          })
          .catch(() => {
            Alert.alert('Make sure Whatsapp installed on your device');
          });
      };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Contact Us:</Text>
            <Text style={styles.textPara}>For inquires or help , you can contact us.{"\n"}We'll gad to help you</Text>
            <View style={styles.contactConatiner}>
            <TouchableOpacity style={styles.contact} onPress={()=>Linking.openURL('tel:6367032851')}><Image style={styles.img} source={call}/><Text style={styles.contactText}>Call us on +916367032851</Text></TouchableOpacity>
            <TouchableOpacity style={styles.contact} onPress={()=>initiateWhatsApp()}><Image style={styles.img} source={whatsapp}/><Text style={styles.contactText}>whatsap us on (+91)6367032851</Text></TouchableOpacity>
            <TouchableOpacity style={styles.contact} onPress={()=>Linking.openURL('mailto:aashishchoudhary2002@gmail.com')}><Image style={styles.img} source={email}/><Text style={styles.contactText}>Email us on aashish@gmial.com</Text></TouchableOpacity></View>
            
        </View>
    );
}

const styles = StyleSheet.create({
container:{
    flex:1,
backgroundColor:"black"
} ,
title:{
    color:'white',
    fontSize:30,
    fontWeight:'bold',
    marginLeft:20,
    marginTop:15
},
textPara:{
    color:'white',
    marginLeft:20,
    marginTop:15,
    fontSize:20,
    fontWeight:"medium"
},
contactConatiner:{
    marginTop:40
},
contact:{
    backgroundColor:'white',
    margin:20,
    borderRadius:10,
    flexDirection: 'row',
    height:50
},
img:{
    width:35,
    height:28,
    marginLeft:20,
    marginTop:7,
    marginBottom:1,
    padding:2
},
contactText:{
    marginLeft:10,
    fontSize:18,

    padding:5,
    color:'green'
}
})

export default Contacts;

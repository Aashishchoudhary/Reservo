import React from 'react';
import {View, StyleSheet ,Image, Text , TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const HomePage = () => {
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
      {/* Logo Image */}
      {/* Replace 'YourLogoImage' with your actual logo image component */}
      <Image source={require('../../image/icon.png')} style={styles.logo}/>

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>Sign-Up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.contact}  onPress={() => navigation.navigate('contactus')}>
        <Text style={styles.contactText}>Contact Us</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#f9f7f5'
   
  },
  logo: {
    width: 250, // Adjust the width of the logo image
    height: 200, // Adjust the height of the logo image
    marginBottom: 20, // Add space between logo and buttons
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons horizontally
    marginTop: 20, // Add space between logo and buttons
  },
  button: {
    backgroundColor: '#cbc9c6', // Adjust button styling as needed
    padding: 10,
    margin: 10,
     // Add space between buttons
    borderRadius: 7, // Add rounded corners
  },
  buttonText: {
    color: 'black', // Adjust text color
    fontSize: 18, // Adjust text size
  },
  contact:{
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom:50
  },
  contactText:{
    color:'black',
    fontSize:20,
    fontWeight:'bold',
    borderBottomColor:'black',
    borderBottomWidth:1.5


  }
  // Add styles for your logo image
});
export default HomePage;

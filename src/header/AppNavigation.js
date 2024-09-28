import {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { initializeAsyncData } from '../store/auth/authSlice';
import { useDispatch  ,useSelector} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import LoginPass from '../pages/login/LoginPass';
import ValidateOtp from '../pages/login/ValidateOtp';
import Register from '../pages/login/Register';
import RegisterOtp from '../pages/login/RegisterOtp';
import DrawerNavigation from './Drawer/DrawerNavigation';

import ViewSeatReservation from '../pages/comp/ViewSeatReservation';
import AddReservation from '../pages/comp/AddReservation';
import AddLibrary from '../pages/comp/AddLibrary';
import ViewAllReservation from '../pages/comp/ViewAllReservation';
import EditReservation from '../pages/comp/EditReservation';
import TotalCollection from '../pages/comp/TotalCollection';
import RefreshToken from '../store/RefreshToken';
import SendPasswordOtp from '../pages/login/SendPasswordOtp';
import ValidatePasswordOtp from '../pages/login/ValidatePasswordOtp';
import PasswordRest from '../pages/login/PasswordRest';
import ExtraReservation from '../pages/comp/ExtraReservation';
import ViewExtra from '../pages/comp/ViewExtra';
import HalfTimer from '../pages/comp/HalfTimer';
import ViewPrevious from '../pages/comp/ViewPrevious';
import EditLibrary from '../pages/comp/EditLibrary';
import ViewHalfTimer from '../pages/comp/ViewHalfTimer';
import PreviousStudent from '../pages/comp/PreviousStudent';

import HomePage from '../pages/login/HomePage';
import SendLoginOtp from '../pages/login/SendLoginOtp';
import LoginOtp from '../pages/login/LoginOtp';
import QR from '../pages/comp/QR';
import ViewFeedback from '../pages/comp/ViewFeedback';



const Stack = createStackNavigator();

const AppNavigation = () => {

   
 
 const user= useSelector((state)=>state.auth.user)

 const dispatch = useDispatch();

   useEffect(() => {
     dispatch(initializeAsyncData());
 }, [dispatch]);






    return (
        <NavigationContainer>
       <Stack.Navigator>
        {!user?<>
        <Stack.Screen name='HomePage' component={HomePage} options={{headerShown:false}}/>
        <Stack.Screen name='Login' component={LoginPass} options={{headerShown:false}}/>
        <Stack.Screen name='Validate' component={ValidateOtp} options={{headerShown:false}}/>
        <Stack.Screen name='sendloginotp' component={SendLoginOtp}/>
        <Stack.Screen name='loginotp' component={LoginOtp}/>
        <Stack.Screen name='Register' component={Register} options={{headerShown:false}}/>
        <Stack.Screen name='SignUp' component={RegisterOtp} options={{headerShown:false}}/>
        <Stack.Screen name='sendForgotPasswordOtp' component={SendPasswordOtp} options={{headerShown:false}}/>
        <Stack.Screen name='ValidateForgotPass' component={ValidatePasswordOtp} options={{headerShown:false}}/>
        <Stack.Screen name='PasswordReset' component={PasswordRest} options={{headerShown:false}}/>
        </>:<Stack.Screen name='drwa' component={DrawerNavigation} options={{headerShown:false}}/>}
        {user&&<>
       
        <Stack.Screen name='ViewSeat' component={ViewSeatReservation} options={{title:''}}/>
        <Stack.Screen name='AddReservation' component={AddReservation} options={{title:'Save'}}/>
        <Stack.Screen name='AddLibrary' component={AddLibrary} options={{title:'Add'}}/>
        <Stack.Screen name='ViwAlRe' component={ViewAllReservation} options={{title:''}}/>
        <Stack.Screen name='editreservation' component={EditReservation} options={{title:'Edit Library'}}/>
        <Stack.Screen name='collection' component={TotalCollection} options={{title:''}}/>
        <Stack.Screen name='extra' component={ExtraReservation} options={{title:''}}/>
        <Stack.Screen name='editExtra' component={ViewExtra} options={{title:''}}/>
        <Stack.Screen name='half' component={HalfTimer} options={{title:''}}/>
        <Stack.Screen name='edithalf' component={ViewHalfTimer} options={{title:''}}/>
        <Stack.Screen name='previous' component={PreviousStudent} options={{title:'Deleted Data'}}/>
        <Stack.Screen name='viewPrevious' component={ViewPrevious} options={{title:''}}/>
        <Stack.Screen name='EditLibrary' component={EditLibrary} options={{title:''}}/>
        
        <Stack.Screen name='QR' component={QR} options={{title:''}}/>
        <Stack.Screen name='viewfeedback' component={ViewFeedback} options={{title:''}}/>
     
        </>}
        </Stack.Navigator>  
        {/* <RefreshToken/> */}
       {/* {user&& <Collection/>} */}

        </NavigationContainer>
    );
}


export default AppNavigation;

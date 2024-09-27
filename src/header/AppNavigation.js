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

import ViewSeat from '../pages/comp/ViewSeat';
import AddReservation from '../pages/comp/AddReservation';
import AddLibrary from '../pages/comp/AddLibrary';
import ViewAllReservation from '../pages/comp/ViewAllReservation';
import EditAllREs from '../pages/comp/EditAllREs';
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
       
        <Stack.Screen name='ViewSeat' component={ViewSeat}/>
        <Stack.Screen name='AddReservation' component={AddReservation} options={{title:'Save Reservation'}}/>
        <Stack.Screen name='AddLibrary' component={AddLibrary} options={{title:'Add Library'}}/>
        <Stack.Screen name='ViwAlRe' component={ViewAllReservation} options={{title:'Reservation'}}/>
        <Stack.Screen name='EditAllRes' component={EditAllREs} options={{title:'Edit'}}/>
        <Stack.Screen name='collection' component={TotalCollection} options={{title:'Total Collection'}}/>
        <Stack.Screen name='extra' component={ExtraReservation} options={{title:'Extra '}}/>
        <Stack.Screen name='editExtra' component={ViewExtra} options={{title:'Edit'}}/>
        <Stack.Screen name='half' component={HalfTimer} options={{title:'HalfDay'}}/>
        <Stack.Screen name='viewHalf' component={ViewHalfTimer} options={{title:'Edit '}}/>
        <Stack.Screen name='previous' component={PreviousStudent} options={{title:'Previous '}}/>
        <Stack.Screen name='viewPrevious' component={ViewPrevious} options={{title:'View'}}/>
        <Stack.Screen name='EditLibrary' component={EditLibrary} options={{title:'Edit '}}/>
        
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

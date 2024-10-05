import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { StatusBar  } from 'react-native';
import Home from '../../pages/comp/Home';

import ViewLibrary from '../../pages/comp/ViewLibrary';
import AddLibrary from '../../pages/comp/AddLibrary';
import ChangePassword from '../../pages/login/ChangePassword';
import Payment from '../../payment/Payment';
import Contacts from '../../pages/comp/Contacts';
import Feedback from '../../pages/comp/Feedback';



const Drawer = createDrawerNavigator()
const DrawerNavigation = () => {
    StatusBar.setHidden(true, 'none');
    return (
        <Drawer.Navigator>
            <Drawer.Screen name='viewlib' component={ViewLibrary} options={{ title: 'Home' }}/>
            <Drawer.Screen name='AddLib' component={AddLibrary} options={{ title: 'Add Library' }}/>
            <Drawer.Screen name='ChangePassword' component={ChangePassword} options={{ title: 'Change Password',headerTitle:'' }}/>
            <Drawer.Screen name='contact' component={Contacts} options={{title:'Contact' , headerTitle:''}}/>
            <Drawer.Screen name='feedback' component={Feedback} options={{title:'FeedBack' }}/>
            <Drawer.Screen name='payment' component={Payment} options={{ title: 'Payment' }}/>
            <Drawer.Screen name='Home' component={Home} options={{ title: 'Logout' }}/>
          
        </Drawer.Navigator>
    );
}


export default DrawerNavigation;

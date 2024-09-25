import React from 'react';
import {Provider} from 'react-redux';
import 'react-native-gesture-handler'
import store from './src/store/store';
import AppNavigation from './src/header/AppNavigation';

const App = () => {
  return (
    <Provider store={store}>
      
    <AppNavigation/>
    </Provider>
  );
}



export default App;

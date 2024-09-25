import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from "jwt-decode";




const initialState={
    authTokens:null,
    user: null,
    loading:true,   
    checking:true,
    
   
}
clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }
  
    
  }
const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        setAuthToken:(state,action)=>{
            state.authTokens = action.payload
            
        },
        setUser:(state , action)=>{
            state.user = action.payload

        },
       logoutUser:(state)=>{
        state.authTokens=null,
        state.user=null,
        clearAll()
       },
        setLoading:(state ,action)=>{
            state.loading=action.payload
        },
         setChecking:(state ,action)=>{
            state.checking=action.payload
        } ,
        
        
    }    
})

export const initializeAsyncData = () => async (dispatch) => {
    try {
      const userName = await AsyncStorage.getItem('authTokens')
      
      const token = userName ? JSON.parse(userName) : null;
      const userExist = userName ? (jwtDecode(userName)) : null;
  
      dispatch(setAuthToken(token));
      dispatch(setUser(userExist));
    } catch (error) {
      console.error('Error initializing async data:', error);
    }
  };

export const {setAuthToken , setUser,logoutUser ,setLoading  ,setChecking}=authSlice.actions



export default authSlice.reducer


import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getConnectionsRequest, getMyConnectionRequests, loginUser, registerUser } from "../../action/authAction";
import { getAllUsers } from "../../action/authAction";


const initialState = {
  user: undefined,
  isError: false,
  isSucess: false,
  isLoading: false,
  loggedIn: false,
  message: '',
  isTokenThere: false,
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_users: [],
  all_profiles_fetched: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = 'hello';
  
        },
        emptyMessage: (state) => {
            state.message = ""
        },
        setTokenIsThere: (state) => {
            state.isTokenThere = true;
        },
        setTokenIsNotThere: (state) => {
            state.isTokenThere = false;
        }
     },
     extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.message = 'Loading...';

        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSucess = true;
            state.loggedIn = true;
            // state.user = action.payload;
            state.message = {
                message: "Login sucessful"
            }
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.message = action.payload;
        })
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.message = 'Registring You...';
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.isSucess = true;
            state.message = {
                message:'Registration Successful Please Login'
            }
        }) 
        .addCase(registerUser.rejected,(state,action) => {
            state.isLoading = false;
            state.isError= true;
            state.message= action.payload
        }) 
        .addCase(getAboutUser.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.profileFetched = true;
            // state.connections = action.payload.connections;
            state.user = action.payload.userProfile;
            // state.connectionRequest = action.payload.connectionRequest;
        }) 

        .addCase(getAllUsers.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.all_profiles_fetched= true;
            // state.all_users = action.payload.userProfile;
            state.all_users = action.payload.profiles || []; 

        })
        .addCase(getConnectionsRequest.fulfilled,(state,action)=>{
            state.connections = action.payload;
        })
        .addCase(getConnectionsRequest.rejected,(state,action)=>{
            state.message = action.payload
        })
        .addCase(getMyConnectionRequests.fulfilled,(state,action)=>{
            state.connectionRequest = action.payload
            console.log(`fetch redycer connection`,state.connectionRequest)
        })
        .addCase(getMyConnectionRequests.rejected,(state,action)=>{
            state.message = action.payload
        })

   }   
 })

 export const {reset,emptyMessage,setTokenIsThere,setTokenIsNotThere} = authSlice.actions;

 export default authSlice.reducer;
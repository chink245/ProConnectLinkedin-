import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";
  

// STEPS For state management
// 1. Submit action
// 2. Handle reaches reducer
// 3. register here ->Reducer

export const store = configureStore({
  reducer: {
    // register reducers here
    auth: authReducer,
    postReducer: postReducer,
  },
}); 


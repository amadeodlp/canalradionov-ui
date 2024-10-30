// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@redux/auth/authSlice';

// Define the RootState type
export type RootState = ReturnType<typeof store.getState>;

// Define the AppDispatch type
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;

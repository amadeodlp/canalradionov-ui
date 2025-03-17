import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signUp } from "aws-amplify/auth";
import axios from "axios";
import Cookies from "js-cookie";

export interface AuthState {
  isAuthenticated: boolean;
  error: string | null;
  scopes: string[];
}

export type SignupPayload = {
  username: string;
  password: string;
  options: {
    userAttributes: {
      email: string;
      given_name: string;
      family_name: string;
      phone_number: string;
      'custom:userType': string;
      'custom:account': string;
      zoneinfo: string;
    }
  }
};

export const signup = createAsyncThunk('auth/signup', async (payload: SignupPayload, { rejectWithValue }) => {
  try {
    await signUp(payload);
  } catch (error: any) {
    if (error.toString().includes('UsernameExistsException')) {
      return rejectWithValue('USERNAME_EXISTS');
    } else {
      return rejectWithValue('UNKNOWN_ERROR');
    }
  }
});

export const login = createAsyncThunk('auth/login', async (payload: { username: string; password: string }, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post(`${process.env.apiUrl}/login`, 
      { orgId: process.env.orgId, username: payload.username, password: payload.password },
      { withCredentials: true });
    console.log(response, 'response from server')
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('An error occurred during session initialization.');
    }
  } catch (error) {
    console.log(error, 'error');
    return rejectWithValue('UNKNOWN_ERROR');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  const accessToken = Cookies.get('jwt-token');
  try {
    await axios.post(`${process.env.apiUrl}/logout`, {}, {
      withCredentials: true,
      headers: {
        'Authorization': `${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Logout failed:', error);
  }
});

const initialState: AuthState = {
  isAuthenticated: false,
  error: null,
  scopes: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.scopes = action.payload.scopes;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.scopes = [];
      }).addCase(logout.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

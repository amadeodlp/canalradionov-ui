import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@lib/supabase';

export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null;
  error: string | null;
}

export type SignupPayload = {
  email: string;
  password: string;
  username: string;
};

export const signup = createAsyncThunk('auth/signup', async (payload: SignupPayload, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: { username: payload.username, app_name: 'Wavecaster' },
      emailRedirectTo: 'https://wavecaster.lat',
    },
  });
  if (error) {
    if (error.message.includes('already registered')) return rejectWithValue('USERNAME_EXISTS');
    return rejectWithValue('UNKNOWN_ERROR');
  }
  return { userId: data.user?.id, username: payload.username };
});

export const login = createAsyncThunk('auth/login', async (payload: { username: string; password: string }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.username, // field is named username in the form but holds email
    password: payload.password,
  });
  if (error) return rejectWithValue('INVALID_CREDENTIALS');

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name')
    .eq('id', data.user.id)
    .single();

  return { userId: data.user.id, username: profile?.username || data.user.email };
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await supabase.auth.signOut();
});

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  username: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state, action) => {
        state.error = null;
        state.userId   = action.payload?.userId ?? null;
        state.username = action.payload?.username ?? null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.userId   = action.payload.userId;
        state.username = action.payload.username ?? null;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.userId   = null;
        state.username = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

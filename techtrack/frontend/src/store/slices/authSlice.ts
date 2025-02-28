import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from '../../services/auth';
import { User } from '../../types';

// Define interfaces for state
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Define initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(username, password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Ошибка при входе');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Ошибка при регистрации');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    authService.logout();
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Ошибка при получении профиля');
    }
  }
);

export const checkAuthState = createAsyncThunk(
  'auth/checkAuthState',
  async (_, { dispatch }) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Validate token by fetching user profile
        const user = await authService.getCurrentUser();
        return { user, token };
      } catch (error) {
        // If token is invalid, clear it
        localStorage.removeItem('token');
        return { user: null, token: null };
      }
    }
    return { user: null, token: null };
  }
);

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<{ access_token: string; token_type: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.access_token;
      localStorage.setItem('token', action.payload.access_token);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    });

    // Fetch user profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchUserProfile.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    });

    // Check auth state
    builder.addCase(checkAuthState.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkAuthState.fulfilled, (state, action: PayloadAction<{ user: User | null; token: string | null }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.user;
    });
  },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserPreferences } from '../../types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Mock user data for development
const mockUser: User = {
  id: '1',
  email: 'demo@honestnews.com',
  name: 'Demo User',
  subscriptionTier: 'standard',
  preferences: {
    topics: ['technology', 'health', 'environment'],
    detailLevel: 'standard',
    fontSize: 16,
    darkMode: false,
    notifications: {
      breakingNews: true,
      dailyDigest: true,
      topicUpdates: false,
    },
  },
  createdAt: new Date().toISOString(),
};

// Async thunks for user operations
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, validate with backend
    if (credentials.email && credentials.password) {
      return mockUser;
    } else {
      throw new Error('Invalid credentials');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: { email: string; password: string; name: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      ...mockUser,
      email: userData.email,
      name: userData.name,
      subscriptionTier: 'free' as const,
    };
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updatePreferences',
  async (preferences: Partial<UserPreferences>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return preferences;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    return;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // For demo purposes - auto login
    setDemoUser: (state) => {
      state.user = mockUser;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Update preferences
      .addCase(updateUserPreferences.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.preferences = { ...state.user.preferences, ...action.payload };
        }
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update preferences';
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setDemoUser } = userSlice.actions;
export default userSlice.reducer; 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  SettingsState, 
  UpdateProfileData, 
  PasswordUpdateData,
} from './settings.types';
import { settingsService } from './settingsService';

const initialState: SettingsState = {
  profile: null,
  notificationSettings: {
    emailNotifications: true,
    lowStockAlerts: true,
    expiryAlerts: true,
    newUserAlerts: false,
    reportAlerts: true,
    pushNotifications: false,
    smsNotifications: false,
  },
  themeSettings: {
    theme: 'light',
    sidebarCollapsed: false,
    fontSize: 'medium',
    compactView: false,
  },
  inventorySettings: {
    defaultLowStockThreshold: 50,
    defaultExpiryWarningDays: 30,
    autoReorder: false,
    autoReorderQuantity: 100,
    defaultUnit: 'pcs',
    currency: 'USD',
    taxRate: 0,
  },
  preferences: {
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    firstDayOfWeek: 1,
  },
  isLoading: false,
  error: null,
  successMessage: null,
};

// ✅ Fetch Profile
export const fetchProfile = createAsyncThunk(
  'settings/fetchProfile',
  async () => {
    const response = await settingsService.getProfile();
    return response;
  }
);

// ✅ Update Profile
export const updateProfile = createAsyncThunk(
  'settings/updateProfile',
  async (data: UpdateProfileData) => {
    const response = await settingsService.updateProfile(data);
    return response;
  }
);

// ✅ Update Password
export const updatePassword = createAsyncThunk(
  'settings/updatePassword',
  async (data: PasswordUpdateData, { rejectWithValue }) => {
    try {
      const response = await settingsService.updatePassword(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// ✅ Upload Avatar
export const uploadAvatar = createAsyncThunk(
  'settings/uploadAvatar',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await settingsService.uploadAvatar(file);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      // ✅ Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.successMessage = 'Profile updated successfully';
        console.log('✅ Profile updated in state:', state.profile);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update profile';
      })
      // ✅ Update Password
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // ✅ Upload Avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.profile) {
          state.profile.avatar = action.payload.avatarUrl;
        }
        state.successMessage = 'Avatar uploaded successfully';
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to upload avatar';
      });
  },
});

export const { clearError, clearSuccessMessage } = settingsSlice.actions;
export default settingsSlice.reducer;
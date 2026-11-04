import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AlertsState, Alert, CreateAlertDTO } from './alerts.types';
import api from '../../services/api';

const initialState: AlertsState = {
  alerts: [],
  activeAlerts: [],
  dismissedAlerts: [],
  resolvedAlerts: [],
  isLoading: false,
  error: null,
  filters: {
    type: '',
    priority: '',
    status: '',
    search: '',
  },
};

// ✅ Fetch Alerts
export const fetchAlerts = createAsyncThunk<
  Alert[],
  void,
  { rejectValue: string }
>('alerts/fetchAlerts', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Alert[]>('/alerts');
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch alerts');
  }
});

// ✅ Fetch Active Alerts
export const fetchActiveAlerts = createAsyncThunk<
  Alert[],
  void,
  { rejectValue: string }
>('alerts/fetchActiveAlerts', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Alert[]>('/alerts/active');
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch active alerts');
  }
});

// ✅ Dismiss Alert
export const dismissAlert = createAsyncThunk<
  Alert,
  string,
  { rejectValue: string }
>('alerts/dismissAlert', async (id, { rejectWithValue }) => {
  try {
    const response = await api.put<{ alert: Alert }>(`/alerts/${id}/dismiss`);
    return response.data.alert;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to dismiss alert');
  }
});

// ✅ Resolve Alert
export const resolveAlert = createAsyncThunk<
  Alert,
  string,
  { rejectValue: string }
>('alerts/resolveAlert', async (id, { rejectWithValue }) => {
  try {
    const response = await api.put<{ alert: Alert }>(`/alerts/${id}/resolve`);
    return response.data.alert;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to resolve alert');
  }
});

// ✅ Create Alert (أضف هذا)
export const createAlert = createAsyncThunk<
  Alert,
  CreateAlertDTO,
  { rejectValue: string }
>('alerts/createAlert', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post<Alert>('/alerts', data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to create alert');
  }
});

// ✅ Check Alerts
export const checkAlerts = createAsyncThunk<
  Alert[],
  void,
  { rejectValue: string }
>('alerts/checkAlerts', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<{ alerts: Alert[] }>('/alerts/check');
    return response.data.alerts || [];
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to check alerts');
  }
});

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setTypeFilter: (state, action: PayloadAction<string>) => {
      state.filters.type = action.payload;
    },
    setPriorityFilter: (state, action: PayloadAction<string>) => {
      state.filters.priority = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    clearFilters: (state) => {
      state.filters = { type: '', priority: '', status: '', search: '' };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action: PayloadAction<Alert[]>) => {
        state.isLoading = false;
        state.alerts = action.payload;
        state.activeAlerts = action.payload.filter((a) => a.status === 'ACTIVE');
        state.dismissedAlerts = action.payload.filter((a) => a.status === 'DISMISSED');
        state.resolvedAlerts = action.payload.filter((a) => a.status === 'RESOLVED');
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch alerts';
      })
      .addCase(fetchActiveAlerts.fulfilled, (state, action: PayloadAction<Alert[]>) => {
        state.isLoading = false;
        state.activeAlerts = action.payload;
      })
      .addCase(dismissAlert.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(dismissAlert.fulfilled, (state, action: PayloadAction<Alert>) => {
        state.isLoading = false;
        const index = state.alerts.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.alerts[index] = action.payload;
        }
        state.activeAlerts = state.alerts.filter((a) => a.status === 'ACTIVE');
        state.dismissedAlerts = state.alerts.filter((a) => a.status === 'DISMISSED');
        state.resolvedAlerts = state.alerts.filter((a) => a.status === 'RESOLVED');
      })
      .addCase(dismissAlert.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to dismiss alert';
      })
      .addCase(resolveAlert.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resolveAlert.fulfilled, (state, action: PayloadAction<Alert>) => {
        state.isLoading = false;
        const index = state.alerts.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.alerts[index] = action.payload;
        }
        state.activeAlerts = state.alerts.filter((a) => a.status === 'ACTIVE');
        state.dismissedAlerts = state.alerts.filter((a) => a.status === 'DISMISSED');
        state.resolvedAlerts = state.alerts.filter((a) => a.status === 'RESOLVED');
      })
      .addCase(resolveAlert.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to resolve alert';
      })
      .addCase(createAlert.fulfilled, (state, action: PayloadAction<Alert>) => {
        state.alerts.unshift(action.payload);
        state.activeAlerts = state.alerts.filter((a) => a.status === 'ACTIVE');
      })
      .addCase(checkAlerts.fulfilled, (state, action: PayloadAction<Alert[]>) => {
        state.activeAlerts = action.payload;
      });
  },
});

export const {
  setTypeFilter,
  setPriorityFilter,
  setStatusFilter,
  setSearchFilter,
  clearFilters,
  clearError,
} = alertsSlice.actions;

export default alertsSlice.reducer;
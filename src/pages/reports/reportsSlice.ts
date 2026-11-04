import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ReportsState, ReportFilters, InventoryReportData, StockReportData, PredictionData } from './reports.types';
import api from '../../services/api';

const initialState: ReportsState = {
  inventoryReport: null,
  stockReport: null,
  predictions: [],
  isLoading: false,
  error: null,
  filters: {
    dateFrom: '',
    dateTo: '',
    categoryId: '',
    supplierId: '',
  },
};

export const fetchInventoryReport = createAsyncThunk<
  InventoryReportData,
  ReportFilters,
  { rejectValue: string }
>('reports/fetchInventoryReport', async (filters, { rejectWithValue }) => {
  try {
    const response = await api.get<InventoryReportData>('/reports/inventory', { params: filters });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch inventory report');
  }
});

export const fetchStockReport = createAsyncThunk<
  StockReportData,
  ReportFilters,
  { rejectValue: string }
>('reports/fetchStockReport', async (filters, { rejectWithValue }) => {
  try {
    const response = await api.get<StockReportData>('/reports/stock', { params: filters });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch stock report');
  }
});

export const fetchPredictions = createAsyncThunk<
  PredictionData[],
  void,
  { rejectValue: string }
>('reports/fetchPredictions', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<PredictionData[]>('/reports/predictions');
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch predictions');
  }
});

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setDateFrom: (state, action: PayloadAction<string>) => {
      state.filters.dateFrom = action.payload;
    },
    setDateTo: (state, action: PayloadAction<string>) => {
      state.filters.dateTo = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.filters.categoryId = action.payload;
    },
    setSupplierFilter: (state, action: PayloadAction<string>) => {
      state.filters.supplierId = action.payload;
    },
    clearFilters: (state) => {
      state.filters = { dateFrom: '', dateTo: '', categoryId: '', supplierId: '' };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInventoryReport.fulfilled, (state, action: PayloadAction<InventoryReportData>) => {
        state.isLoading = false;
        state.inventoryReport = action.payload;
      })
      .addCase(fetchInventoryReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch inventory report';
      })
      .addCase(fetchStockReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStockReport.fulfilled, (state, action: PayloadAction<StockReportData>) => {
        state.isLoading = false;
        state.stockReport = action.payload;
      })
      .addCase(fetchStockReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch stock report';
      })
      .addCase(fetchPredictions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPredictions.fulfilled, (state, action: PayloadAction<PredictionData[]>) => {
        state.isLoading = false;
        state.predictions = action.payload;
      })
      .addCase(fetchPredictions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch predictions';
      });
  },
});

export const {
  setDateFrom,
  setDateTo,
  setCategoryFilter,
  setSupplierFilter,
  clearFilters,
  clearError,
} = reportsSlice.actions;

export default reportsSlice.reducer;
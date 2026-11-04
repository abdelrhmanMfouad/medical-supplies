import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  StockState, 
  StockTransaction, 
  StockInDTO, 
  StockOutDTO,
  StockItem
} from './stock.types';
import api from '../../services/api';

const initialState: StockState = {
  transactions: [],
  selectedTransaction: null,
  isLoading: false,
  error: null,
  successMessage: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  filters: {
    search: '',
    type: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  },
  items: [],
};

// ✅ Fetch Transactions
export const fetchTransactions = createAsyncThunk<
  StockTransaction[],
  void,
  { rejectValue: string }
>('stock/fetchTransactions', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<StockTransaction[]>('/stock');
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch transactions');
  }
});

// ✅ Fetch Transaction By ID
export const fetchTransactionById = createAsyncThunk<
  StockTransaction,
  string,
  { rejectValue: string }
>('stock/fetchTransactionById', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<StockTransaction>(`/stock/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch transaction');
  }
});

// ✅ Stock IN
export const stockIn = createAsyncThunk<
  StockTransaction,
  StockInDTO,
  { rejectValue: string }
>('stock/stockIn', async (data, { rejectWithValue }) => {
  try {
    console.log('📥 Stock IN data:', data);
    
    if (!data.itemId) {
      return rejectWithValue('Item ID is required');
    }
    
    const response = await api.post<StockTransaction>('/stock/in', data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error('❌ Stock IN error:', err.response?.data);
    return rejectWithValue(err.response?.data?.message || 'Stock IN failed');
  }
});

// ✅ Stock OUT
export const stockOut = createAsyncThunk<
  StockTransaction,
  StockOutDTO,
  { rejectValue: string }
>('stock/stockOut', async (data, { rejectWithValue }) => {
  try {
    console.log('📤 Stock OUT data:', data);
    const response = await api.post<StockTransaction>('/stock/out', data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error('❌ Stock OUT error:', err.response?.data);
    return rejectWithValue(err.response?.data?.message || 'Stock OUT failed');
  }
});

// ✅ Fetch Items for Dropdown
export const fetchItemsForDropdown = createAsyncThunk<
  StockItem[],
  void,
  { rejectValue: string }
>('stock/fetchItemsForDropdown', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<StockItem[]>('/items');
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch items');
  }
});

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setSelectedTransaction: (state, action: PayloadAction<StockTransaction | null>) => {
      state.selectedTransaction = action.payload;
    },
    clearSelectedTransaction: (state) => {
      state.selectedTransaction = null;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.pagination.currentPage = 1;
    },
    setTypeFilter: (state, action: PayloadAction<string>) => {
      state.filters.type = action.payload;
      state.pagination.currentPage = 1;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
      state.pagination.currentPage = 1;
    },
    setDateFromFilter: (state, action: PayloadAction<string>) => {
      state.filters.dateFrom = action.payload;
      state.pagination.currentPage = 1;
    },
    setDateToFilter: (state, action: PayloadAction<string>) => {
      state.filters.dateTo = action.payload;
      state.pagination.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = { search: '', type: '', status: '', dateFrom: '', dateTo: '' };
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<StockTransaction[]>) => {
        state.isLoading = false;
        state.transactions = action.payload;
        state.pagination.totalItems = action.payload.length;
        state.pagination.totalPages = Math.ceil(action.payload.length / state.pagination.itemsPerPage);
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch transactions';
      })
      .addCase(fetchTransactionById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action: PayloadAction<StockTransaction>) => {
        state.isLoading = false;
        state.selectedTransaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch transaction';
      })
      .addCase(stockIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(stockIn.fulfilled, (state, action: PayloadAction<StockTransaction>) => {
        state.isLoading = false;
        state.transactions.unshift(action.payload);
        state.successMessage = 'Stock IN successful';
      })
      .addCase(stockIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Stock IN failed';
      })
      .addCase(stockOut.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(stockOut.fulfilled, (state, action: PayloadAction<StockTransaction>) => {
        state.isLoading = false;
        state.transactions.unshift(action.payload);
        state.successMessage = 'Stock OUT successful';
      })
      .addCase(stockOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Stock OUT failed';
      })
      .addCase(fetchItemsForDropdown.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchItemsForDropdown.fulfilled, (state, action: PayloadAction<StockItem[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchItemsForDropdown.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch items';
      });
  },
});

export const {
  setSelectedTransaction,
  clearSelectedTransaction,
  setSearchFilter,
  setTypeFilter,
  setStatusFilter,
  setDateFromFilter,
  setDateToFilter,
  clearFilters,
  setCurrentPage,
  clearError,
  clearSuccessMessage,
} = stockSlice.actions;

export default stockSlice.reducer;
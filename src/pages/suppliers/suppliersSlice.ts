import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SuppliersState, Supplier, CreateSupplierDTO, UpdateSupplierDTO } from './suppliers.types';
import api from '../../services/api';

const initialState: SuppliersState = {
  suppliers: [],
  selectedSupplier: null,
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
    status: '',
  },
};

// ✅ Fetch Suppliers
export const fetchSuppliers = createAsyncThunk<
  Supplier[],
  void,
  { rejectValue: string }
>('suppliers/fetchSuppliers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Supplier[]>('/suppliers');
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch suppliers');
  }
});

// ✅ Fetch Supplier By ID (أضف هذا)
export const fetchSupplierById = createAsyncThunk<
  Supplier,
  string,
  { rejectValue: string }
>('suppliers/fetchSupplierById', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch supplier');
  }
});

// ✅ Create Supplier
export const createSupplier = createAsyncThunk<
  Supplier,
  CreateSupplierDTO,
  { rejectValue: string }
>('suppliers/createSupplier', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post<Supplier>('/suppliers', data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to create supplier');
  }
});

// ✅ Update Supplier
export const updateSupplier = createAsyncThunk<
  Supplier,
  UpdateSupplierDTO,
  { rejectValue: string }
>('suppliers/updateSupplier', async (data, { rejectWithValue }) => {
  try {
    const response = await api.put<Supplier>(`/suppliers/${data.id}`, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to update supplier');
  }
});

// ✅ Delete Supplier
export const deleteSupplier = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>('suppliers/deleteSupplier', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/suppliers/${id}`);
    return { id };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to delete supplier');
  }
});

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    setSelectedSupplier: (state, action: PayloadAction<Supplier | null>) => {
      state.selectedSupplier = action.payload;
    },
    clearSelectedSupplier: (state) => {
      state.selectedSupplier = null;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.pagination.currentPage = 1;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
      state.pagination.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = { search: '', status: '' };
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
      .addCase(fetchSuppliers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action: PayloadAction<Supplier[]>) => {
        state.isLoading = false;
        state.suppliers = action.payload;
        state.pagination.totalItems = action.payload.length;
        state.pagination.totalPages = Math.ceil(action.payload.length / state.pagination.itemsPerPage);
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch suppliers';
      })
      .addCase(fetchSupplierById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSupplierById.fulfilled, (state, action: PayloadAction<Supplier>) => {
        state.isLoading = false;
        state.selectedSupplier = action.payload;
      })
      .addCase(fetchSupplierById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch supplier';
      })
      .addCase(createSupplier.fulfilled, (state, action: PayloadAction<Supplier>) => {
        state.isLoading = false;
        state.suppliers.unshift(action.payload);
        state.pagination.totalItems = state.suppliers.length;
        state.successMessage = 'Supplier created successfully';
      })
      .addCase(updateSupplier.fulfilled, (state, action: PayloadAction<Supplier>) => {
        state.isLoading = false;
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
        state.selectedSupplier = action.payload;
        state.successMessage = 'Supplier updated successfully';
      })
      .addCase(deleteSupplier.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.isLoading = false;
        state.suppliers = state.suppliers.filter(s => s.id !== action.payload.id);
        state.pagination.totalItems = state.suppliers.length;
        state.selectedSupplier = null;
        state.successMessage = 'Supplier deleted successfully';
      });
  },
});

export const {
  setSelectedSupplier,
  clearSelectedSupplier,
  setSearchFilter,
  setStatusFilter,
  clearFilters,
  setCurrentPage,
  clearError,
  clearSuccessMessage,
} = suppliersSlice.actions;

export default suppliersSlice.reducer;
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ItemsState, Item, CreateItemDTO, UpdateItemDTO, Category, Supplier } from './items.types';
import api from '../../services/api';

const initialState: ItemsState = {
  items: [],
  selectedItem: null,
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
    category: '',
    status: '',
  },
  categories: [],
  suppliers: [],
};

// ✅ Fetch Items - من الـ Backend الحقيقي
export const fetchItems = createAsyncThunk<
  Item[],
  void,
  { rejectValue: string }
>('items/fetchItems', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Item[]>('/items');
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch items');
  }
});

// ✅ Fetch Item By ID - من الـ Backend الحقيقي
export const fetchItemById = createAsyncThunk<
  Item,
  string,
  { rejectValue: string }
>('items/fetchItemById', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<Item>(`/items/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch item');
  }
});

// ✅ Fetch Categories - من الـ Backend الحقيقي
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>('items/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Category[]>('/categories');
    const categories = response.data.map((cat: Category & { _id?: string }) => ({
      id: cat._id || cat.id,
      name: cat.name,
    }));
    return categories;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
  }
});

// ✅ Fetch Suppliers - من الـ Backend الحقيقي
export const fetchSuppliers = createAsyncThunk<
  Supplier[],
  void,
  { rejectValue: string }
>('items/fetchSuppliers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Supplier[]>('/suppliers');
    const suppliers = response.data.map((sup: Supplier & { _id?: string }) => ({
      ...sup,
      id: sup._id || sup.id,
    }));
    return suppliers;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch suppliers');
  }
});

// ✅ Create Item - من الـ Backend الحقيقي
export const createItem = createAsyncThunk<
  Item,
  CreateItemDTO,
  { rejectValue: string }
>('items/createItem', async (data, { rejectWithValue }) => {
  try {
    console.log('📦 Creating item with data:', data);
    const response = await api.post<Item>('/items', data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error('❌ Create item error:', err.response?.data);
    return rejectWithValue(err.response?.data?.message || 'Failed to create item');
  }
});

// ✅ Update Item - من الـ Backend الحقيقي
export const updateItem = createAsyncThunk<
  Item,
  UpdateItemDTO,
  { rejectValue: string }
>('items/updateItem', async (data, { rejectWithValue }) => {
  try {
    console.log('📝 Updating item with data:', data);
    const response = await api.put<Item>(`/items/${data.id}`, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to update item');
  }
});

// ✅ Delete Item - من الـ Backend الحقيقي
export const deleteItem = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>('items/deleteItem', async (id, { rejectWithValue }) => {
  try {
    console.log('🗑️ Deleting item with ID:', id);
    await api.delete(`/items/${id}`);
    return { id };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error('❌ Delete item error:', err.response?.data);
    return rejectWithValue(err.response?.data?.message || 'Failed to delete item');
  }
});

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<Item | null>) => {
      state.selectedItem = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.pagination.currentPage = 1;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
      state.pagination.currentPage = 1;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
      state.pagination.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = { search: '', category: '', status: '' };
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
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.isLoading = false;
        state.items = action.payload;
        state.pagination.totalItems = action.payload.length;
        state.pagination.totalPages = Math.ceil(action.payload.length / state.pagination.itemsPerPage);
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch items';
      })
      .addCase(fetchItemById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchItemById.fulfilled, (state, action: PayloadAction<Item>) => {
        state.isLoading = false;
        state.selectedItem = action.payload;
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch item';
      })
      .addCase(createItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createItem.fulfilled, (state, action: PayloadAction<Item>) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
        state.pagination.totalItems = state.items.length;
        state.successMessage = 'Item created successfully';
      })
      .addCase(createItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create item';
      })
      .addCase(updateItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateItem.fulfilled, (state, action: PayloadAction<Item>) => {
        state.isLoading = false;
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.selectedItem = action.payload;
        state.successMessage = 'Item updated successfully';
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update item';
      })
      .addCase(deleteItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteItem.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.isLoading = false;
        state.items = state.items.filter(i => i.id !== action.payload.id);
        state.pagination.totalItems = state.items.length;
        state.selectedItem = null;
        state.successMessage = 'Item deleted successfully';
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete item';
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.categories = action.payload;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action: PayloadAction<Supplier[]>) => {
        state.suppliers = action.payload;
      });
  },
});

export const {
  setSelectedItem,
  clearSelectedItem,
  setSearchFilter,
  setCategoryFilter,
  setStatusFilter,
  clearFilters,
  setCurrentPage,
  clearError,
  clearSuccessMessage,
} = itemsSlice.actions;

export default itemsSlice.reducer;
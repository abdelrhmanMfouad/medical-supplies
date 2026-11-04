import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CategoriesState, Category, CreateCategoryDTO, UpdateCategoryDTO } from './categories.types';
import api from '../../services/api';

const initialState: CategoriesState = {
  categories: [],
  selectedCategory: null,
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
  },
};

// ✅ Fetch Categories
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>('categories/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
  }
});

// ✅ Fetch Category By ID (أضف هذا)
export const fetchCategoryById = createAsyncThunk<
  Category,
  string,
  { rejectValue: string }
>('categories/fetchCategoryById', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch category');
  }
});

// ✅ Create Category
export const createCategory = createAsyncThunk<
  Category,
  CreateCategoryDTO,
  { rejectValue: string }
>('categories/createCategory', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to create category');
  }
});

// ✅ Update Category
export const updateCategory = createAsyncThunk<
  Category,
  UpdateCategoryDTO,
  { rejectValue: string }
>('categories/updateCategory', async (data, { rejectWithValue }) => {
  try {
    const response = await api.put<Category>(`/categories/${data.id}`, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to update category');
  }
});

// ✅ Delete Category
export const deleteCategory = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: string }
>('categories/deleteCategory', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/categories/${id}`);
    return { id };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || 'Failed to delete category');
  }
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.pagination.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = { search: '' };
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
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.pagination.totalItems = action.payload.length;
        state.pagination.totalPages = Math.ceil(action.payload.length / state.pagination.itemsPerPage);
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch categories';
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action: PayloadAction<Category>) => {
        state.isLoading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch category';
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.isLoading = false;
        state.categories.unshift(action.payload);
        state.pagination.totalItems = state.categories.length;
        state.successMessage = 'Category created successfully';
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.isLoading = false;
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.selectedCategory = action.payload;
        state.successMessage = 'Category updated successfully';
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.isLoading = false;
        state.categories = state.categories.filter(c => c.id !== action.payload.id);
        state.pagination.totalItems = state.categories.length;
        state.selectedCategory = null;
        state.successMessage = 'Category deleted successfully';
      });
  },
});

export const {
  setSelectedCategory,
  clearSelectedCategory,
  setSearchFilter,
  clearFilters,
  setCurrentPage,
  clearError,
  clearSuccessMessage,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
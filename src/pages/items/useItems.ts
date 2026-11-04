import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {
  fetchItems,
  fetchItemById,
  createItem,
  updateItem,
  deleteItem,
  fetchCategories,
  fetchSuppliers,
  setSelectedItem,
  clearSelectedItem,
  setSearchFilter,
  setCategoryFilter,
  setStatusFilter,
  clearFilters,
  setCurrentPage,
  clearError,
  clearSuccessMessage,
} from './itemsSlice';
import {
  Item,
  CreateItemDTO,
  UpdateItemDTO,
} from './items.types';

export const useItems = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    items,
    selectedItem,
    isLoading,
    error,
    successMessage,
    pagination,
    filters,
    categories,    // ✅ أضف
    suppliers,     // ✅ أضف
  } = useSelector((state: RootState) => state.items);

  // Get filtered items
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.sku.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      result = result.filter((item) => item.categoryId === filters.category);
    }

    if (filters.status) {
      result = result.filter((item) => item.status === filters.status);
    }

    return result;
  }, [items, filters]);

  // Get paginated items
  const paginatedItems = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;
    return filteredItems.slice(start, end);
  }, [filteredItems, pagination.currentPage, pagination.itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredItems.length / pagination.itemsPerPage);

  // Load data on mount
  useEffect(() => {
    dispatch(fetchItems());
    dispatch(fetchCategories());
    dispatch(fetchSuppliers());
  }, [dispatch]);

  // CRUD Operations
  const loadItems = useCallback(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const getItem = useCallback(
    (id: string) => {
      dispatch(fetchItemById(id));
    },
    [dispatch]
  );

  const handleCreateItem = useCallback(
  async (data: CreateItemDTO) => {
    try {
      const result = await dispatch(createItem(data)).unwrap();
      return result;
    } catch (error) {
      console.error('Create item error:', error);
      throw error;
    }
  },
  [dispatch]
  );

  const handleUpdateItem = useCallback(
  async (data: UpdateItemDTO) => {
    try {
      console.log('📝 Updating item with ID:', data.id);
      const result = await dispatch(updateItem(data)).unwrap();
      return result;
    } catch (error) {
      console.error('❌ Update error:', error);
      throw error;
    }
  },
  [dispatch]
);

  const handleDeleteItem = useCallback(
  async (id: string) => {
    try {
      console.log('🗑️ Deleting item with ID:', id);
      const result = await dispatch(deleteItem(id)).unwrap();
      return result;
    } catch (error) {
      console.error('❌ Delete error:', error);
      throw error;
    }
  },
  [dispatch]
);

  // Filter operations
  const handleSearch = useCallback(
    (search: string) => {
      dispatch(setSearchFilter(search));
    },
    [dispatch]
  );

  const handleCategoryFilter = useCallback(
    (category: string) => {
      dispatch(setCategoryFilter(category));
    },
    [dispatch]
  );

  const handleStatusFilter = useCallback(
    (status: string) => {
      dispatch(setStatusFilter(status));
    },
    [dispatch]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page));
    },
    [dispatch]
  );

  const handleSelectItem = useCallback(
    (item: Item | null) => {
      if (item) {
        dispatch(setSelectedItem(item));
      } else {
        dispatch(clearSelectedItem());
      }
    },
    [dispatch]
  );

  // Clear messages
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearSuccess = useCallback(() => {
    dispatch(clearSuccessMessage());
  }, [dispatch]);

  return {
    // State
    items: paginatedItems,
    allItems: filteredItems,
    selectedItem,
    isLoading,
    error,
    successMessage,
    pagination: {
      ...pagination,
      totalPages,
      totalItems: filteredItems.length,
    },
    filters,
    categories,    // ✅ أضف
    suppliers,     // ✅ أضف
    
    // Actions
    loadItems,
    getItem,
    createItem: handleCreateItem,
    updateItem: handleUpdateItem,
    deleteItem: handleDeleteItem,
    
    // Filter Actions
    search: handleSearch,
    filterByCategory: handleCategoryFilter,
    filterByStatus: handleStatusFilter,
    clearFilters: handleClearFilters,
    changePage: handlePageChange,
    selectItem: handleSelectItem,
    
    // Clear Actions
    clearError: handleClearError,
    clearSuccess: handleClearSuccess,
  };
};
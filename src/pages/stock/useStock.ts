import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {
  fetchTransactions,
  fetchTransactionById,
  stockIn,
  stockOut,
  fetchItemsForDropdown,
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
} from './stockSlice';
import {
  StockTransaction,
  StockInDTO,
  StockOutDTO,
} from './stock.types';

export const useStock = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    transactions,
    selectedTransaction,
    isLoading,
    error,
    successMessage,
    pagination,
    filters,
    items,
  } = useSelector((state: RootState) => state.stock);

  // ✅ Filter transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.itemName?.toLowerCase().includes(searchLower) ||
          t.sku?.toLowerCase().includes(searchLower) ||
          t.reference?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.type) {
      result = result.filter((t) => t.type === filters.type);
    }

    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }

    if (filters.dateFrom) {
      result = result.filter((t) => new Date(t.createdAt) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      result = result.filter((t) => new Date(t.createdAt) <= new Date(filters.dateTo));
    }

    return result;
  }, [transactions, filters]);

  const paginatedTransactions = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;
    return filteredTransactions.slice(start, end);
  }, [filteredTransactions, pagination.currentPage, pagination.itemsPerPage]);

  const totalPages = Math.ceil(filteredTransactions.length / pagination.itemsPerPage);

  // ✅ Load data
  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchItemsForDropdown());
  }, [dispatch]);

  const loadTransactions = useCallback(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const getTransaction = useCallback(
    (id: string) => {
      dispatch(fetchTransactionById(id));
    },
    [dispatch]
  );

  const handleStockIn = useCallback(
  async (data: StockInDTO) => {
    try {
      console.log('📥 handleStockIn called with:', data);  // ✅ Debug
      const result = await dispatch(stockIn(data)).unwrap();
      console.log('✅ handleStockIn result:', result);
      return result;
    } catch (error) {
      console.error('❌ handleStockIn error:', error);
      throw error;
    }
  },
  [dispatch]
);
  const handleStockOut = useCallback(
    async (data: StockOutDTO) => {
      const result = await dispatch(stockOut(data)).unwrap();
      return result;
    },
    [dispatch]
  );

  const handleSearch = useCallback(
    (search: string) => {
      dispatch(setSearchFilter(search));
    },
    [dispatch]
  );

  const handleTypeFilter = useCallback(
    (type: string) => {
      dispatch(setTypeFilter(type));
    },
    [dispatch]
  );

  const handleStatusFilter = useCallback(
    (status: string) => {
      dispatch(setStatusFilter(status));
    },
    [dispatch]
  );

  const handleDateFromFilter = useCallback(
    (date: string) => {
      dispatch(setDateFromFilter(date));
    },
    [dispatch]
  );

  const handleDateToFilter = useCallback(
    (date: string) => {
      dispatch(setDateToFilter(date));
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

  const handleSelectTransaction = useCallback(
    (transaction: StockTransaction | null) => {
      if (transaction) {
        dispatch(setSelectedTransaction(transaction));
      } else {
        dispatch(clearSelectedTransaction());
      }
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearSuccess = useCallback(() => {
    dispatch(clearSuccessMessage());
  }, [dispatch]);

  return {
    transactions: paginatedTransactions,
    allTransactions: filteredTransactions,
    selectedTransaction,
    isLoading,
    error,
    successMessage,
    pagination: {
      ...pagination,
      totalPages,
      totalItems: filteredTransactions.length,
    },
    filters,
    items,
    
    loadTransactions,
    getTransaction,
    stockIn: handleStockIn,
    stockOut: handleStockOut,
    
    search: handleSearch,
    filterByType: handleTypeFilter,
    filterByStatus: handleStatusFilter,
    filterByDateFrom: handleDateFromFilter,
    filterByDateTo: handleDateToFilter,
    clearFilters: handleClearFilters,
    changePage: handlePageChange,
    selectTransaction: handleSelectTransaction,
    
    clearError: handleClearError,
    clearSuccess: handleClearSuccess,
  };
};
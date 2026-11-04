import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {
  fetchInventoryReport,
  fetchStockReport,
  fetchPredictions,
  setDateFrom,
  setDateTo,
  setCategoryFilter,
  setSupplierFilter,
  clearFilters,
  clearError,
} from './reportsSlice';
import { ReportFilters } from './reports.types';

export const useReports = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    inventoryReport,
    stockReport,
    predictions,
    isLoading,
    error,
    filters,
  } = useSelector((state: RootState) => state.reports);

  const loadInventoryReport = useCallback(
    (filters: ReportFilters) => {
      dispatch(fetchInventoryReport(filters));
    },
    [dispatch]
  );

  const loadStockReport = useCallback(
    (filters: ReportFilters) => {
      dispatch(fetchStockReport(filters));
    },
    [dispatch]
  );

  const loadPredictions = useCallback(() => {
    dispatch(fetchPredictions());
  }, [dispatch]);

  const handleDateFrom = useCallback(
    (date: string) => {
      dispatch(setDateFrom(date));
    },
    [dispatch]
  );

  const handleDateTo = useCallback(
    (date: string) => {
      dispatch(setDateTo(date));
    },
    [dispatch]
  );

  const handleCategoryFilter = useCallback(
    (categoryId: string) => {
      dispatch(setCategoryFilter(categoryId));
    },
    [dispatch]
  );

  const handleSupplierFilter = useCallback(
    (supplierId: string) => {
      dispatch(setSupplierFilter(supplierId));
    },
    [dispatch]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    loadInventoryReport(filters);
    loadStockReport(filters);
  }, [filters, loadInventoryReport, loadStockReport]); // ✅ load on mount and when filters change

  useEffect(() => {
    loadPredictions();
  }, [loadPredictions]); // ✅ load once on mount

  return {
    inventoryReport,
    stockReport,
    predictions,
    isLoading,
    error,
    filters,
    loadInventoryReport,
    loadStockReport,
    loadPredictions,
    setDateFrom: handleDateFrom,
    setDateTo: handleDateTo,
    setCategoryFilter: handleCategoryFilter,
    setSupplierFilter: handleSupplierFilter,
    clearFilters: handleClearFilters,
    clearError: handleClearError,
  };
};
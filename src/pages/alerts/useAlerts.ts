import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {
  fetchAlerts,
  fetchActiveAlerts,
  dismissAlert,
  resolveAlert,
  createAlert,
  checkAlerts,
  setTypeFilter,
  setPriorityFilter,
  setStatusFilter,
  setSearchFilter,
  clearFilters,
  clearError,
} from './alertsSlice';
import { CreateAlertDTO } from './alerts.types';  // ✅ استورد CreateAlertDTO بس

export const useAlerts = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    alerts,
    activeAlerts,
    dismissedAlerts,
    resolvedAlerts,
    isLoading,
    error,
    filters,
  } = useSelector((state: RootState) => state.alerts);

  // ✅ Filtered alerts based on filters
  const filteredAlerts = useMemo(() => {
    let result = [...activeAlerts];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(searchLower) ||
          a.message.toLowerCase().includes(searchLower) ||
          a.itemName?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.type) {
      result = result.filter((a) => a.type === filters.type);
    }

    if (filters.priority) {
      result = result.filter((a) => a.priority === filters.priority);
    }

    if (filters.status) {
      result = result.filter((a) => a.status === filters.status);
    }

    return result;
  }, [activeAlerts, filters]);

  // ✅ Load alerts on mount
  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  // ✅ Check alerts every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkAlerts());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const loadAlerts = useCallback(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  const loadActiveAlerts = useCallback(() => {
    dispatch(fetchActiveAlerts());
  }, [dispatch]);

  const handleDismiss = useCallback(
    async (id: string) => {
      const result = await dispatch(dismissAlert(id)).unwrap();
      dispatch(fetchActiveAlerts());
      return result;
    },
    [dispatch]
  );

  const handleResolve = useCallback(
    async (id: string) => {
      const result = await dispatch(resolveAlert(id)).unwrap();
      dispatch(fetchActiveAlerts());
      return result;
    },
    [dispatch]
  );

  const handleCreateAlert = useCallback(
    async (data: CreateAlertDTO) => {
      const result = await dispatch(createAlert(data)).unwrap();
      dispatch(fetchAlerts());
      return result;
    },
    [dispatch]
  );

  const handleTypeFilter = useCallback(
    (type: string) => {
      dispatch(setTypeFilter(type));
    },
    [dispatch]
  );

  const handlePriorityFilter = useCallback(
    (priority: string) => {
      dispatch(setPriorityFilter(priority));
    },
    [dispatch]
  );

  const handleStatusFilter = useCallback(
    (status: string) => {
      dispatch(setStatusFilter(status));
    },
    [dispatch]
  );

  const handleSearch = useCallback(
    (search: string) => {
      dispatch(setSearchFilter(search));
    },
    [dispatch]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    alerts,
    activeAlerts,
    dismissedAlerts,
    resolvedAlerts,
    filteredAlerts,
    isLoading,
    error,
    filters,
    
    // Actions
    loadAlerts,
    loadActiveAlerts,
    dismissAlert: handleDismiss,
    resolveAlert: handleResolve,
    createAlert: handleCreateAlert,
    checkAlerts: () => dispatch(checkAlerts()),
    
    // Filter Actions
    filterByType: handleTypeFilter,
    filterByPriority: handlePriorityFilter,
    filterByStatus: handleStatusFilter,
    search: handleSearch,
    clearFilters: handleClearFilters,
    clearError: handleClearError,
  };
};
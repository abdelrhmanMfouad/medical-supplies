import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../pages/auth/authSlice';
import settingsReducer from '../pages/settings/settingsSlice';
import itemsReducer from '../pages/items/itemsSlice';
import categoriesReducer from '../pages/categories/categoriesSlice';
import suppliersReducer from '../pages/suppliers/suppliersSlice';
import stockReducer from '../pages/stock/stockSlice';
import alertsReducer from '../pages/alerts/alertsSlice';
import reportsReducer from '../pages/reports/reportsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    items: itemsReducer,
    categories: categoriesReducer,
    suppliers: suppliersReducer,
    stock: stockReducer,
    alerts: alertsReducer,
    reports: reportsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
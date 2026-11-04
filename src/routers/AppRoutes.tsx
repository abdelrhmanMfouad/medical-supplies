import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../pages/auth/ProtectedRoute';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import SettingsPage from '../pages/settings/SettingPage';
import ItemsPage from '../pages/items/ItemsPage';
import CategoriesPage from '../pages/categories/CategoriesPage';
import SuppliersPage from '../pages/suppliers/SuppliersPage';
import StockPage from '../pages/stock/StockPage';
import ReportsPage from '../pages/reports/ReportsPage';
// Dashboard Page مؤقتة
const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Dashboard</h1>
        <p className="text-gray-600">Welcome to Medical Inventory System!</p>
        <p className="text-sm text-gray-400 mt-4">You are logged in successfully.</p>
      </div>
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/stock" element={<StockPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
};
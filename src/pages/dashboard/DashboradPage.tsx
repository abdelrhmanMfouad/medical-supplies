import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { useAuth } from '../auth/useAuth';
import { useRoleAccess } from '../auth/useRoleAccess';
import { fetchItems } from '../items/itemsSlice';
import { fetchCategories } from '../categories/categoriesSlice';
import { fetchSuppliers } from '../suppliers/suppliersSlice';
import { fetchTransactions } from '../stock/stockSlice';
import { fetchActiveAlerts } from '../alerts/alertsSlice';
import DashboardAlerts from '../alerts/DashboardAlerts';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, logout } = useAuth();
  const { getUserRoleName } = useRoleAccess();

  const { items } = useSelector((state: RootState) => state.items);
  const { suppliers } = useSelector((state: RootState) => state.suppliers);
  const { transactions } = useSelector((state: RootState) => state.stock);
  const { activeAlerts } = useSelector((state: RootState) => state.alerts);

  useEffect(() => {
    dispatch(fetchItems());
    dispatch(fetchCategories());
    dispatch(fetchSuppliers());
    dispatch(fetchTransactions());
    dispatch(fetchActiveAlerts());
  }, [dispatch]);

  const totalItems = items.length;
  const lowStockItems = items.filter(item => item.quantity <= item.reorderLevel && item.quantity > 0).length;
  const outOfStockItems = items.filter(item => item.quantity === 0).length;
  const totalSuppliers = suppliers.length;
  const criticalAlerts = activeAlerts.filter(a => a.priority === 'CRITICAL').length;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // ✅ Menu Items مع Reports
  const menuItems = [
    { id: 'items', title: 'Items Management', description: 'Manage inventory items', icon: '📦', path: '/items', color: 'bg-blue-500' },
    { id: 'categories', title: 'Categories', description: 'Manage product categories', icon: '🏷️', path: '/categories', color: 'bg-purple-500' },
    { id: 'suppliers', title: 'Suppliers', description: 'Manage your suppliers', icon: '🏢', path: '/suppliers', color: 'bg-green-500' },
    { id: 'stock', title: 'Stock Management', description: 'Manage inventory movements', icon: '📊', path: '/stock', color: 'bg-orange-500' },
    { id: 'alerts', title: 'Alerts', description: 'View system alerts', icon: '🔔', path: '/alerts', color: 'bg-red-500' },
    // ✅ Reports Link
    { id: 'reports', title: 'Reports & Analytics', description: 'View reports and AI predictions', icon: '📈', path: '/reports', color: 'bg-indigo-500' },
    { id: 'settings', title: 'Settings', description: 'Configure preferences', icon: '⚙️', path: '/settings', color: 'bg-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Welcome back, {user?.firstName} {user?.lastName}!
              </p>
            </div>
            <div className="flex items-center gap-4">
              {activeAlerts.length > 0 && (
                <Link
                  to="/alerts"
                  className="relative flex items-center gap-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full hover:bg-red-200"
                >
                  <span>🔔</span>
                  <span>{activeAlerts.length} alerts</span>
                  {criticalAlerts > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </Link>
              )}
              <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">
                {getUserRoleName()}
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock</p>
                <p className={`text-2xl font-bold ${lowStockItems > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                  {lowStockItems}
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Out of Stock</p>
                <p className={`text-2xl font-bold ${outOfStockItems > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {outOfStockItems}
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                <span className="text-2xl">🚫</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Suppliers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSuppliers}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <span className="text-2xl">🏢</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">🔔 Alerts</h2>
            <Link to="/alerts" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all →
            </Link>
          </div>
          <DashboardAlerts limit={3} />
        </div>

        {/* Quick Access */}
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-8 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-all hover:scale-[1.02] border-l-4 relative"
              style={{ borderColor: item.color.replace('bg-', '').replace('-500', '') }}
            >
              <div className="flex items-start gap-4">
                <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              </div>
              {item.id === 'alerts' && activeAlerts.length > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {activeAlerts.length}
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Recent Transactions */}
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-8 mb-4">Recent Transactions</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {recentTransactions.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{t.itemName}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={t.type === 'IN' ? 'text-green-600 dark:text-green-400 font-bold' : 'text-red-600 dark:text-red-400 font-bold'}>
                        {t.type === 'IN' ? '➕ IN' : '➖ OUT'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{t.quantity}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        t.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                        t.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                        'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No recent transactions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
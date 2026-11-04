import React, { useEffect } from 'react';
import { useReports } from './useReports';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import InventoryReport from './components/InventoryReport';
import StockReport from './components/StockReport';
import PredictionCard from './components/PredictionCard';
import ExportPDF from './components/ExportPDF';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';
import PieChart from '../charts/PieChart';

const ReportsPage: React.FC = () => {
  const {
    inventoryReport,
    stockReport,
    predictions,
    isLoading,
    error,
    filters,
    setDateFrom,
    setDateTo,
    clearFilters,
    clearError,
  } = useReports();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // ✅ Prepare data for charts
  const categoryData = inventoryReport?.categories.map(cat => ({
    name: cat.name,
    count: cat.count,
    value: cat.value,
  })) || [];

  const topItemsData = inventoryReport?.topItems.map(item => ({
    name: item.name,
    quantity: item.quantity,
    value: item.value,
  })) || [];

  const dailyTrendData = stockReport?.dailyTrend.map(day => ({
    date: day.date,
    'Stock IN': day.in,
    'Stock OUT': day.out,
  })) || [];

  // ✅ PDF data
  const pdfData = inventoryReport?.topItems.map(item => ({
    name: item.name,
    quantity: item.quantity,
    value: item.value.toFixed(2),
  })) || [];

  const pdfColumns = [
    { key: 'name', label: 'Item' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'value', label: 'Value ($)' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reports & Analytics</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">View inventory reports and AI predictions</p>
            </div>
            <ExportPDF
              data={pdfData}
              title="Inventory Report"
              columns={pdfColumns}
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ✅ Filters - التاريخ بس */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* ✅ Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <BarChart
                  data={topItemsData.slice(0, 8)}
                  xKey="name"
                  bars={[
                    { key: 'quantity', color: '#3b82f6', name: 'Quantity' },
                    { key: 'value', color: '#8b5cf6', name: 'Value ($)' },
                  ]}
                  title="Top Items by Quantity & Value"
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <PieChart
                  data={categoryData.map(cat => ({ name: cat.name, value: cat.count }))}
                  title="Items by Category"
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:col-span-2">
                <LineChart
                  data={dailyTrendData.slice(-15)}
                  xKey="date"
                  lines={[
                    { key: 'Stock IN', color: '#10b981', name: 'Stock IN' },
                    { key: 'Stock OUT', color: '#ef4444', name: 'Stock OUT' },
                  ]}
                  title="Daily Stock Movement Trend"
                />
              </div>
            </div>

            {/* Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InventoryReport data={inventoryReport} />
              <StockReport data={stockReport} />
              <div className="lg:col-span-2">
                <PredictionCard predictions={predictions} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
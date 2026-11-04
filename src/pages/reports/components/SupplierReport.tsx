import React from 'react';
import { InventoryReportData } from '../reports.types';

interface SupplierReportProps {
  data: InventoryReportData | null;
  suppliers: { id: string; name: string; itemCount: number }[];
}

const SupplierReport: React.FC<SupplierReportProps> = ({ data, suppliers }) => {
  if (!data || suppliers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No supplier data available</p>
      </div>
    );
  }

  // ✅ Calculate supplier stats
  const totalSuppliers = suppliers.length;
  const totalItems = suppliers.reduce((sum, s) => sum + s.itemCount, 0);
  const avgItemsPerSupplier = totalSuppliers > 0 ? Math.round(totalItems / totalSuppliers) : 0;

  // ✅ Find top supplier
  const topSupplier = suppliers.length > 0 
    ? suppliers.reduce((a, b) => a.itemCount > b.itemCount ? a : b) 
    : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        🏢 Supplier Report
      </h3>

      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Suppliers</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalSuppliers}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalItems}
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg Items/Supplier</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {avgItemsPerSupplier}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Top Supplier</p>
          <p className="text-lg font-bold text-purple-600 dark:text-purple-400 truncate">
            {topSupplier ? topSupplier.name : 'N/A'}
          </p>
        </div>
      </div>

      {/* ✅ Supplier Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Supplier
              </th>
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Items
              </th>
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                % of Total
              </th>
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers
              .sort((a, b) => b.itemCount - a.itemCount)
              .map((supplier, index) => {
                const percentage = totalItems > 0 
                  ? Math.round((supplier.itemCount / totalItems) * 100) 
                  : 0;
                return (
                  <tr 
                    key={supplier.id} 
                    className={`border-b border-gray-100 dark:border-gray-700/50 ${
                      index % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-700/20' : ''
                    }`}
                  >
                    <td className="py-2 px-3 text-sm text-gray-800 dark:text-white">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ 
                            backgroundColor: [
                              '#10b981', '#3b82f6', '#8b5cf6', 
                              '#f59e0b', '#ef4444', '#ec4899'
                            ][index % 6] 
                          }}
                        />
                        {supplier.name}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-600 dark:text-gray-300">
                      {supplier.itemCount}
                    </td>
                    <td className="py-2 px-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          {percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-sm">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        supplier.itemCount > 10 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : supplier.itemCount > 0
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {supplier.itemCount > 10 ? 'Active' : supplier.itemCount > 0 ? 'Low' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* ✅ Empty state for suppliers with no items */}
      {suppliers.some(s => s.itemCount === 0) && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            ⚠️ Some suppliers have no items. Consider adding items to these suppliers.
          </p>
        </div>
      )}
    </div>
  );
};

export default SupplierReport;
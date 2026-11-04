import React from 'react';
import { InventoryReportData } from '../reports.types';

interface CategoryReportProps {
  data: InventoryReportData | null;
}

const CategoryReport: React.FC<CategoryReportProps> = ({ data }) => {
  if (!data || data.categories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No category data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        📂 Category Report
      </h3>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {data.categories.length}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {data.categories.reduce((sum, c) => sum + c.count, 0)}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${data.categories.reduce((sum, c) => sum + c.value, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg/Category</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {Math.round(data.categories.reduce((sum, c) => sum + c.count, 0) / data.categories.length)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Category</th>
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Items</th>
              <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.categories.map((cat) => (
              <tr key={cat.name} className="border-b border-gray-100 dark:border-gray-700/50">
                <td className="py-2 px-3 text-sm text-gray-800 dark:text-white">{cat.name}</td>
                <td className="py-2 px-3 text-sm text-gray-600 dark:text-gray-300">{cat.count}</td>
                <td className="py-2 px-3 text-sm text-gray-600 dark:text-gray-300">
                  ${cat.value.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryReport;
import React from 'react';
import { InventoryReportData } from '../reports.types';

interface InventoryReportProps {
  data: InventoryReportData | null;
}

const InventoryReport: React.FC<InventoryReportProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No inventory data available</p>
      </div>
    );
  }

  const stats = [
    { label: 'Total Items', value: data.totalItems, color: 'blue' },
    { label: 'Total Value', value: `$${data.totalValue.toFixed(2)}`, color: 'green' },
    { label: 'Low Stock', value: data.lowStockItems, color: 'yellow' },
    { label: 'Out of Stock', value: data.outOfStockItems, color: 'red' },
    { label: 'Expiring Soon', value: data.expiringItems, color: 'orange' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        📊 Inventory Report
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className={`text-xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Top Items</h4>
      <div className="space-y-2">
        {data.topItems.slice(0, 5).map((item) => (
          <div key={item.id} className="flex justify-between items-center p-2 border border-gray-100 dark:border-gray-700 rounded">
            <span className="text-gray-800 dark:text-white">{item.name}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {item.quantity} units · ${item.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryReport;
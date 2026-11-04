import React from 'react';
import { StockReportData } from '../reports.types';

interface StockReportProps {
  data: StockReportData | null;
}

const StockReport: React.FC<StockReportProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No stock data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        📈 Stock Movement Report
      </h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Stock IN</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">{data.totalIn}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Stock OUT</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">{data.totalOut}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Net Movement</p>
          <p className={`text-xl font-bold ${data.netMovement >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
            {data.netMovement}
          </p>
        </div>
      </div>

      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Transactions</h4>
      
      {/* ✅ Table مع تنسيق محسن */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Item
              </th>
              <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                SKU
              </th>
              <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {data.transactions && data.transactions.length > 0 ? (
              data.transactions.map((t: any) => (
                <tr key={t.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-2 px-3 text-sm text-gray-800 dark:text-white">
                    {t.itemName || 'Unknown'}
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
                    {t.sku || 'N/A'}
                  </td>
                  <td className={`py-2 px-3 text-sm font-bold text-right ${t.type === 'IN' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {t.type === 'IN' ? '+' : '-'}{t.quantity}
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400 text-right">
                    {new Date(t.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-400 dark:text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockReport;
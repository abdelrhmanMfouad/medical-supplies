import React, { useState, useEffect } from 'react';
import { useStock } from './useStock';
import StockInForm from './StockInForm';
import StockOutForm from './StockOutForm';
import StockHistoryTable from './StockHistoryTable';
import StockTransactionModal from './StockTransactionModal';
import { StockTransaction, StockInDTO, StockOutDTO } from './stock.types';

type TabType = 'in' | 'out' | 'history';

const StockPage: React.FC = () => {
  const {
    transactions,
    isLoading,
    error,
    successMessage,
    pagination,
    filters,
    items,
    stockIn,
    stockOut,
    search,
    filterByType,
    filterByStatus,
    filterByDateFrom,
    filterByDateTo,
    clearFilters,
    changePage,
    clearError,
    clearSuccess,
  } = useStock();

  const [activeTab, setActiveTab] = useState<TabType>('in');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedTransactionForView, setSelectedTransactionForView] = useState<StockTransaction | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => clearSuccess(), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccess]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleView = (transaction: StockTransaction): void => {
    setSelectedTransactionForView(transaction);
    setShowDetailsModal(true);
  };

  const handleStockInSubmit = async (data: StockInDTO): Promise<void> => {
    try {
      await stockIn(data);
      setShowForm(false);
    } catch (error) {
      console.error('❌ Stock IN error:', error);
    }
  };

  const handleStockOutSubmit = async (data: StockOutDTO): Promise<void> => {
    try {
      await stockOut(data);
      setShowForm(false);
    } catch (error) {
      console.error('❌ Stock OUT error:', error);
    }
  };

  const handleTabChange = (tab: TabType): void => {
    setActiveTab(tab);
    setShowForm(false);
  };

  const handleCloseForm = (): void => {
    setShowForm(false);
  };

  const handleOpenForm = (): void => {
    setShowForm(true);
  };

  const handleCloseDetails = (): void => {
    setShowDetailsModal(false);
    setSelectedTransactionForView(null);
  };

  const statusOptions: string[] = ['PENDING', 'COMPLETED', 'CANCELLED'];
  const typeOptions: string[] = ['IN', 'OUT'];

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'in', label: 'Stock IN', icon: '📥' },
    { id: 'out', label: 'Stock OUT', icon: '📤' },
    { id: 'history', label: 'History', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Stock Management</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage inventory movements</p>
            </div>
            {/* ✅ Button only for IN/OUT tabs, not for History */}
            {activeTab !== 'history' && (
              <button
                onClick={handleOpenForm}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {activeTab === 'in' ? 'Add Stock IN' : 'Add Stock OUT'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center justify-between">
            <p className="text-green-700 dark:text-green-300">{successMessage}</p>
            <button onClick={clearSuccess} className="text-green-500 hover:text-green-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center justify-between">
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button onClick={clearError} className="text-red-500 hover:text-red-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Stock IN Form */}
        {activeTab === 'in' && showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Add Stock IN</h3>
            <StockInForm
              items={items}
              onSubmit={handleStockInSubmit}
              isLoading={isLoading}
              onCancel={handleCloseForm}
            />
          </div>
        )}

        {/* Stock OUT Form */}
        {activeTab === 'out' && showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Withdraw Stock OUT</h3>
            <StockOutForm
              items={items}
              onSubmit={handleStockOutSubmit}
              isLoading={isLoading}
              onCancel={handleCloseForm}
            />
          </div>
        )}

        {/* Filters - Show only on History tab */}
        {activeTab === 'history' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Search by item or SKU..."
                  value={filters.search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => search(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <select
                  value={filters.type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => filterByType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Types</option>
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={filters.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => filterByStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Status</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => filterByDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Date From"
                />
              </div>
              <div>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => filterByDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Date To"
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* History Table - Show only on History tab */}
        {activeTab === 'history' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <StockHistoryTable
              transactions={transactions}
              isLoading={isLoading}
              onView={handleView}
            />

            {pagination.totalPages > 1 && (
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {transactions.length} of {pagination.totalItems} transactions
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => changePage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => changePage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state for IN/OUT tabs when form is not shown */}
        {activeTab !== 'history' && !showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">
              {activeTab === 'in' ? '📥' : '📤'}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {activeTab === 'in' ? 'Add Stock IN' : 'Withdraw Stock OUT'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {activeTab === 'in' 
                ? 'Click the button above to add new stock to your inventory.' 
                : 'Click the button above to withdraw stock from your inventory.'}
            </p>
            <button
              onClick={handleOpenForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {activeTab === 'in' ? 'Add Stock IN' : 'Withdraw Stock OUT'}
            </button>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      <StockTransactionModal
        transaction={selectedTransactionForView}
        isOpen={showDetailsModal}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default StockPage;
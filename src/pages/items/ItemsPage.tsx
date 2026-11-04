import React, { useState, useEffect } from 'react';
import { useItems } from './useItems';
import ItemsTable from './ItemsTable';
import AddItemForm from './AddItemForm';
import EditItemModal from './EditItemModal';
import DeleteItemModal from './DeleteItemModal';
import ItemDetailsModal from './ItemDetailsModal';
import { Item, CreateItemDTO, UpdateItemDTO } from './items.types';

const ItemsPage: React.FC = () => {
  const {
    items,
    selectedItem,
    isLoading,
    error,
    successMessage,
    pagination,
    filters,
    categories,
    suppliers,
    createItem,
    updateItem,
    deleteItem,
    search,
    filterByCategory,
    filterByStatus,
    clearFilters,
    changePage,
    selectItem,
    loadItems,
    clearError,
    clearSuccess,
  } = useItems();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedItemForAction, setSelectedItemForAction] = useState<Item | null>(null);

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

  const handleView = (item: Item): void => {
    setSelectedItemForAction(item);
    setShowDetailsModal(true);
  };

  const handleEdit = (item: Item): void => {
    setSelectedItemForAction(item);
    selectItem(item);
    setShowEditModal(true);
  };

  const handleDelete = (item: Item): void => {
    setSelectedItemForAction(item);
    setShowDeleteModal(true);
  };

  const handleCreate = async (data: CreateItemDTO): Promise<void> => {
    try {
      console.log('📦 Creating item with data:', data);
      await createItem(data);
      setShowAddModal(false);
      await loadItems();
    } catch (err) {
      console.error('❌ Error creating item:', err);
    }
  };

  const handleUpdate = async (data: UpdateItemDTO): Promise<void> => {
    try {
      console.log('📝 Updating item with data:', data);
      await updateItem(data);
      setShowEditModal(false);
      selectItem(null);
      await loadItems();
    } catch (err) {
      console.error('❌ Error updating item:', err);
    }
  };

  const handleDeleteConfirm = async (id: string): Promise<void> => {
    try {
      console.log('🗑️ Deleting item with ID:', id);
      await deleteItem(id);
      setShowDeleteModal(false);
      setSelectedItemForAction(null);
      await loadItems();
    } catch (err) {
      console.error('❌ Error deleting item:', err);
    }
  };

  const handleCloseAddModal = (): void => {
    setShowAddModal(false);
  };

  const handleCloseEditModal = (): void => {
    setShowEditModal(false);
    selectItem(null);
  };

  const handleCloseDeleteModal = (): void => {
    setShowDeleteModal(false);
    setSelectedItemForAction(null);
  };

  const handleCloseDetailsModal = (): void => {
    setShowDetailsModal(false);
    setSelectedItemForAction(null);
  };

  const statusOptions: string[] = ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'EXPIRING_SOON'];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Items Management</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your medical inventory items</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>
          </div>
        </div>
      </div>

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

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={filters.search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => search(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <select
                value={filters.category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => filterByCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                  <option key={status} value={status}>{status.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <ItemsTable
            items={items}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {pagination.totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {items.length} of {pagination.totalItems} items
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
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseAddModal} />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl z-10">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Item</h3>
                <button onClick={handleCloseAddModal} className="text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <AddItemForm
                  categories={categories}
                  suppliers={suppliers}
                  onSubmit={handleCreate}
                  isLoading={isLoading}
                  onCancel={handleCloseAddModal}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <EditItemModal
        item={selectedItem}
        isOpen={showEditModal}
        categories={categories}
        suppliers={suppliers}
        onUpdate={handleUpdate}
        isLoading={isLoading}
        onClose={handleCloseEditModal}
      />

      <DeleteItemModal
        item={selectedItemForAction}
        isOpen={showDeleteModal}
        onDelete={handleDeleteConfirm}
        isLoading={isLoading}
        onClose={handleCloseDeleteModal}
      />

      <ItemDetailsModal
        item={selectedItemForAction}
        isOpen={showDetailsModal}
        onClose={handleCloseDetailsModal}
      />
    </div>
  );
};

export default ItemsPage;
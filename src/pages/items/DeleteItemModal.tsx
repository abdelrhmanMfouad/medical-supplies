import React from 'react';
import { Item } from './items.types';

interface DeleteItemModalProps {
  item: Item | null;
  isOpen: boolean;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
  onClose: () => void;
}

const DeleteItemModal: React.FC<DeleteItemModalProps> = ({
  item,
  isOpen,
  onDelete,
  isLoading,
  onClose,
}) => {
  const handleDelete = async () => {
    if (item) {
      console.log('🗑️ Delete confirmed for item ID:', item.id);
      await onDelete(item.id);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md z-10">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
              Delete Item
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete <strong className="text-gray-900">{item.name}</strong>?
              <br />
              This action cannot be undone.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500">SKU:</span>
                <span className="text-gray-900">{item.sku}</span>
                <span className="text-gray-500">Quantity:</span>
                <span className="text-gray-900">{item.quantity} {item.unit}</span>
                <span className="text-gray-500">Location:</span>
                <span className="text-gray-900">{item.location}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete Item'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteItemModal;
import React, { useState } from 'react';
import { StockOutDTO } from './stock.types';
import { validateStockOut, type StockOutErrors } from './stockValidation';

interface StockOutFormProps {
  items: { id: string; name: string; sku: string; quantity: number; unit: string }[];
  onSubmit: (data: StockOutDTO) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const StockOutForm: React.FC<StockOutFormProps> = ({
  items,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [formData, setFormData] = useState<StockOutDTO>({
    itemId: '',
    quantity: 0,
    reference: '',
    notes: '',
  });
  const [errors, setErrors] = useState<StockOutErrors>({});
  const selectedItem = items.find((i) => i.id === formData.itemId) ?? null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const name = e.target.name as keyof StockOutDTO;
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseFloat(value) || 0 : value
    }));
    if (errors[name as keyof StockOutErrors]) {
      setErrors(prev => ({ ...prev, [name as keyof StockOutErrors]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateStockOut({
      ...formData,
      currentQuantity: selectedItem?.quantity || 0,
    });
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Select Item *
        </label>
        <select
          name="itemId"
          value={formData.itemId}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-red-500 ${
            errors.itemId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
        >
          <option value="">Select an item...</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.sku}) - Available: {item.quantity} {item.unit}
            </option>
          ))}
        </select>
        {errors.itemId && <p className="mt-1 text-xs text-red-600">{errors.itemId}</p>}
      </div>

      {selectedItem && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-3 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">
            ⚠️ Withdrawing from: <strong>{selectedItem.name}</strong>
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            Available: {selectedItem.quantity} {selectedItem.unit}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Quantity to Withdraw *
        </label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-red-500 ${
            errors.quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
        />
        {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
        {selectedItem && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Unit: {selectedItem.unit}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Reference (Optional)
        </label>
        <input
          type="text"
          name="reference"
          value={formData.reference}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="e.g., RX-12345"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Any additional notes..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Withdraw Stock'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default StockOutForm;
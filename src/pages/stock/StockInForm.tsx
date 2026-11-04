import React, { useState } from 'react';
import { StockInDTO } from './stock.types';
import { validateStockIn, StockInErrors } from './stockValidation';

interface StockInFormProps {
  items: { id: string; name: string; sku: string; quantity: number; unit: string }[];
  onSubmit: (data: StockInDTO) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const StockInForm: React.FC<StockInFormProps> = ({
  items,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [formData, setFormData] = useState<StockInDTO>({
    itemId: '',
    quantity: 0,
    unitPrice: 0,
    reference: '',
    notes: '',
  });
  const [errors, setErrors] = useState<StockInErrors>({});

  const selectedItem = formData.itemId 
    ? items.find(i => i.id === formData.itemId) ? { name: items.find(i => i.id === formData.itemId)!.name, unit: items.find(i => i.id === formData.itemId)!.unit } : null
    : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' ? parseFloat(value) || 0 : value
    }));
    if (errors[name as keyof StockInErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📤 StockInForm submitting:', formData);

    const validationErrors = validateStockIn(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        await onSubmit(formData);
        console.log('✅ StockInForm submitted successfully');
      } catch (error) {
        console.error('❌ StockInForm submit error:', error);
      }
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
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
            errors.itemId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
        >
          <option value="">Select an item...</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.sku}) - Current: {item.quantity} {item.unit}
            </option>
          ))}
        </select>
        {errors.itemId && <p className="mt-1 text-xs text-red-600">{errors.itemId}</p>}
      </div>

      {selectedItem && (
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Adding stock for: <strong>{selectedItem.name}</strong>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantity *
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
              errors.quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          />
          {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Unit Price *
          </label>
          <input
            type="number"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
              errors.unitPrice ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          />
          {errors.unitPrice && <p className="mt-1 text-xs text-red-600">{errors.unitPrice}</p>}
        </div>
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
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="e.g., PO-12345"
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
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Any additional notes..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Add Stock IN'}
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

export default StockInForm;
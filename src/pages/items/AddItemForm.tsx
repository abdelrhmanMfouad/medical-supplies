import React, { useState } from 'react';
import { Category, Supplier, CreateItemDTO } from './items.types';
import { validateItem, ItemErrors } from './itemsValidation';

interface AddItemFormProps {
  categories: Category[];
  suppliers: Supplier[];
  onSubmit: (data: CreateItemDTO) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({
  categories,
  suppliers,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateItemDTO>({
    name: '',
    sku: '',
    categoryId: '',
    quantity: 0,
    unit: 'pcs',
    unitPrice: 0,
    reorderLevel: 0,
    location: '',
    supplierId: '',
    expiryDate: '',
    description: '',
  });

  const [errors, setErrors] = useState<ItemErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' || name === 'reorderLevel' 
        ? parseFloat(value) || 0 
        : value
    }));
    
    if (errors[name as keyof ItemErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📦 Form Data before submit:', formData);

    const validationErrors = validateItem(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      // إرسال الداتا كما هي (categoryId و supplierId يجب أن تكون ObjectId strings)
      await onSubmit(formData);
    }
  };

  const units = ['pcs', 'boxes', 'bottles', 'packs', 'vials', 'tablets', 'capsules'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter item name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
              errors.sku ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., MED-001"
          />
          {errors.sku && <p className="mt-1 text-xs text-red-600">{errors.sku}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
              errors.categoryId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Supplier *</label>
          <select
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
              errors.supplierId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Supplier</option>
            {suppliers.map((sup) => (
              <option key={sup.id} value={sup.id}>
                {sup.name}
              </option>
            ))}
          </select>
          {errors.supplierId && <p className="mt-1 text-xs text-red-600">{errors.supplierId}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
              errors.quantity ? 'border-red-500' : 'border-gray-300'
            }`}
            min="0"
          />
          {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
              errors.unit ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>{unit.toUpperCase()}</option>
            ))}
          </select>
          {errors.unit && <p className="mt-1 text-xs text-red-600">{errors.unit}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price *</label>
          <input
            type="number"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
              errors.unitPrice ? 'border-red-500' : 'border-gray-300'
            }`}
            min="0"
            step="0.01"
          />
          {errors.unitPrice && <p className="mt-1 text-xs text-red-600">{errors.unitPrice}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level *</label>
          <input
            type="number"
            name="reorderLevel"
            value={formData.reorderLevel}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
              errors.reorderLevel ? 'border-red-500' : 'border-gray-300'
            }`}
            min="0"
          />
          {errors.reorderLevel && <p className="mt-1 text-xs text-red-600">{errors.reorderLevel}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Aisle A-1"
          />
          {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 ${
            errors.expiryDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.expiryDate && <p className="mt-1 text-xs text-red-600">{errors.expiryDate}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          placeholder="Enter item description..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Item'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddItemForm;
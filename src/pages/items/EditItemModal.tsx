import React, { useState } from 'react';
import { Item, Category, Supplier, UpdateItemDTO } from './items.types';
import { validateItem, ItemErrors } from './itemsValidation';

interface EditItemModalProps {
  item: Item | null;
  isOpen: boolean;
  categories: Category[];
  suppliers: Supplier[];
  onUpdate: (data: UpdateItemDTO) => Promise<void>;
  isLoading: boolean;
  onClose: () => void;
}

// ✅ دالة لتنسيق التاريخ
const formatDateForInput = (date: string | undefined): string => {
  if (!date) return '';
  return date.split('T')[0];
};

const defaultFormData: UpdateItemDTO = {
  id: '',
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
};

const EditItemModal: React.FC<EditItemModalProps> = ({
  item,
  isOpen,
  categories,
  suppliers,
  onUpdate,
  isLoading,
  onClose,
}) => {
  const [formData, setFormData] = useState<UpdateItemDTO>(defaultFormData);
  const [errors, setErrors] = useState<ItemErrors>({});

  const itemFormData: UpdateItemDTO = item
    ? {
        id: item.id,
        name: item.name,
        sku: item.sku,
        categoryId: item.categoryId,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        reorderLevel: item.reorderLevel,
        location: item.location,
        supplierId: item.supplierId,
        expiryDate: formatDateForInput(item.expiryDate),
        description: item.description || '',
      }
    : defaultFormData;

  const currentFormData = item && formData.id !== item.id ? itemFormData : formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const convertedValue =
      name === 'quantity' || name === 'unitPrice' || name === 'reorderLevel'
        ? parseFloat(value) || 0
        : value;

    setFormData(prev => {
      const base = item && prev.id !== item.id ? itemFormData : prev;
      return {
        ...base,
        [name]: convertedValue,
      };
    });

    if (errors[name as keyof ItemErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationPayload = {
      name: currentFormData.name ?? '',
      sku: currentFormData.sku ?? '',
      categoryId: currentFormData.categoryId ?? '',
      quantity: currentFormData.quantity ?? 0,
      unit: currentFormData.unit ?? '',
      unitPrice: currentFormData.unitPrice ?? 0,
      reorderLevel: currentFormData.reorderLevel ?? 0,
      location: currentFormData.location ?? '',
      supplierId: currentFormData.supplierId ?? '',
      expiryDate: currentFormData.expiryDate,
    };

    const validationErrors = validateItem(validationPayload);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0 && currentFormData.id) {
      await onUpdate(currentFormData);
    }
  };

  if (!isOpen || !item) return null;

  const units = ['pcs', 'boxes', 'bottles', 'packs', 'vials', 'tablets', 'capsules'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl z-10">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Edit Item</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
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
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                      <option key={sup.id} value={sup.id}>{sup.name}</option>
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
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Item'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;
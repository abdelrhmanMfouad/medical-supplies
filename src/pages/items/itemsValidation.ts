export interface ItemErrors {
  name?: string;
  sku?: string;
  categoryId?: string;
  quantity?: string;
  unit?: string;
  unitPrice?: string;
  reorderLevel?: string;
  location?: string;
  supplierId?: string;
  expiryDate?: string;
}

// ✅ دالة للـ Create (كل الحقول مطلوبة)
export const validateItem = (data: {
  name: string;
  sku: string;
  categoryId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  reorderLevel: number;
  location: string;
  supplierId: string;
  expiryDate?: string;
}): ItemErrors => {
  const errors: ItemErrors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Item name must be at least 2 characters';
  }

  if (!data.sku || data.sku.trim().length < 3) {
    errors.sku = 'SKU must be at least 3 characters';
  }

  if (!data.categoryId) {
    errors.categoryId = 'Please select a category';
  }

  if (data.quantity === undefined || data.quantity < 0) {
    errors.quantity = 'Quantity cannot be negative';
  }

  if (!data.unit) {
    errors.unit = 'Please select a unit';
  }

  if (data.unitPrice === undefined || data.unitPrice < 0) {
    errors.unitPrice = 'Unit price cannot be negative';
  }

  if (data.reorderLevel === undefined || data.reorderLevel < 0) {
    errors.reorderLevel = 'Reorder level cannot be negative';
  }

  if (!data.location) {
    errors.location = 'Please specify a location';
  }

  if (!data.supplierId) {
    errors.supplierId = 'Please select a supplier';
  }

  if (data.expiryDate && new Date(data.expiryDate) < new Date()) {
    errors.expiryDate = 'Expiry date cannot be in the past';
  }

  return errors;
};

// ✅ دالة للـ Update (الحقول optional)
export const validateUpdateItem = (data: {
  name?: string;
  sku?: string;
  categoryId?: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  reorderLevel?: number;
  location?: string;
  supplierId?: string;
  expiryDate?: string;
}): ItemErrors => {
  const errors: ItemErrors = {};

  if (data.name !== undefined && data.name.trim().length < 2) {
    errors.name = 'Item name must be at least 2 characters';
  }

  if (data.sku !== undefined && data.sku.trim().length < 3) {
    errors.sku = 'SKU must be at least 3 characters';
  }

  if (data.categoryId !== undefined && !data.categoryId) {
    errors.categoryId = 'Please select a category';
  }

  if (data.quantity !== undefined && data.quantity < 0) {
    errors.quantity = 'Quantity cannot be negative';
  }

  if (data.unit !== undefined && !data.unit) {
    errors.unit = 'Please select a unit';
  }

  if (data.unitPrice !== undefined && data.unitPrice < 0) {
    errors.unitPrice = 'Unit price cannot be negative';
  }

  if (data.reorderLevel !== undefined && data.reorderLevel < 0) {
    errors.reorderLevel = 'Reorder level cannot be negative';
  }

  if (data.location !== undefined && !data.location) {
    errors.location = 'Please specify a location';
  }

  if (data.supplierId !== undefined && !data.supplierId) {
    errors.supplierId = 'Please select a supplier';
  }

  if (data.expiryDate && new Date(data.expiryDate) < new Date()) {
    errors.expiryDate = 'Expiry date cannot be in the past';
  }

  return errors;
};

export const getStockStatus = (quantity: number, reorderLevel: number): string => {
  if (quantity === 0) return 'OUT_OF_STOCK';
  if (quantity <= reorderLevel) return 'LOW_STOCK';
  return 'IN_STOCK';
};

export const getStockStatusColor = (status: string): string => {
  switch (status) {
    case 'IN_STOCK':
      return 'bg-green-100 text-green-800';
    case 'LOW_STOCK':
      return 'bg-yellow-100 text-yellow-800';
    case 'OUT_OF_STOCK':
      return 'bg-red-100 text-red-800';
    case 'EXPIRING_SOON':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStockStatusText = (status: string): string => {
  switch (status) {
    case 'IN_STOCK':
      return 'In Stock';
    case 'LOW_STOCK':
      return 'Low Stock';
    case 'OUT_OF_STOCK':
      return 'Out of Stock';
    case 'EXPIRING_SOON':
      return 'Expiring Soon';
    default:
      return status;
  }
};
export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRING_SOON';

export interface Item {
  id: string;
  name: string;
  sku: string;
  category: string;
  categoryId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  reorderLevel: number;
  location: string;
  expiryDate?: string;
  supplier: string;
  supplierId: string;
  status: StockStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemDTO {
  name: string;
  sku: string;
  categoryId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  reorderLevel: number;
  location: string;
  expiryDate?: string;
  supplierId: string;
  description?: string;
}

export interface UpdateItemDTO {
  id: string;          // ✅ id مطلوب
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
  description?: string;
}

export interface ItemsState {
  items: Item[];
  selectedItem: Item | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: {
    search: string;
    category: string;
    status: string;
  };
   categories: Category[];
  suppliers: Supplier[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Supplier {
  id: string;
  name: string;
}
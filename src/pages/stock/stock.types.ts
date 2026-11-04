export type TransactionType = 'IN' | 'OUT';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface StockTransaction {
  id: string;
  itemId: string;
  itemName: string;
  sku: string;
  type: TransactionType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  reference?: string;
  notes?: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
}

export interface StockInDTO {
  itemId: string;
  quantity: number;
  unitPrice: number;
  reference?: string;
  notes?: string;
}

export interface StockOutDTO {
  itemId: string;
  quantity: number;
  reference?: string;
  notes?: string;
}

export interface StockItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
}

export interface StockState {
  transactions: StockTransaction[];
  selectedTransaction: StockTransaction | null;
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
    type: string;
    status: string;
    dateFrom: string;
    dateTo: string;
  };
  items: StockItem[];
}
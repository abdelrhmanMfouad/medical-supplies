export interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  categoryId: string;
  supplierId: string;
}

export interface InventoryReportData {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringItems: number;
  categories: {
    name: string;
    count: number;
    value: number;
  }[];
  topItems: {
    id: string;
    name: string;
    quantity: number;
    value: number;
  }[];
}

export interface StockReportData {
  totalIn: number;
  totalOut: number;
  netMovement: number;
  transactions: {
    id: string;
    itemName: string;    // ✅ أضف
    sku?: string;        // ✅ أضف
    type: 'IN' | 'OUT';
    quantity: number;
    date: string;
  }[];
  dailyTrend: {
    date: string;
    in: number;
    out: number;
  }[];
}

export interface PredictionData {
  itemId: string;
  itemName: string;
  currentStock: number;
  predictedUsage: number;
  daysUntilOut: number;
  recommendation: 'ORDER' | 'OK' | 'REDUCE';
  confidence: number;
}

export interface ReportsState {
  inventoryReport: InventoryReportData | null;
  stockReport: StockReportData | null;
  predictions: PredictionData[];
  isLoading: boolean;
  error: string | null;
  filters: ReportFilters;
}
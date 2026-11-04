import { 
  ReportFilters, 
  InventoryReportData, 
  StockReportData, 
  PredictionData 
} from './reports.types';
import { itemsService } from '../items/itemsService';
import { stockService } from '../stock/stockService';
import { categoriesService } from '../categories/categoriesService';

export const reportsService = {
  // ✅ Inventory Report
  getInventoryReport: async (filters: ReportFilters): Promise<InventoryReportData> => {
    const allItems = await itemsService.getItems();
    const categories = await categoriesService.getCategories();

    // ✅ تطبيق الفلاتر (category / supplier)
    const items = allItems.filter(item => {
      if (filters.categoryId && item.categoryId !== filters.categoryId) return false;
      if (filters.supplierId && item.supplierId !== filters.supplierId) return false;
      return true;
    });

    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const lowStockItems = items.filter(item => item.quantity <= item.reorderLevel && item.quantity > 0).length;
    const outOfStockItems = items.filter(item => item.quantity === 0).length;
    const expiringItems = items.filter(item => {
      if (!item.expiryDate) return false;
      const days = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days <= 30 && days > 0;
    }).length;

    const categoryData = categories.map(cat => {
      const catItems = items.filter(i => i.categoryId === cat.id);
      return {
        name: cat.name,
        count: catItems.length,
        value: catItems.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0),
      };
    });

    const topItems = [...items]
      .sort((a, b) => (b.quantity * b.unitPrice) - (a.quantity * a.unitPrice))
      .slice(0, 10)
      .map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        value: item.quantity * item.unitPrice,
      }));

    return {
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems,
      expiringItems,
      categories: categoryData,
      topItems,
    };
  },

  // ✅ Stock Report
  getStockReport: async (filters: ReportFilters): Promise<StockReportData> => {
    const transactions = await stockService.getTransactions();
    
    const filtered = transactions.filter(t => {
      const date = new Date(t.createdAt);
      const from = filters.dateFrom ? new Date(filters.dateFrom) : new Date(0);
      const to = filters.dateTo ? new Date(filters.dateTo) : new Date();
      return date >= from && date <= to;
    });

    const totalIn = filtered.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.quantity, 0);
    const totalOut = filtered.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.quantity, 0);

    const dailyTrend: { date: string; in: number; out: number }[] = [];
    const days = 30;
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayTransactions = filtered.filter(t => t.createdAt.startsWith(dateStr));
      dailyTrend.push({
        date: dateStr,
        in: dayTransactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.quantity, 0),
        out: dayTransactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.quantity, 0),
      });
    }

    return {
      totalIn,
      totalOut,
      netMovement: totalIn - totalOut,
      transactions: filtered.slice(0, 50).map(t => ({
        id: t.id,
        itemName: t.itemName,
        type: t.type,
        quantity: t.quantity,
        date: t.createdAt,
      })),
      dailyTrend,
    };
  },

  // ✅ Predictions
  getPredictions: async (): Promise<PredictionData[]> => {
    const items = await itemsService.getItems();
    const transactions = await stockService.getTransactions();

    return items.map(item => {
      const itemTransactions = transactions.filter(t => t.itemId === item.id);
      
      // حساب متوسط الاستخدام اليومي
      const dailyUsage = itemTransactions
        .filter(t => t.type === 'OUT')
        .reduce((sum, t) => sum + t.quantity, 0) / 30;

      const predictedUsage = dailyUsage * 30; // التوقع للشهر القادم
      const daysUntilOut = dailyUsage > 0 ? Math.floor(item.quantity / dailyUsage) : 999;

      let recommendation: 'ORDER' | 'OK' | 'REDUCE' = 'OK';
      if (daysUntilOut < 30) recommendation = 'ORDER';
      else if (daysUntilOut > 180) recommendation = 'REDUCE';

      return {
        itemId: item.id,
        itemName: item.name,
        currentStock: item.quantity,
        predictedUsage,
        daysUntilOut,
        recommendation,
        confidence: Math.min(0.95, 0.7 + (itemTransactions.length / 100) * 0.25),
      };
    });
  },
};
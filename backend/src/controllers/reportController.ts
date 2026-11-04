import { Request, Response } from 'express';
import Item from '../models/Item';
import Stock from '../models/Stock';
import Category from '../models/Category';

// @desc    Get inventory report
// @route   GET /api/reports/inventory
// @access  Private
export const getInventoryReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await Item.find();
    const categories = await Category.find();

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
      const catItems = items.filter(i => i.categoryId.toString() === cat._id.toString());
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
        id: item._id,
        name: item.name,
        quantity: item.quantity,
        value: item.quantity * item.unitPrice,
      }));

    res.json({
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems,
      expiringItems,
      categories: categoryData,
      topItems,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @desc    Get stock report
// @route   GET /api/reports/stock
// @access  Private
export const getStockReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dateFrom, dateTo } = req.query;
    const filter: any = {};

    if (dateFrom) {
      filter.createdAt = { $gte: new Date(dateFrom as string) };
    }
    if (dateTo) {
      filter.createdAt = { ...filter.createdAt, $lte: new Date(dateTo as string) };
    }

    const transactions = await Stock.find(filter)
      .populate('itemId', 'name sku')
      .sort({ createdAt: -1 });

    const totalIn = transactions
      .filter(t => t.type === 'IN')
      .reduce((sum, t) => sum + t.quantity, 0);

    const totalOut = transactions
      .filter(t => t.type === 'OUT')
      .reduce((sum, t) => sum + t.quantity, 0);

    // ✅ ✅ ✅ Daily trend - حسب الفلتر
    let startDate: Date;
    let endDate: Date = new Date();

    if (dateFrom) {
      startDate = new Date(dateFrom as string);
    } else {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
    }

    if (dateTo) {
      endDate = new Date(dateTo as string);
    }

    const dailyTrend: { date: string; in: number; out: number }[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayTransactions = transactions.filter(t => 
        t.createdAt.toISOString().startsWith(dateStr)
      );
      
      dailyTrend.push({
        date: dateStr,
        in: dayTransactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.quantity, 0),
        out: dayTransactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.quantity, 0),
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // ✅ Recent transactions
    const recentTransactions = transactions.slice(0, 8).map(t => ({
      id: t._id,
      itemName: (t.itemId as any)?.name || 'Unknown Item',
      sku: (t.itemId as any)?.sku || 'N/A',
      type: t.type,
      quantity: t.quantity,
      date: t.createdAt,
    }));

    res.json({
      totalIn,
      totalOut,
      netMovement: totalIn - totalOut,
      transactions: recentTransactions,
      dailyTrend,
    });
  } catch (error) {
    console.error('Stock report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc    Get predictions
// @route   GET /api/reports/predictions
// @access  Private
export const getPredictions = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await Item.find();
    const transactions = await Stock.find();

    const predictions = items.map(item => {
      const itemTransactions = transactions.filter(t => t.itemId.toString() === item._id.toString());
      
      const dailyUsage = itemTransactions
        .filter(t => t.type === 'OUT')
        .reduce((sum, t) => sum + t.quantity, 0) / 30;

      const predictedUsage = dailyUsage * 30;
      const daysUntilOut = dailyUsage > 0 ? Math.floor(item.quantity / dailyUsage) : 999;

      let recommendation: 'ORDER' | 'OK' | 'REDUCE' = 'OK';
      if (daysUntilOut < 30) recommendation = 'ORDER';
      else if (daysUntilOut > 180) recommendation = 'REDUCE';

      return {
        itemId: item._id,
        itemName: item.name,
        currentStock: item.quantity,
        predictedUsage,
        daysUntilOut,
        recommendation,
        confidence: Math.min(0.95, 0.7 + (itemTransactions.length / 100) * 0.25),
      };
    });

    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
import { Request, Response } from 'express';
import Stock from '../models/Stock';
import Item from '../models/Item';
import Alert from '../models/Alert';
import mongoose from 'mongoose';

// @desc    Get all stock transactions
// @route   GET /api/stock
// @access  Private
export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactions = await Stock.find()
      .populate({
        path: 'itemId',
        select: 'name sku'
      })
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    // ✅ Format the response
    const formatted = transactions.map((t: any) => {
      // ✅ تأكد من وجود itemId
      const item = t.itemId || {};
      
      return {
        id: t._id,
        itemId: t.itemId?._id || t.itemId,
        itemName: item.name || 'Unknown Item',
        sku: item.sku || 'N/A',
        type: t.type,
        quantity: t.quantity,
        previousQuantity: t.previousQuantity,
        newQuantity: t.newQuantity,
        unit: t.unit || 'pcs',
        unitPrice: t.unitPrice,
        totalPrice: t.totalPrice,
        reference: t.reference || '',
        notes: t.notes || '',
        status: t.status,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        createdBy: t.createdBy?._id || t.createdBy,
        createdByName: t.createdBy?.firstName 
          ? `${t.createdBy.firstName} ${t.createdBy.lastName}` 
          : 'System',
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc    Get transaction by ID
// @route   GET /api/stock/:id
// @access  Private
export const getTransactionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const transaction = await Stock.findById(req.params.id)
      .populate({
        path: 'itemId',
        select: 'name sku unit'
      })
      .populate('createdBy', 'firstName lastName');
    
    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    const item = (transaction.itemId as any) || {};
    const createdByUser = (transaction.createdBy as any) || {};

    const formatted = {
      id: transaction._id,
      itemId: typeof transaction.itemId === 'object' && transaction.itemId !== null ? (transaction.itemId as any)._id : transaction.itemId,
      itemName: item.name || 'Unknown Item',
      sku: item.sku || 'N/A',
      type: transaction.type,
      quantity: transaction.quantity,
      previousQuantity: transaction.previousQuantity,
      newQuantity: transaction.newQuantity,
      unit: (transaction as any).unit || item.unit || 'pcs',
      unitPrice: transaction.unitPrice,
      totalPrice: transaction.totalPrice,
      reference: transaction.reference || '',
      notes: transaction.notes || '',
      status: transaction.status,
      createdAt: (transaction as any).createdAt,
      updatedAt: (transaction as any).updatedAt,
      createdBy: typeof transaction.createdBy === 'object' && transaction.createdBy !== null ? (transaction.createdBy as any)._id : transaction.createdBy,
      createdByName: createdByUser.firstName 
        ? `${createdByUser.firstName} ${createdByUser.lastName}` 
        : 'System',
    };

    res.json(formatted);
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ دالة مساعدة لتحديث التنبيهات
const updateItemStatusAndAlerts = async (item: any): Promise<void> => {
  try {
    // ✅ 1. تحديث الـ Status
    let newStatus = 'IN_STOCK';
    if (item.quantity === 0) {
      newStatus = 'OUT_OF_STOCK';
    } else if (item.quantity <= item.reorderLevel) {
      newStatus = 'LOW_STOCK';
    }
    
    // ✅ حفظ الـ Status الجديد
    item.status = newStatus;
    await item.save();
    console.log(`✅ Item ${item.name} status updated to: ${newStatus}`);

    // ✅ 2. تحديث التنبيهات
    // لو الكمية كافية، نحذف التنبيهات
    if (item.quantity > item.reorderLevel && item.quantity > 0) {
      await Alert.updateMany(
        { 
          itemId: item._id, 
          type: { $in: ['LOW_STOCK', 'OUT_OF_STOCK'] },
          status: 'ACTIVE'
        },
        { 
          status: 'RESOLVED',
          resolvedAt: new Date()
        }
      );
    }

    // إنشاء تنبيه LOW_STOCK لو لازم
    if (item.quantity <= item.reorderLevel && item.quantity > 0) {
      const existingAlert = await Alert.findOne({
        itemId: item._id,
        type: 'LOW_STOCK',
        status: 'ACTIVE',
      });

      if (!existingAlert) {
        await Alert.create({
          type: 'LOW_STOCK',
          priority: 'HIGH',
          title: 'Low Stock Alert',
          message: `${item.name} is running low. Only ${item.quantity} units remaining.`,
          itemId: item._id,
          itemName: item.name,
          quantity: item.quantity,
          reorderLevel: item.reorderLevel,
          status: 'ACTIVE',
        });
      } else {
        existingAlert.quantity = item.quantity;
        existingAlert.message = `${item.name} is running low. Only ${item.quantity} units remaining.`;
        await existingAlert.save();
      }
    }

    // إنشاء تنبيه OUT_OF_STOCK لو لازم
    if (item.quantity === 0) {
      const existingAlert = await Alert.findOne({
        itemId: item._id,
        type: 'OUT_OF_STOCK',
        status: 'ACTIVE',
      });

      if (!existingAlert) {
        await Alert.create({
          type: 'OUT_OF_STOCK',
          priority: 'CRITICAL',
          title: 'Out of Stock',
          message: `${item.name} is completely out of stock. Please reorder immediately.`,
          itemId: item._id,
          itemName: item.name,
          quantity: 0,
          reorderLevel: item.reorderLevel,
          status: 'ACTIVE',
        });
      }
    } else {
      await Alert.updateMany(
        { itemId: item._id, type: 'OUT_OF_STOCK', status: 'ACTIVE' },
        { status: 'RESOLVED', resolvedAt: new Date() }
      );
    }
  } catch (error) {
    console.error('❌ Error updating item status and alerts:', error);
  }
};

// ✅ Stock IN
export const stockIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId, quantity, unitPrice, reference, notes } = req.body;

    console.log('📥 Stock IN received:', { itemId, quantity, unitPrice });

    if (!itemId) {
      res.status(400).json({ message: 'Item ID is required' });
      return;
    }

    if (!quantity || quantity <= 0) {
      res.status(400).json({ message: 'Quantity must be greater than 0' });
      return;
    }

    const item = await Item.findById(itemId);
    if (!item) {
      console.log('❌ Item not found:', itemId);
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    console.log('📦 Item found:', item.name, 'Current quantity:', item.quantity);

    const previousQuantity = item.quantity;
    const newQuantity = previousQuantity + quantity;

    // ✅ Create transaction
    const transactionData = {
      itemId: item._id,
      type: 'IN' as const,
      quantity,
      previousQuantity,
      newQuantity,
      unit: item.unit,
      unitPrice: unitPrice || item.unitPrice,
      totalPrice: quantity * (unitPrice || item.unitPrice),
      reference: reference || '',
      notes: notes || '',
      status: 'COMPLETED' as const,
      createdBy: new mongoose.Types.ObjectId(req.userId),
    };

    const transaction = await Stock.create(transactionData);

    // ✅ Update item quantity
    item.quantity = newQuantity;
    
    // ✅ Update status and alerts
    await updateItemStatusAndAlerts(item);

    // ✅ Return formatted response
    const formatted = {
      id: transaction._id,
      itemId: item._id,
      itemName: item.name,
      sku: item.sku,
      type: transaction.type,
      quantity: transaction.quantity,
      previousQuantity: transaction.previousQuantity,
      newQuantity: transaction.newQuantity,
      unit: transaction.unit,
      unitPrice: transaction.unitPrice,
      totalPrice: transaction.totalPrice,
      reference: transaction.reference || '',
      notes: transaction.notes || '',
      status: transaction.status,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      createdBy: transaction.createdBy,
      createdByName: 'System',
    };

    console.log('✅ Stock IN successful');
    res.status(201).json(formatted);
  } catch (error) {
    console.error('❌ Stock IN error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// ✅ Stock OUT
export const stockOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId, quantity, reference, notes } = req.body;

    console.log('📤 Stock OUT received:', { itemId, quantity });

    if (!itemId) {
      res.status(400).json({ message: 'Item ID is required' });
      return;
    }

    if (!quantity || quantity <= 0) {
      res.status(400).json({ message: 'Quantity must be greater than 0' });
      return;
    }

    const item = await Item.findById(itemId);
    if (!item) {
      console.log('❌ Item not found:', itemId);
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    if (item.quantity < quantity) {
      res.status(400).json({ 
        message: `Insufficient quantity. Available: ${item.quantity}` 
      });
      return;
    }

    const previousQuantity = item.quantity;
    const newQuantity = previousQuantity - quantity;

    const transactionData = {
      itemId: item._id,
      type: 'OUT' as const,
      quantity,
      previousQuantity,
      newQuantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      totalPrice: quantity * item.unitPrice,
      reference: reference || '',
      notes: notes || '',
      status: 'COMPLETED' as const,
      createdBy: new mongoose.Types.ObjectId(req.userId),
    };

    const transaction = await Stock.create(transactionData);

    // ✅ Update item quantity
    item.quantity = newQuantity;
    
    // ✅ Update status and alerts
    await updateItemStatusAndAlerts(item);

    // ✅ Return formatted response
    const formatted = {
      id: transaction._id,
      itemId: item._id,
      itemName: item.name,
      sku: item.sku,
      type: transaction.type,
      quantity: transaction.quantity,
      previousQuantity: transaction.previousQuantity,
      newQuantity: transaction.newQuantity,
      unit: transaction.unit,
      unitPrice: transaction.unitPrice,
      totalPrice: transaction.totalPrice,
      reference: transaction.reference || '',
      notes: transaction.notes || '',
      status: transaction.status,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      createdBy: transaction.createdBy,
      createdByName: 'System',
    };

    console.log('✅ Stock OUT successful');
    res.status(201).json(formatted);
  } catch (error) {
    console.error('❌ Stock OUT error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};
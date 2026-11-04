import { Request, Response } from 'express';
import Item from '../models/Item';
import Category from '../models/Category';
import Supplier from '../models/Supplier';
import Alert from '../models/Alert';
import mongoose from 'mongoose';

// ✅ دالة مساعدة لتحديث التنبيهات
const updateAlertsForItem = async (item: any): Promise<void> => {
  try {
    console.log('🔄 Checking alerts for item:', item.name, 'Quantity:', item.quantity);

    // ✅ 1. لو الكمية كافية، نحذف تنبيه LOW_STOCK و OUT_OF_STOCK
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

    // ✅ 2. إنشاء تنبيه LOW_STOCK لو لازم
    if (item.quantity <= item.reorderLevel && item.quantity > 0) {
      const existingAlert = await Alert.findOne({
        itemId: item._id,
        type: 'LOW_STOCK',
        status: 'ACTIVE',
      });

      if (!existingAlert) {
        const newAlert = await Alert.create({
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
        console.log('✅ Created LOW_STOCK alert:', newAlert.id);
      }
    }

    // ✅ 3. إنشاء تنبيه OUT_OF_STOCK لو لازم
    if (item.quantity === 0) {
      const existingAlert = await Alert.findOne({
        itemId: item._id,
        type: 'OUT_OF_STOCK',
        status: 'ACTIVE',
      });

      if (!existingAlert) {
        const newAlert = await Alert.create({
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
        console.log('✅ Created OUT_OF_STOCK alert:', newAlert.id);
      }
    } else {
      await Alert.updateMany(
        { itemId: item._id, type: 'OUT_OF_STOCK', status: 'ACTIVE' },
        { status: 'RESOLVED', resolvedAt: new Date() }
      );
    }

    // ✅ 4. تنبيه EXPIRING_SOON
    if (item.expiryDate) {
      const daysUntilExpiry = Math.ceil(
        (new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
        const existingAlert = await Alert.findOne({
          itemId: item._id,
          type: 'EXPIRING_SOON',
          status: 'ACTIVE',
        });

        if (!existingAlert) {
          const newAlert = await Alert.create({
            type: 'EXPIRING_SOON',
            priority: daysUntilExpiry <= 7 ? 'HIGH' : 'MEDIUM',
            title: 'Expiring Soon',
            message: `${item.name} will expire in ${daysUntilExpiry} days.`,
            itemId: item._id,
            itemName: item.name,
            expiryDate: item.expiryDate,
            status: 'ACTIVE',
          });
          console.log('✅ Created EXPIRING_SOON alert:', newAlert.id);
        }
      }
    } else {
      await Alert.updateMany(
        { itemId: item._id, type: 'EXPIRING_SOON', status: 'ACTIVE' },
        { status: 'RESOLVED', resolvedAt: new Date() }
      );
    }
  } catch (error) {
    console.error('❌ Error updating alerts:', error);
  }
};


// ✅ دالة لتنسيق الـ Item
const formatItemResponse = (item: any) => ({
  id: item._id,
  _id: item._id,
  name: item.name,
  sku: item.sku,
  categoryId: item.categoryId?._id || item.categoryId,
  category: item.categoryId?.name || 'N/A',
  supplierId: item.supplierId?._id || item.supplierId,
  supplier: item.supplierId?.name || 'N/A',
  quantity: item.quantity,
  unit: item.unit,
  unitPrice: item.unitPrice,
  totalValue: item.totalValue || item.quantity * item.unitPrice,
  reorderLevel: item.reorderLevel,
  location: item.location,
  expiryDate: item.expiryDate,
  description: item.description,
  status: item.status,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

// @desc    Get all items
// @route   GET /api/items
// @access  Private
export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await Item.find()
      .populate('categoryId', 'name')
      .populate('supplierId', 'name');
    
    const formatted = items.map(formatItemResponse);
    res.json(formatted);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get item by ID
// @route   GET /api/items/:id
// @access  Private
export const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('categoryId', 'name')
      .populate('supplierId', 'name');
    
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    res.json(formatItemResponse(item));
  } catch (error) {
    console.error('Get item by id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create item
// @route   POST /api/items
// @access  Private
export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📦 Creating item with data:', req.body);

    const { 
      name, 
      sku, 
      categoryId, 
      supplierId, 
      quantity, 
      unit, 
      unitPrice, 
      reorderLevel, 
      location, 
      expiryDate, 
      description 
    } = req.body;

    // ✅ Validate required fields
    if (!name) {
      res.status(400).json({ message: 'Name is required' });
      return;
    }
    if (!sku) {
      res.status(400).json({ message: 'SKU is required' });
      return;
    }
    if (!categoryId) {
      res.status(400).json({ message: 'Category ID is required' });
      return;
    }
    if (!supplierId) {
      res.status(400).json({ message: 'Supplier ID is required' });
      return;
    }
    if (quantity === undefined || quantity === null) {
      res.status(400).json({ message: 'Quantity is required' });
      return;
    }
    if (!unit) {
      res.status(400).json({ message: 'Unit is required' });
      return;
    }
    if (unitPrice === undefined || unitPrice === null) {
      res.status(400).json({ message: 'Unit price is required' });
      return;
    }
    if (reorderLevel === undefined || reorderLevel === null) {
      res.status(400).json({ message: 'Reorder level is required' });
      return;
    }
    if (!location) {
      res.status(400).json({ message: 'Location is required' });
      return;
    }

    // ✅ Convert string to ObjectId
    let categoryObjectId: mongoose.Types.ObjectId;
    let supplierObjectId: mongoose.Types.ObjectId;

    try {
      categoryObjectId = new mongoose.Types.ObjectId(categoryId);
      supplierObjectId = new mongoose.Types.ObjectId(supplierId);
    } catch (error) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }

    // ✅ Check if category exists
    const category = await Category.findById(categoryObjectId);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    // ✅ Check if supplier exists
    const supplier = await Supplier.findById(supplierObjectId);
    if (!supplier) {
      res.status(404).json({ message: 'Supplier not found' });
      return;
    }

    // ✅ Check if SKU already exists
    const existingItem = await Item.findOne({ sku });
    if (existingItem) {
      res.status(400).json({ message: 'Item with this SKU already exists' });
      return;
    }

    // ✅ Create item
    const item = new Item({
      name,
      sku,
      categoryId: categoryObjectId,
      supplierId: supplierObjectId,
      quantity,
      unit,
      unitPrice,
      reorderLevel,
      location,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      description: description || '',
    });

    await item.save();

    // ✅ Update category item count
    await Category.findByIdAndUpdate(categoryObjectId, {
      $inc: { itemCount: 1 },
    });

    // ✅ Update supplier item count
    await Supplier.findByIdAndUpdate(supplierObjectId, {
      $inc: { itemCount: 1 },
    });

    // ✅ ✅ ✅ ✅ ✅ IMPORTANT: Generate alerts for the new item
    await updateAlertsForItem(item);

    // ✅ Get populated item
    const populatedItem = await Item.findById(item._id)
      .populate('categoryId', 'name')
      .populate('supplierId', 'name');

    console.log('✅ Item created:', populatedItem);
    res.status(201).json(formatItemResponse(populatedItem));
  } catch (error: unknown) {
    console.error('❌ Create item error:', error);
    
    const err = error as { code?: number; message?: string };
    if (err.code === 11000) {
      res.status(400).json({ message: 'SKU already exists' });
      return;
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message || 'Unknown error' 
    });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📝 Updating item ID:', req.params.id);
    console.log('📝 Update data:', req.body);

    // ✅ 1. جلب المنتج القديم
    const oldItem = await Item.findById(req.params.id);
    if (!oldItem) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    // ✅ 2. تجهيز البيانات للتحديث
    const updateData: any = { ...req.body };

    // ✅ 3. تحويل categoryId و supplierId لـ ObjectId لو موجودين
    if (updateData.categoryId) {
      try {
        updateData.categoryId = new mongoose.Types.ObjectId(updateData.categoryId);
      } catch (error) {
        res.status(400).json({ message: 'Invalid category ID format' });
        return;
      }
    }

    if (updateData.supplierId) {
      try {
        updateData.supplierId = new mongoose.Types.ObjectId(updateData.supplierId);
      } catch (error) {
        res.status(400).json({ message: 'Invalid supplier ID format' });
        return;
      }
    }

    // ✅ 4. حساب الـ Status الجديد بناءً على الكمية
    if (updateData.quantity !== undefined) {
      const newQuantity = updateData.quantity;
      const reorderLevel = updateData.reorderLevel || oldItem.reorderLevel;
      
      if (newQuantity === 0) {
        updateData.status = 'OUT_OF_STOCK';
      } else if (newQuantity <= reorderLevel) {
        updateData.status = 'LOW_STOCK';
      } else {
        updateData.status = 'IN_STOCK';
      }
      
      console.log('✅ New status calculated:', updateData.status);
    }

    // ✅ 5. تحديث عدد المنتجات في الفئة والمورد لو اتغيروا
    // ✅ ✅ ✅ أضف هذا الجزء
    if (req.body.categoryId && req.body.categoryId !== oldItem.categoryId.toString()) {
      // نقص من الفئة القديمة
      await Category.findByIdAndUpdate(oldItem.categoryId, { $inc: { itemCount: -1 } });
      // زود في الفئة الجديدة
      await Category.findByIdAndUpdate(req.body.categoryId, { $inc: { itemCount: 1 } });
      console.log(`✅ Category count updated: ${oldItem.categoryId} (-1), ${req.body.categoryId} (+1)`);
    }

    if (req.body.supplierId && req.body.supplierId !== oldItem.supplierId.toString()) {
      // نقص من المورد القديم
      await Supplier.findByIdAndUpdate(oldItem.supplierId, { $inc: { itemCount: -1 } });
      // زود في المورد الجديد
      await Supplier.findByIdAndUpdate(req.body.supplierId, { $inc: { itemCount: 1 } });
      console.log(`✅ Supplier count updated: ${oldItem.supplierId} (-1), ${req.body.supplierId} (+1)`);
    }

    // ✅ 6. تحديث المنتج
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    // ✅ 7. تحديث التنبيهات
    await updateAlertsForItem(updatedItem);

    // ✅ 8. جلب المنتج مع الـ populated fields
    const populatedItem = await Item.findById(updatedItem._id)
      .populate('categoryId', 'name')
      .populate('supplierId', 'name');

    console.log('✅ Item updated successfully:', populatedItem);
    res.json(formatItemResponse(populatedItem));
  } catch (error) {
    console.error('❌ Update item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    // ✅ ✅ ✅ نقص من الفئة والمورد
    await Category.findByIdAndUpdate(item.categoryId, { $inc: { itemCount: -1 } });
    await Supplier.findByIdAndUpdate(item.supplierId, { $inc: { itemCount: -1 } });

    // ✅ حذف التنبيهات المرتبطة بالمنتج
    await Alert.updateMany(
      { itemId: item._id, status: 'ACTIVE' },
      { status: 'RESOLVED', resolvedAt: new Date() }
    );

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
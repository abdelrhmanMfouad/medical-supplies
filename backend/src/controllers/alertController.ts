import { Request, Response } from 'express';
import Alert, { IAlert } from '../models/Alert';
import Item from '../models/Item';
import { Types } from 'mongoose';

type AlertCreateInput = {
  type: string;
  priority: string;
  title: string;
  message: string;
  itemId: Types.ObjectId | string;
  itemName: string;
  quantity?: number;
  reorderLevel?: number;
  expiryDate?: Date | string;
  status: string;
};

// ✅ Type يوصف الـ alert بعد الـ populate
type PopulatedAlert = Omit<IAlert, 'itemId'> & {
  _id: Types.ObjectId;
  itemId: Types.ObjectId | { _id: Types.ObjectId; name: string; sku: string };
};

// ✅ دالة مساعدة لتوحيد شكل الـ alert قبل الإرسال للفرونت إند
const formatAlert = (alert: PopulatedAlert) => {
  const item = alert.itemId as { _id: Types.ObjectId; name: string; sku: string };

  return {
    id: alert._id,
    type: alert.type,
    priority: alert.priority,
    title: alert.title,
    message: alert.message,
    itemId: item?._id || alert.itemId,
    itemName: item?.name || alert.itemName,
    sku: item?.sku,
    quantity: alert.quantity,
    reorderLevel: alert.reorderLevel,
    expiryDate: alert.expiryDate,
    status: alert.status,
    dismissedAt: alert.dismissedAt,
    resolvedAt: alert.resolvedAt,
    createdAt: alert.get('createdAt'),
    updatedAt: alert.get('updatedAt'),
  };
};

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Private
export const getAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const alerts = await Alert.find()
      .populate('itemId', 'name sku')
      .sort({ createdAt: -1 });

    const formatted = alerts.map((a) => formatAlert(a as unknown as PopulatedAlert));
    res.json(formatted);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get active alerts
// @route   GET /api/alerts/active
// @access  Private
export const getActiveAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const alerts = await Alert.find({ status: 'ACTIVE' })
      .populate('itemId', 'name sku')
      .sort({ createdAt: -1 });

    const formatted = alerts.map((a) => formatAlert(a as unknown as PopulatedAlert));
    res.json(formatted);
  } catch (error) {
    console.error('Get active alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get alert by ID
// @route   GET /api/alerts/:id
// @access  Private
export const getAlertById = async (req: Request, res: Response): Promise<void> => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate('itemId', 'name sku quantity');

    if (!alert) {
      res.status(404).json({ message: 'Alert not found' });
      return;
    }
    res.json(formatAlert(alert as unknown as PopulatedAlert));
  } catch (error) {
    console.error('Get alert by id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Dismiss alert
// @route   PUT /api/alerts/:id/dismiss
// @access  Private
export const dismissAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔕 Dismissing alert:', req.params.id);

    const alert = await Alert.findById(req.params.id).populate('itemId', 'name sku');
    if (!alert) {
      res.status(404).json({ message: 'Alert not found' });
      return;
    }

    alert.status = 'DISMISSED';
    alert.dismissedAt = new Date();
    await alert.save();

    res.json({ message: 'Alert dismissed successfully', alert: formatAlert(alert as unknown as PopulatedAlert) });
  } catch (error) {
    console.error('Dismiss alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Resolve alert
// @route   PUT /api/alerts/:id/resolve
// @access  Private
export const resolveAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('✅ Resolving alert:', req.params.id);

    const alert = await Alert.findById(req.params.id).populate('itemId', 'name sku');
    if (!alert) {
      res.status(404).json({ message: 'Alert not found' });
      return;
    }

    alert.status = 'RESOLVED';
    alert.resolvedAt = new Date();
    await alert.save();

    res.json({ message: 'Alert resolved successfully', alert: formatAlert(alert as unknown as PopulatedAlert) });
  } catch (error) {
    console.error('Resolve alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create alert manually
// @route   POST /api/alerts
// @access  Private
export const createAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const alert = await Alert.create(req.body);
    const populated = await alert.populate('itemId', 'name sku');
    res.status(201).json(formatAlert(populated as unknown as PopulatedAlert));
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Check and generate alerts automatically
// @route   GET /api/alerts/check
// @access  Private
export const checkAndGenerateAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await Item.find();
    const alertsToCreate: AlertCreateInput[] = [];

    for (const item of items) {
      if (item.quantity <= item.reorderLevel && item.quantity > 0) {
        const existingAlert = await Alert.findOne({
          itemId: item._id,
          type: 'LOW_STOCK',
          status: 'ACTIVE',
        });

        if (!existingAlert) {
          alertsToCreate.push({
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
        }
      }

      if (item.quantity === 0) {
        const existingAlert = await Alert.findOne({
          itemId: item._id,
          type: 'OUT_OF_STOCK',
          status: 'ACTIVE',
        });

        if (!existingAlert) {
          alertsToCreate.push({
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
      }

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
            alertsToCreate.push({
              type: 'EXPIRING_SOON',
              priority: daysUntilExpiry <= 7 ? 'HIGH' : 'MEDIUM',
              title: 'Expiring Soon',
              message: `${item.name} will expire in ${daysUntilExpiry} days.`,
              itemId: item._id,
              itemName: item.name,
              expiryDate: item.expiryDate,
              status: 'ACTIVE',
            });
          }
        }
      }
    }

    const createdAlerts = await Alert.insertMany(alertsToCreate);
    res.json({
      message: `Generated ${createdAlerts.length} new alerts`,
      alerts: createdAlerts,
    });
  } catch (error) {
    console.error('Check alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get alerts count
// @route   GET /api/alerts/count
// @access  Private
export const getAlertsCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const active = await Alert.countDocuments({ status: 'ACTIVE' });
    const critical = await Alert.countDocuments({
      status: 'ACTIVE',
      priority: 'CRITICAL',
    });
    const lowStock = await Alert.countDocuments({
      status: 'ACTIVE',
      type: { $in: ['LOW_STOCK', 'OUT_OF_STOCK'] },
    });
    const expiring = await Alert.countDocuments({
      status: 'ACTIVE',
      type: { $in: ['EXPIRING_SOON', 'EXPIRED'] },
    });

    res.json({
      total: active,
      critical,
      lowStock,
      expiring,
    });
  } catch (error) {
    console.error('Get alerts count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
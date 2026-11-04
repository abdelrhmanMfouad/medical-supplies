import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Supplier from '../models/Supplier';
import Item from '../models/Item';

type SupplierDocument = {
  _id: Types.ObjectId | string;
  name?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  taxId?: string;
  website?: string;
  notes?: string;
  itemCount?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const formatSupplier = (supplier: SupplierDocument) => ({
  id: supplier._id,
  _id: supplier._id,
  name: supplier.name || 'N/A',
  contactPerson: supplier.contactPerson || 'N/A',
  email: supplier.email || 'N/A',
  phone: supplier.phone || 'N/A',
  address: supplier.address || 'N/A',
  city: supplier.city || 'N/A',
  country: supplier.country || 'N/A',
  postalCode: supplier.postalCode || 'N/A',
  taxId: supplier.taxId || '',
  website: supplier.website || '',
  notes: supplier.notes || '',
  itemCount: supplier.itemCount || 0,
  status: supplier.status || 'active',
  createdAt: supplier.createdAt,
  updatedAt: supplier.updatedAt,
});

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
export const getSuppliers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const suppliers = await Supplier.find();
    const formatted = suppliers.map((supplier) => formatSupplier(supplier as SupplierDocument));

    res.json(formatted);
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get supplier by ID
// @route   GET /api/suppliers/:id
// @access  Private
export const getSupplierById = async (req: Request, res: Response): Promise<void> => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      res.status(404).json({ message: 'Supplier not found' });
      return;
    }

    res.json(formatSupplier(supplier as SupplierDocument));
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create supplier
// @route   POST /api/suppliers
// @access  Private
export const createSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const supplier = await Supplier.create(req.body);

    res.status(201).json(formatSupplier(supplier as SupplierDocument));
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private
export const updateSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      res.status(404).json({ message: 'Supplier not found' });
      return;
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedSupplier) {
      res.status(404).json({ message: 'Supplier not found' });
      return;
    }

    res.json(formatSupplier(updatedSupplier as SupplierDocument));
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
export const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      res.status(404).json({ message: 'Supplier not found' });
      return;
    }

    const itemCount = await Item.countDocuments({ supplierId: req.params.id });
    if (itemCount > 0) {
      res.status(400).json({
        message: `Cannot delete supplier with ${itemCount} items. Please reassign or delete the items first.`
      });
      return;
    }

    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
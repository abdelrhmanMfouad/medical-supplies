import { Request, Response } from 'express';
import Category from '../models/Category';
import Item from '../models/Item';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find();

    // ✅ حوّل _id إلى id عشان يتوافق مع الـ Category interface في الفرونت إند
    const formatted = categories.map((cat) => ({
      id: cat._id,
      name: cat.name,
      description: cat.description,
      itemCount: cat.itemCount,
      createdAt: cat.get('createdAt'),
      updatedAt: cat.get('updatedAt'),
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.create(req.body);

    // ✅ رجّع نفس الشكل الموحّد (id بدل _id) عشان يتضاف صح في الـ Redux state
    res.status(201).json({
      id: category._id,
      name: category.name,
      description: category.description,
      itemCount: category.itemCount,
      createdAt: category.get('createdAt'),
      updatedAt: category.get('updatedAt'),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    // ✅ نفس التوحيد هنا
    res.json({
      id: updatedCategory._id,
      name: updatedCategory.name,
      description: updatedCategory.description,
      itemCount: updatedCategory.itemCount,
      createdAt: updatedCategory.get('createdAt'),
      updatedAt: updatedCategory.get('updatedAt'),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const itemCount = await Item.countDocuments({ categoryId: req.params.id });
    if (itemCount > 0) {
      res.status(400).json({ 
        message: `Cannot delete category with ${itemCount} items. Please reassign or delete the items first.` 
      });
      return;
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
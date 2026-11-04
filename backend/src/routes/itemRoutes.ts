import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/itemController';

const router = Router();

// ✅ GET all items
router.get('/', protect, getItems);

// ✅ POST create item
router.post('/', protect, createItem);

// ✅ GET item by ID
router.get('/:id', protect, getItemById);

// ✅ PUT update item
router.put('/:id', protect, updateItem);

// ✅ DELETE delete item
router.delete('/:id', protect, deleteItem);

export default router;
import { Router } from 'express';
import {
  getTransactions,
  getTransactionById,
  stockIn,
  stockOut,
} from '../controllers/stockController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', protect, getTransactions);
router.get('/:id', protect, getTransactionById);
router.post('/in', protect, stockIn);
router.post('/out', protect, stockOut);

export default router;
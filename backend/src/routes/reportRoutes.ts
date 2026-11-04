import { Router } from 'express';
import {
  getInventoryReport,
  getStockReport,
  getPredictions,
} from '../controllers/reportController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/inventory', protect, getInventoryReport);
router.get('/stock', protect, getStockReport);
router.get('/predictions', protect, getPredictions);

export default router;
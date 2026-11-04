import { Router } from 'express';
import {
  getAlerts,
  getActiveAlerts,
  getAlertById,
  dismissAlert,
  resolveAlert,
  createAlert,
  checkAndGenerateAlerts,
  getAlertsCount,
} from '../controllers/alertController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', protect, getAlerts);
router.get('/active', protect, getActiveAlerts);
router.get('/count', protect, getAlertsCount);
router.get('/check', protect, checkAndGenerateAlerts);
router.get('/:id', protect, getAlertById);
router.post('/', protect, createAlert);
router.put('/:id/dismiss', protect, dismissAlert);
router.put('/:id/resolve', protect, resolveAlert);

export default router;
import { Router } from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile,
  forgotPassword,
  resetPassword,
  uploadAvatar,  // ✅ مستوردة
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/upload-avatar', protect, uploadAvatar);  // ✅ استخدمها

export default router;
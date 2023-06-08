import express from 'express';
import { forgotPassword, resetPassword, changePassword } from '../controllers/passwordController.js';

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.get('/reset-password', resetPassword);
router.post('/change-password', changePassword);

export default router;

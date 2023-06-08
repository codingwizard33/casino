import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { verifyMiddleware } from '../middlewares/verifyMiddleware.js';
import { loginUser, registerUser, verifyEmail, completeRegistration, logOut } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.post('/complete-registration', authMiddleware, verifyMiddleware, completeRegistration);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logOut);

export default router;

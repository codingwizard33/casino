import express from 'express';
import { userProfileInformationChange, userPasswordUpdate } from '../controllers/userProfileInformationChangeController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { userProfileUdateMiddleware } from '../middlewares/userProfileUpdateMiddleware.js';
import { generateAccessToken } from '../utils/auth.js';

const router = express.Router();

router.post('/change-user-information', authMiddleware, userProfileUdateMiddleware, userProfileInformationChange);
router.post('/update-password', authMiddleware, userPasswordUpdate);
router.post('/refresh-token', authMiddleware, generateAccessToken);

export default router;

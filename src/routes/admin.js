import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { verifyMiddleware } from '../middlewares/verifyMiddleware.js';
import { createSuperAgent } from '../controllers/admin/createSuperAgentController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/create-super-agent', authMiddleware, verifyMiddleware, adminMiddleware, createSuperAgent);

export default router;

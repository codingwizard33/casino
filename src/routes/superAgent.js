import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { verifyMiddleware } from '../middlewares/verifyMiddleware.js';
import { createAgent } from '../controllers/super-agent/createAgentController.js';
import { superAgentMiddleware } from '../middlewares/superAgentMiddleware.js';

const router = express.Router();

router.post('/create-agent', authMiddleware, verifyMiddleware, superAgentMiddleware, createAgent);

export default router;

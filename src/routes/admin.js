import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { verifyMiddleware } from '../middlewares/verifyMiddleware.js';
import { createSuperAgent } from '../controllers/admin/createSuperAgentController.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { getSuperAgents } from '../controllers/getSuperAgentsController.js';
import { superAgentMiddleware } from '../middlewares/superAgentMiddleware.js';
import { agentMiddleware } from '../middlewares/agentMiddleware.js';

const router = express.Router();

router.post('/create-super-agent', authMiddleware, verifyMiddleware, adminMiddleware, superAgentMiddleware, agentMiddleware, createSuperAgent);
router.post('/get-super-agents', authMiddleware, verifyMiddleware, adminMiddleware, superAgentMiddleware, agentMiddleware, getSuperAgents);

export default router;

import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { verifyMiddleware } from '../middlewares/verifyMiddleware.js';
import { createAgent } from '../controllers/super-agent/createAgentController.js';
import { superAgentMiddleware } from '../middlewares/superAgentMiddleware.js';
import { getAgents } from '../controllers/getAgentsController.js';
import { agentMiddleware } from '../middlewares/agentMiddleware.js';

const router = express.Router();

router.post('/create-agent', authMiddleware, verifyMiddleware, createAgent);
router.post('/get-agents', authMiddleware, verifyMiddleware, getAgents);

export default router;

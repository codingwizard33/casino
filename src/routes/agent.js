import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { verifyMiddleware } from '../middlewares/verifyMiddleware.js';
import { createPlayer } from '../controllers/agent/createPlayerController.js';
import { agentMiddleware } from '../middlewares/agentMiddleware.js';
import { acceptPlayer } from '../controllers/agent/acceptController.js'

const router = express.Router();

router.post('/create-player', authMiddleware, verifyMiddleware, agentMiddleware, createPlayer);
router.post('/accept-player', authMiddleware, verifyMiddleware, agentMiddleware, acceptPlayer);

export default router;

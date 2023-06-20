import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDatabase from './config/database.js';
import createAdmin from './utils/createAdmin.js';
import authRoutes from './routes/auth.js';
import forgotRoutes from './routes/forgot.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';
import superAgentRoutes from './routes/superAgent.js';
import agentRoutes from './routes/agent.js';

dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));

// Connect to MongoDB
connectDatabase();

// Create user admin if not exist only for dev mode
createAdmin();

app.use(cors({
  origin: '*'
}));

// Routes
app.use('/auth', authRoutes);
app.use('/pass', forgotRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/super-agent', superAgentRoutes);
app.use('/agent', agentRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const getSuperAgents = async (req, res) => {
  const token = req.header('token');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const admin = await User.findById(decoded.userId);
  const usersId = admin.super_agents;

  const users = await User.find({ _id: { $in: usersId } });

  return res.json(users);
}

export { getSuperAgents };

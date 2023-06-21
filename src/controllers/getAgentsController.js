import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const getAgents = async (req, res) => {
  const token = req.header('token');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const superAgent = await User.findById(decoded.userId);
  const usersId = superAgent.agents;

  const users = await User.find({ _id: { $in: usersId } });

  return res.json(users);
}

export { getAgents };

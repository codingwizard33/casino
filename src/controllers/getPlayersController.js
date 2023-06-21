import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const getPlayers = async (req, res) => {
  const token = req.header('token');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const agent = await User.findById(decoded.userId);
  const usersId = agent.agents;

  const users = await User.find({ _id: { $in: usersId } });

  return res.json(users);
}

export { getPlayers };

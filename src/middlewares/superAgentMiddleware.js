import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const superAgentMiddleware = async (req, res, next) => {
  // Get the token from the request headers
  const token = req.header('token');

  // Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find the user based on the decoded token
  const user = await User.findById(decoded.userId);

  if (user.user_role !== 'super_agent') {
    return res.status(403).json({ error: 'Permission denied' });
  }

  // Attach the user object to the request for further use
  req.user = user;

  // Call the next middleware or route handler
  next();
};

export { superAgentMiddleware };

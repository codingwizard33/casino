import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate an access token
const generateAccessToken = async (req, res) => {
  const token = req.header('token');

  // Verify the token
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  // Find the user based on the decoded token
  const user = await User.findById(decodedToken.userId);

  const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  return res.json( newToken );
};

export { generateAccessToken };

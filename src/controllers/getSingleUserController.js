import User from '../models/User.js';

const getUser = async (req, res) => {
  const user = await User.find({ _id: req.body.user_id });

  return res.json(user);
}

export { getUser };

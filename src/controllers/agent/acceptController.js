import User from '../../models/User.js';
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';

const acceptPlayer = async (req, res) => {
  const { player_id } = req.body;
  const token = req.header('token');

  // Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find the user based on the decoded token
  const user = await User.findById(decoded.userId);

  // add player in collection
  user.players.push(player_id);
  await user.save();

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const player = await User.findById(player_id);

  // Save agent id in player
  player.player_agent = user._id;
  player.save();

  const message = {
    to: player.email,
    from: process.env.SENDER_EMAIL,
    subject: 'Verification note',
    html: `
      <h3>Dear ${player.user_name},</h3>

      <p>Your account attached to ${user.user_role} <strong>agent</strong></p>
    `
  }

  await sgMail.send(message);

  return res.json({ message: 'Player account successfuley attachet to you' });
}

export { acceptPlayer };

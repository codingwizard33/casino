import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import bcrypt from 'bcrypt';

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate a password reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Save the reset token to the user document
    user.reset_token = resetToken;
    await user.save();

    // Send the password reset email
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const message = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: 'Password Reset',
      html: `
        <h3>Dear ${user.user_name},</h3>
          
        <p>Welcome to our Gaming Platform!</p>
        
        <h3>To complete the password reset process in your account, clic on the button below:</h3>

        <a style="display: block; width: 115px; height: 25px; background: #4E9CAF; padding: 10px; text-align: center;
        border-radius: 5px; color: white; font-weight: bold; line-height: 25px; text-decoration: none;" href="http://localhost:3000/pass/reset-password?token=${user.reset_token}">Activate</button>
      `
    };

    await sgMail.send(message);

    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded token
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const changePassword = async (req, res) => {
  const { old_password, password, password_confirmation, email } = req.body;

  // check password confirmation
  if (password !== password_confirmation) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  
  // find user
  const user = await User.findOne({ email });

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(old_password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Update the user's email verification status
  user.password = hashedPassword;
  await user.save();

  res.json({ message: 'Password changed' });
};

export { forgotPassword, resetPassword, changePassword };

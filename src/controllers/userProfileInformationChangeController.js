import User from '../models/User.js';
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userProfileInformationChange = async (req, res) => {
  const token = req.header('token');
  let msg = '';
  
  // Verify the token
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  // Find the user based on the decoded token
  const user = await User.findById(decodedToken.userId);

  //requested variables
  const data = req.body;

  // Update the user's email verification status
  for (let key in data) {
    user[key] = data[key];

    // check if changable is email address
    if (key === 'email' && data[key] !== user[key]) {
      user.isVerified = false;
      // Generate verification token
      const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Send verification email
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const message = {
        to: data[key],
        from: process.env.SENDER_EMAIL,
        subject: 'Activate Your Gaming Platform Account - Email Verification Required',
        html: `
          <h3>Dear ${user.user_name},</h3>
          
          <p>Welcome to our Gaming Platform!</p>
          
          <p>We're excited to have you as a member of our gaming community. Before you can fully enjoy all the features and benefits of our platform, we kindly request that you verify your email address.</p>
          
          <h3>To complete the verification process and activate your account, clic on the button below:</h3>

          <a style="display: block; width: 115px; height: 25px; background: #4E9CAF; padding: 10px; text-align: center;
          border-radius: 5px; color: white; font-weight: bold; line-height: 25px; text-decoration: none;" href="http://localhost:3000/auth/verify-email?token=${verificationToken}">Activate</button>
        `
      };

      sgMail.send(message);

      msg = 'Account verification email sent';
    }
  }

  await user.save();

  return res.json({ message: `User data saved successful! ${msg}` });
};

const userPasswordUpdate = async (req, res) => {
  const token = req.header('token');

  const { password, password_confirmation } = req.body;
  
  // Verify the token
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  // Find the user based on the decoded token
  const user = await User.findById(decodedToken.userId);

  // Check password confirmation
  if (password !== password_confirmation) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.password = hashedPassword;
  await user.save();

  return res.json({ message: 'Password change success' });
};

export { userProfileInformationChange, userPasswordUpdate };

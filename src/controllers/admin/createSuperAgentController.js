import User from '../../models/User.js';
import sgMail from '@sendgrid/mail';
import bcrypt from 'bcrypt';
import { generateRandomPassword } from '../../utils/generateRandomPassword.js';
import jwt from 'jsonwebtoken';
import CoinWallet from '../../models/CoinWallet.js';

const createSuperAgent = async (req, res) => {
  try {
    const { user_name, email, phone_number, full_name, country, date_of_birth } = req.body;
    const token = req.header('token');

    const password = generateRandomPassword();

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new super agent
    const newUser = new User({
      user_name: user_name,
      email: email,
      phone_number: phone_number,
      password: hashedPassword,
      full_name: full_name,
      country: country,
      date_of_birth: date_of_birth,
      isVerified: true,
      reset_token: null,
      user_role: 'super_agent'
    });
    await newUser.save();

    // create coin wallet
    const coinWallet = new CoinWallet({
      user_id: newUser._id,
      balance: 0
    });
    await coinWallet.save();

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded token
    const user = await User.findById(decoded.userId);

    // Update auth user
    user.super_agents.push(newUser._id);
    await user.save();

    // Send verification email
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const message = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: 'Welcome',
      html: `
        <h3>Dear ${user_name},</h3>
        
        <p>Welcome to our Gaming Platform!</p>
        
        <p>We're excited to have you as a super agent of our gaming community.</p>
        
        <h3>Your account credentials below:</h3>
        <h2>Login: ${email}</h2>
        <h2>Password: ${password}</h2>
      `
    };

    await sgMail.send(message);

    return res.json({ message: 'Account was created successfuley ' });
  } catch (error) {
    return res.json({ message: error });
  }
};

export { createSuperAgent };

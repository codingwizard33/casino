import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import CoinWallet from '../models/CoinWallet.js';
import sgMail from '@sendgrid/mail';
import { startSession } from 'mongoose';

const registerUser = async (req, res) => {
  try {
    const { user_name, email, phone_number, password, password_confirmation } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Check password confirmation
    if (password !== password_confirmation) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const session = await startSession();
    session.startTransaction();

    // Create a new user
    const user = new User({
      user_name,
      email,
      phone_number,
      password: hashedPassword,
      user_role: 'player'
    });
    // Save the user to the database
    await user.save();

    // create coin wallet
    const coinWallet = new CoinWallet({
      user_id: user._id,
      balance: 0
    });
    await coinWallet.save();
    
    await session.commitTransaction();

    session.endSession();

    // Generate verification token
    const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send verification email
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const message = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: 'Activate Your Gaming Platform Account - Email Verification Required',
      html: `
        <h3>Dear ${user_name},</h3>
        
        <p>Welcome to our Gaming Platform!</p>
        
        <p>We're excited to have you as a member of our gaming community. Before you can fully enjoy all the features and benefits of our platform, we kindly request that you verify your email address.</p>
        
        <h3>To complete the verification process and activate your account, clic on the button below:</h3>

        <a style="display: block; width: 115px; height: 25px; background: #4E9CAF; padding: 10px; text-align: center;
        border-radius: 5px; color: white; font-weight: bold; line-height: 25px; text-decoration: none;" href="http://localhost:3000/auth/verify-email?token=${verificationToken}">Activate</button>
      `
    };

    await sgMail.send(message);

    return res.status(201).json({ message: 'User registered successfully', verificationToken });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return res.status(500).json({ error: error });
  }
};

const verifyEmail = async (req, res) => {
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

    // Update the user's email verification status
    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const completeRegistration = async (req, res) => {
  try {
    const { full_name, country, date_of_birth, user_image } = req.body;
    const token = req.header('token');

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded token
    const user = await User.findById(decodedToken.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.isVerified === false) {
      return res.status(401).json({ error: 'Verification required' });
    }

    // Update the user data
    user.full_name = full_name;
    user.country = country;
    user.date_of_birth = date_of_birth;
    user.user_image = user_image;
    await user.save();

    res.json({ message: 'User data completed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Checking user role
    if (user.user_role === 'admin') {
      return res.json({ token: token, user });
    }

    if (user.user_role === 'super_agent') {
      return res.json({ token: token, user });
    }

    if (user.user_role === 'agent') {
      return res.json({ token: token, user });
    }

    return res.json({ token: token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const logOut = async (req, res) => {
  try {
    // Clear the token by setting it to an empty string
    res.setHeader('token', '');

    res.json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { registerUser, loginUser, verifyEmail, completeRegistration, logOut };

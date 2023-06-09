import mongoose from 'mongoose';
import User from '../models/User.js'
import CoinWallet from '../models/CoinWallet.js';

const createAdmin = async () => {
  try {
    const existingUser = await User.findOne({ email: 'admin@admin.com' });
    if (!existingUser) {
      const newUser = new User({
        user_name: 'admin',
        email: 'admin@admin.com',
        phone_number: '1234567890',
        password: '$2b$10$4O6K8JqYgJteQJWNRWxIzeWvDqaZPxipgk86C8GwVCBgxDF1EqGhi',
        first_name: 'Admin',
        last_name: 'Admin',
        country: 'USA',
        date_of_birth: new Date('1990-01-01'),
        isVerified: true,
        reset_token: null,
        user_role: 'admin'
      });
      await newUser.save();

      const coinWallet = new CoinWallet({
        user_id: newUser._id,
        balance: 5000
      });
      await coinWallet.save();

      console.log('User created successfully!');
    } else {
      console.log('User already exists.');
    }
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

export default createAdmin;

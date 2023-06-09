import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  balance: { type: Number, required: true }
});

export default mongoose.model('CoinWallet', userSchema);

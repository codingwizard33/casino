import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  amount: { type: Number, required: true },
  date_time: { type: Date, default: Date.now() }
});

export default mongoose.model('CoinTransfer', userSchema);

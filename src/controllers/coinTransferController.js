import User from '../models/User.js';
import CoinTransfer from '../models/CoinTransfers.js';

const coinTransfer = async (req, res) => {
  const { sender_id, receiver_id, amount } = req.body;
  
  const sender = await User.findById(sender_id);

  if (sender.balance < amount) {
    return res.json({ message: 'No availabel coins' });
  }
  const receiver = await User.findById(receiver_id);

  const sBalance = sender.balance - amount;
  sender.balance = sBalance;
  await sender.save();

  const rBalance = receiver.balance + amount;
  receiver.balance = rBalance;
  await receiver.save();

  const transaction = new CoinTransfer({
    sender: sender_id,
    receiver: receiver_id,
    amount: amount
  });
  await transaction.save();

  return res.json({ message: 'Transfer success!' });
};

export { coinTransfer };

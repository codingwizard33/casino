import User from '../models/User.js';
import CoinTransfer from '../models/CoinTransfers.js';
import CoinWallet from '../models/CoinWallet.js';

const coinTransfer = async (req, res) => {
  const { sender_id, receiver_id, amount } = req.body;
  
  const senderWallet = await CoinWallet.findByOne({ sender_id });
  const receiverWallet = await CoinWallet.findByOne({ receiver_id });
  
  senderWallet.amount -= amount;
  await senderWallet.save();

  receiverWallet += amount;
  await receiverWallet.save();

  const transfer = new CoinTransfer({
    sender: sender_id,
    receiver: receiver_id,
    amount: amount
  });
  transfer.save();

  return res.json({ message: 'Transfer success!' });
};

export { coinTransfer };

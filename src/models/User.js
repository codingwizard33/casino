import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  first_name: { type: String, required: false },
  last_name: { type: String, required: false },
  country: { type: String, required: false },
  date_of_birth: { type: Date, required: false },
  isVerified: { type: Boolean, default: false },
  player_agent: { type: String, required: false },
  reset_token: { type: String, required: false },
  user_role: { type: String, required: false },
  super_agents: { type: Array, required: false },
  agents: { type: Array, required: false },
  players: { type: Array, required: false }
});

export default mongoose.model('User', userSchema);

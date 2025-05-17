import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  name: String,
  birthday: String,
  type: String,
  account: String,
  balance: String,
});

export default mongoose.models.Client || mongoose.model('Client', ClientSchema);

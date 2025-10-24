import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  authId: { type: String, required: true, unique: true }, // Clerk auth ID
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
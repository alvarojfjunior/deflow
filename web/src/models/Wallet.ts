import mongoose from 'mongoose';

const encryptedSecretSchema = new mongoose.Schema(
  {
    algo: { type: String, required: true },
    version: { type: Number, required: true },
    iv: { type: String, required: true },
    tag: { type: String, required: true },
    ciphertext: { type: String, required: true }
  },
  { _id: false }
);

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  blockchain: { type: String, required: true, enum: ['solana'] },
  secret: { type: encryptedSecretSchema, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

walletSchema.index({ userId: 1, name: 1 }, { unique: true });

walletSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);
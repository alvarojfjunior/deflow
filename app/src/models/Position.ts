import mongoose from 'mongoose';

const positionSchema = new mongoose.Schema({
  botId: { type: mongoose.Schema.Types.ObjectId, ref: 'Automation', required: true },
  chain: { type: String, required: true },
  dex: { type: String, required: true },
  poolId: { type: String, required: true },
  tokens: [{
    symbol: String,
    address: String,
    amount: String,
  }],
  liquidityId: { type: String, required: true },
  amounts: [{
    token: String,
    amount: String,
  }],
  rangeConfig: {
    min: Number,
    max: Number,
  },
  pnl: {
    realized: String,
    unrealized: String,
    timestamp: Date,
  },
  ilEstimate: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

positionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Position = mongoose.models.Position || mongoose.model('Position', positionSchema);
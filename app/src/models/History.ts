import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  automationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Automation', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  params: { type: mongoose.Schema.Types.Mixed, default: {} },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

historySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const History = mongoose.models.History || mongoose.model('History', historySchema);

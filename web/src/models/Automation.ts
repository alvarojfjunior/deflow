import mongoose from 'mongoose';


const strategySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    params: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { _id: false }
);


const automationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  strategy: { type: strategySchema, required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  interval: { type: Number, required: true, default: 600000 }, // 10 minutos em milissegundos
  status: {
    type: String,
    enum: ['active', 'paused', 'error'],
    default: 'paused'
  },
  lastHeartbeatAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

automationSchema.index({ userId: 1, name: 1 });

automationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Automation = mongoose.models.Automation || mongoose.model('Automation', automationSchema);

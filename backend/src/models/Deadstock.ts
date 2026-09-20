import mongoose, { Schema, Document } from 'mongoose';

export interface IDeadstock {
  deadstockId: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalLoss: number;
  expiryDate: Date;
  detectedAt?: Date;
  disposedAt?: Date;
  status: 'pending_disposal' | 'disposed';
}

export type DeadstockDocument = IDeadstock & Document;

const DeadstockSchema = new Schema<IDeadstock>({
  deadstockId: { type: String, required: true, unique: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalLoss: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  detectedAt: { type: Date, default: Date.now },
  disposedAt: { type: Date, required: false },
  status: {
    type: String,
    enum: ['pending_disposal', 'disposed'],
    default: 'pending_disposal'
  }
});

DeadstockSchema.index({ status: 1 });
DeadstockSchema.index({ detectedAt: 1 });

export const Deadstock = mongoose.models.Deadstock || mongoose.model<IDeadstock>('Deadstock', DeadstockSchema);
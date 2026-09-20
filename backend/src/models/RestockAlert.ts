import mongoose, { Schema, Document } from 'mongoose';

export interface IRestockAlert {
  alertId: string;
  productId: string;
  productName: string;
  currentStock: number;
  reorderThreshold: number;
  status: 'open' | 'resolved';
  createdAt?: Date;
}

export type RestockAlertDocument = IRestockAlert & Document;

const RestockAlertSchema = new Schema<IRestockAlert>({
  alertId: { type: String, required: true, unique: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  currentStock: { type: Number, required: true },
  reorderThreshold: { type: Number, required: true },
  status: {
    type: String,
    enum: ['open', 'resolved'],
    default: 'open'
  },
  createdAt: { type: Date, default: Date.now }
});

RestockAlertSchema.index({ status: 1 });

export const RestockAlert = mongoose.models.RestockAlert || mongoose.model<IRestockAlert>('RestockAlert', RestockAlertSchema);
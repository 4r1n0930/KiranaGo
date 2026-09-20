import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface IOrder {
  orderId: string;
  customerId: string;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderDocument = IOrder & Document;

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    customerId: { type: String, required: true, ref: 'Customer' },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed'
    }
  },
  { timestamps: true }
);

OrderSchema.index({ customerId: 1 });
OrderSchema.index({ status: 1 });

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
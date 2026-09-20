import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct {
  productId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorderThreshold: number;
  expiryDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductDocument = IProduct & Document;

const ProductSchema = new Schema<IProduct>(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    reorderThreshold: { type: Number, required: true, min: 0, default: 10 },
    expiryDate: { type: Date, required: false }
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text' });
ProductSchema.index({ expiryDate: 1 });
ProductSchema.index({ stock: 1 });

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer {
  customerId: string;
  phone: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CustomerDocument = ICustomer & Document;

const CustomerSchema = new Schema<ICustomer>(
  {
    customerId: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: false }
  },
  { timestamps: true }
);

export const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
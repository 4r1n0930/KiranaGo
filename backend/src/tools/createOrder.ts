import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { OrderItem, CreatedOrder } from './types';

export async function createOrder(
  customerId: string,
  items: OrderItem[]
): Promise<CreatedOrder> {
  const session = await mongoose.startSession();

  try {
    let result: CreatedOrder | null = null;

    await session.withTransaction(async () => {
      const orderItems: {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
      }[] = [];

      let total = 0;

      for (const item of items) {
        let product = null;

        if (item.productId) {
          product = await Product.findOne({ productId: item.productId }).session(session);
        } else if (item.productName || item.product) {
          const searchName = item.productName || item.product || '';
          product = await Product.findOne({
            $text: { $search: searchName }
          }).session(session);

          if (!product) {
            product = await Product.findOne({
              name: { $regex: new RegExp(searchName, 'i') }
            }).session(session);
          }
        }

        if (!product) {
          throw new Error(`PRODUCT_NOT_FOUND:${item.productName || item.productId || 'Unknown'}`);
        }

        if (product.stock < item.quantity) {
          const err = new Error(`INSUFFICIENT_STOCK:${product.productId}`);
          (err as any).productId = product.productId;
          throw err;
        }

        const unitPrice = item.unitPrice ?? product.price;
        const lineTotal = item.quantity * unitPrice;
        total += lineTotal;

        orderItems.push({
          productId: product.productId,
          productName: product.name,
          quantity: item.quantity,
          unitPrice
        });
      }

      const orderId = `ORD-${Date.now()}`;

      await Order.create(
        [
          {
            orderId,
            customerId,
            items: orderItems,
            total,
            status: 'confirmed'
          }
        ],
        { session }
      );

      result = {
        success: true,
        orderId,
        items: orderItems,
        total,
        status: 'confirmed'
      };
    });

    session.endSession();
    return result || { success: false, reason: 'Failed to create order' };
  } catch (error: any) {
    session.endSession();

    if (error.message?.startsWith('INSUFFICIENT_STOCK:')) {
      return {
        success: false,
        reason: 'Insufficient stock',
        productId: error.productId || error.message.split(':')[1]
      };
    }

    if (error.message?.startsWith('PRODUCT_NOT_FOUND:')) {
      return {
        success: false,
        reason: `Product not found: ${error.message.split(':')[1]}`
      };
    }

    // If transactions are not supported by MongoDB deployment (standalone mode without replica set), perform non-transactional fallback
    if (error.message?.includes('replica set') || error.message?.includes('Transaction numbers')) {
      return await createOrderNonTransactional(customerId, items);
    }

    return {
      success: false,
      reason: error.message || 'Error executing order transaction'
    };
  }
}

async function createOrderNonTransactional(
  customerId: string,
  items: OrderItem[]
): Promise<CreatedOrder> {
  const orderItems: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[] = [];

  let total = 0;

  for (const item of items) {
    let product = null;

    if (item.productId) {
      product = await Product.findOne({ productId: item.productId });
    } else if (item.productName || item.product) {
      const searchName = item.productName || item.product || '';
      product = await Product.findOne({ $text: { $search: searchName } });
      if (!product) {
        product = await Product.findOne({
          name: { $regex: new RegExp(searchName, 'i') }
        });
      }
    }

    if (!product) {
      return {
        success: false,
        reason: `Product not found: ${item.productName || item.productId}`
      };
    }

    if (product.stock < item.quantity) {
      return {
        success: false,
        reason: 'Insufficient stock',
        productId: product.productId
      };
    }

    const unitPrice = item.unitPrice ?? product.price;
    total += item.quantity * unitPrice;

    orderItems.push({
      productId: product.productId,
      productName: product.name,
      quantity: item.quantity,
      unitPrice
    });
  }

  const orderId = `ORD-${Date.now()}`;

  await Order.create({
    orderId,
    customerId,
    items: orderItems,
    total,
    status: 'confirmed'
  });

  return {
    success: true,
    orderId,
    items: orderItems,
    total,
    status: 'confirmed'
  };
}
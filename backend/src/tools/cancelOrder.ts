import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { updateStock } from './updateStock';

export async function cancelOrder(
  orderId: string
): Promise<{ success: boolean; orderId?: string; reason?: string }> {
  const order = await Order.findOne({ orderId });

  if (!order) {
    return { success: false, reason: 'Order not found' };
  }

  if (order.status !== 'confirmed') {
    return {
      success: false,
      reason: `Cannot cancel order with status: ${order.status}`
    };
  }

  const session = await mongoose.startSession();

  try {
    let result = false;

    await session.withTransaction(async () => {
      for (const item of order.items) {
        await updateStock(item.productId, item.quantity);
      }

      order.status = 'cancelled';
      await order.save({ session });
      result = true;
    });

    session.endSession();
    return { success: true, orderId };
  } catch (error: any) {
    session.endSession();

    // Fallback if standalone MongoDB does not support transactions
    if (error.message?.includes('replica set') || error.message?.includes('Transaction numbers')) {
      return await cancelOrderNonTransactional(order);
    }

    return {
      success: false,
      reason: error.message || 'Failed to cancel order'
    };
  }
}

async function cancelOrderNonTransactional(
  order: any
): Promise<{ success: boolean; orderId?: string; reason?: string }> {
  try {
    for (const item of order.items) {
      await updateStock(item.productId, item.quantity);
    }

    order.status = 'cancelled';
    await order.save();

    return { success: true, orderId: order.orderId };
  } catch (error: any) {
    return {
      success: false,
      reason: error.message || 'Failed to cancel order'
    };
  }
}
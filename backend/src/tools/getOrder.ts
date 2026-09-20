import { Order } from '../models/Order';

export async function getOrder(orderId: string): Promise<any> {
  const order = await Order.findOne({ orderId });
  if (!order) {
    return { found: false };
  }
  return {
    found: true,
    order: order.toObject()
  };
}
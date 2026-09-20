import mongoose from 'mongoose';
import { ResolvedItem } from '../agents/types';
import { Product } from '../models/Product';
import { createOrder } from '../tools/createOrder';
import { updateStock } from '../tools/updateStock';
import { createRestockAlert } from '../tools/createRestockAlert';

export interface OrderResult {
  success: boolean;
  orderId?: string;
  items?: ResolvedItem[];
  total?: number;
  restockAlerts?: string[];
  reason?: string;
}

export async function executeOrder(
  customerId: string,
  items: ResolvedItem[]
): Promise<OrderResult> {
  const session = await mongoose.startSession();

  try {
    let result: OrderResult | null = null;

    await session.withTransaction(async () => {
      const restockAlerts: string[] = [];

      // 1. Re-validate stock for all items
      for (const item of items) {
        const product = await Product.findOne({ productId: item.productId }).session(session);
        if (!product || product.stock < item.quantity) {
          throw new Error(
            `INSUFFICIENT_STOCK:${item.productName} (Requested: ${item.quantity}, Stock: ${product?.stock ?? 0})`
          );
        }
      }

      // 2. Calculate total
      const total = items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );

      // 3. Create Order
      const createdOrder = await createOrder(customerId, items);
      if (!createdOrder.success || !createdOrder.orderId) {
        throw new Error(createdOrder.reason || 'Failed to create order record');
      }

      // 4. Update Stock for each item
      for (const item of items) {
        const stockResult = await updateStock(item.productId, -item.quantity);

        // 5. Check if newStock < reorderThreshold
        const product = await Product.findOne({ productId: item.productId }).session(session);
        const threshold = product ? product.reorderThreshold : 10;

        if (stockResult.newStock < threshold) {
          try {
            const alertRes = await createRestockAlert(item.productId, stockResult.newStock);
            if (alertRes.alertId) {
              restockAlerts.push(alertRes.alertId);
            }
          } catch (warn) {
            console.warn(`[OrderWorkflow] Warning creating restock alert for ${item.productId}:`, warn);
          }
        }
      }

      result = {
        success: true,
        orderId: createdOrder.orderId,
        items,
        total,
        restockAlerts
      };
    });

    session.endSession();
    return result || { success: false, reason: 'Transaction failed' };
  } catch (error: any) {
    session.endSession();

    // Fallback if standalone MongoDB does not support multi-document transactions
    if (error.message?.includes('replica set') || error.message?.includes('Transaction numbers')) {
      return await executeOrderNonTransactional(customerId, items);
    }

    return {
      success: false,
      reason: error.message || 'Error executing order'
    };
  }
}

async function executeOrderNonTransactional(
  customerId: string,
  items: ResolvedItem[]
): Promise<OrderResult> {
  try {
    const restockAlerts: string[] = [];

    // 1. Re-validate stock
    for (const item of items) {
      const product = await Product.findOne({ productId: item.productId });
      if (!product || product.stock < item.quantity) {
        return {
          success: false,
          reason: `Insufficient stock for ${item.productName}`
        };
      }
    }

    // 2. Calculate total
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    // 3. Create Order
    const createdOrder = await createOrder(customerId, items);
    if (!createdOrder.success || !createdOrder.orderId) {
      return {
        success: false,
        reason: createdOrder.reason || 'Failed to create order record'
      };
    }

    // 4. Update Stock
    for (const item of items) {
      const stockResult = await updateStock(item.productId, -item.quantity);

      const product = await Product.findOne({ productId: item.productId });
      const threshold = product ? product.reorderThreshold : 10;

      if (stockResult.newStock < threshold) {
        try {
          const alertRes = await createRestockAlert(item.productId, stockResult.newStock);
          if (alertRes.alertId) {
            restockAlerts.push(alertRes.alertId);
          }
        } catch (warn) {
          console.warn(`[OrderWorkflow] Warning creating restock alert for ${item.productId}:`, warn);
        }
      }
    }

    return {
      success: true,
      orderId: createdOrder.orderId,
      items,
      total,
      restockAlerts
    };
  } catch (err: any) {
    return {
      success: false,
      reason: err.message || 'Error executing order non-transactionally'
    };
  }
}

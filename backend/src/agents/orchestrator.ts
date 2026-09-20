import { StructuredRequest, OrchestratorInstruction, SessionState, ResolvedItem } from './types';
import { resolveProductName } from '../tools/resolveProductName';
import { checkInventory } from '../tools/checkInventory';
import { findAlternatives } from '../tools/findAlternatives';
import { cancelOrder } from '../tools/cancelOrder';
import { executeOrder } from '../workflows/orderWorkflow';

export async function processRequest(
  request: StructuredRequest,
  session: SessionState
): Promise<OrchestratorInstruction> {
  // Handle state context where customer responds with quantity for a pending product
  if (session.pendingProduct && session.awaitingField === 'quantity') {
    const rawNumberMatch = request.rawText.match(/\d+/);
    if (rawNumberMatch) {
      const quantity = parseInt(rawNumberMatch[0], 10);
      request.intent = 'create_order';
      request.items = [{ product: session.pendingProduct, quantity }];
      session.pendingProduct = undefined;
      session.awaitingField = undefined;
    }
  }

  switch (request.intent) {
    case 'create_order': {
      if (!request.items || request.items.length === 0) {
        return {
          action: 'ASK_CUSTOMER',
          context: { message: 'Aapko kaunsa item chahiye?' }
        };
      }

      // Check if any item has missing quantity
      const itemWithMissingQty = request.items.find(
        (item) => item.quantity === null || item.quantity <= 0
      );

      if (itemWithMissingQty) {
        session.pendingProduct = itemWithMissingQty.product;
        session.awaitingField = 'quantity';
        return {
          action: 'ASK_CUSTOMER',
          context: {
            missing: ['quantity'],
            product: itemWithMissingQty.product
          }
        };
      }

      const resolvedItems: ResolvedItem[] = [];

      for (const item of request.items) {
        const productInfo = await resolveProductName(item.product);

        if (!productInfo) {
          const alternatives = await findAlternatives(item.product);
          return {
            action: 'ASK_CUSTOMER',
            context: { product: item.product, reason: 'not_found' },
            alternatives
          };
        }

        const invCheck = await checkInventory(productInfo.productName, item.quantity!);

        if (!invCheck.available) {
          const alternatives = await findAlternatives(productInfo.productName);
          return {
            action: 'OUT_OF_STOCK',
            context: {
              product: productInfo.productName,
              requested: item.quantity,
              availableStock: invCheck.stock
            },
            alternatives
          };
        }

        resolvedItems.push({
          productId: productInfo.productId,
          productName: productInfo.productName,
          quantity: item.quantity!,
          unitPrice: productInfo.unitPrice
        });
      }

      // Execute order via workflow
      const orderResult = await executeOrder(session.customerId, resolvedItems);

      if (!orderResult.success) {
        return {
          action: 'ERROR',
          message: orderResult.reason || 'Failed to place order'
        };
      }

      return {
        action: 'ORDER_CONFIRMED',
        context: {
          orderId: orderResult.orderId,
          total: orderResult.total,
          items: orderResult.items
        }
      };
    }

    case 'check_stock': {
      if (!request.items || request.items.length === 0) {
        return {
          action: 'ASK_CUSTOMER',
          context: { message: 'Aap kis product ka stock check karna chahte hain?' }
        };
      }

      const targetProduct = request.items[0].product;
      const productInfo = await resolveProductName(targetProduct);

      if (!productInfo) {
        const alternatives = await findAlternatives(targetProduct);
        return {
          action: 'ASK_CUSTOMER',
          context: { product: targetProduct, found: false },
          alternatives
        };
      }

      const invCheck = await checkInventory(
        productInfo.productName,
        request.items[0].quantity || 1
      );

      return {
        action: 'ASK_CUSTOMER',
        context: {
          product: productInfo.productName,
          found: true,
          stock: invCheck.stock,
          price: productInfo.unitPrice,
          available: invCheck.available
        }
      };
    }

    case 'cancel_order': {
      if (!request.orderId) {
        return {
          action: 'ASK_CUSTOMER',
          context: { missing: ['orderId'], message: 'Kripya apna order ID bataye.' }
        };
      }

      const cancelResult = await cancelOrder(request.orderId);

      if (!cancelResult.success) {
        return {
          action: 'ERROR',
          message: cancelResult.reason || 'Order cancel nahi ho paya.'
        };
      }

      return {
        action: 'ORDER_CANCELLED',
        context: { orderId: request.orderId }
      };
    }

    case 'other':
    default: {
      return {
        action: 'ASK_CUSTOMER',
        context: { message: 'Main aapki orders, stock check ya order cancellation me madad kar sakta hu.' }
      };
    }
  }
}

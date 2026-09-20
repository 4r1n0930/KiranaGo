import { RestockAlert } from '../models/RestockAlert';
import { Product } from '../models/Product';
import { RestockAlertResult } from './types';

export async function createRestockAlert(
  productId: string,
  currentStock: number
): Promise<RestockAlertResult> {
  const existingOpenAlert = await RestockAlert.findOne({
    productId,
    status: 'open'
  });

  if (existingOpenAlert) {
    return { created: false, alertId: existingOpenAlert.alertId };
  }

  const product = await Product.findOne({ productId });
  if (!product) {
    return { created: false };
  }

  const alertId = `ALERT-${Date.now()}`;

  await RestockAlert.create({
    alertId,
    productId,
    productName: product.name,
    currentStock,
    reorderThreshold: product.reorderThreshold,
    status: 'open'
  });

  return { created: true, alertId };
}
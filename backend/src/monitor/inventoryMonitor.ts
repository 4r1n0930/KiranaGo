import { Product } from '../models/Product';
import { Deadstock } from '../models/Deadstock';
import { RestockAlert } from '../models/RestockAlert';
import { updateStock } from '../tools/updateStock';
import { getLowStockProducts } from '../tools/getLowStockProducts';
import { createRestockAlert } from '../tools/createRestockAlert';
import { sendShopkeeperAlert } from '../whatsapp/sender';

export async function runExpiryMonitor(): Promise<void> {
  console.log('[InventoryMonitor] Running expiry monitor...');
  const today = new Date();

  const expiredProducts = await Product.find({
    expiryDate: { $lte: today },
    stock: { $gt: 0 }
  });

  let expiredCount = 0;
  let totalLossINR = 0;

  for (const product of expiredProducts) {
    const quantity = product.stock;
    const unitPrice = product.price;
    const totalLoss = quantity * unitPrice;

    const deadstockId = `DEAD-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // 1. Insert Deadstock record
    await Deadstock.create({
      deadstockId,
      productId: product.productId,
      productName: product.name,
      category: product.category,
      quantity,
      unitPrice,
      totalLoss,
      expiryDate: product.expiryDate!,
      status: 'pending_disposal'
    });

    // 2. Zero out stock
    await updateStock(product.productId, -quantity);

    // 3. Alert shopkeeper
    await sendShopkeeperAlert('expiry', {
      productName: product.name,
      quantity,
      expiryDate: product.expiryDate ? product.expiryDate.toISOString().split('T')[0] : '',
      totalLoss
    });

    expiredCount++;
    totalLossINR += totalLoss;
  }

  console.log('[InventoryMonitor] Expiry monitor summary:', {
    scanned: expiredProducts.length,
    expired: expiredCount,
    totalLossINR
  });
}

export async function runLowStockMonitor(): Promise<void> {
  console.log('[InventoryMonitor] Running low stock monitor...');

  const lowStockItems = await getLowStockProducts();
  let alertedCount = 0;

  for (const item of lowStockItems) {
    const existingOpenAlert = await RestockAlert.findOne({
      productId: item.productId,
      status: 'open'
    });

    if (!existingOpenAlert) {
      await createRestockAlert(item.productId, item.stock);
      await sendShopkeeperAlert('low_stock', {
        productName: item.productName,
        stock: item.stock,
        reorderThreshold: item.reorderThreshold
      });
      alertedCount++;
    }
  }

  console.log('[InventoryMonitor] Low stock monitor summary:', {
    checked: lowStockItems.length,
    alerted: alertedCount
  });
}

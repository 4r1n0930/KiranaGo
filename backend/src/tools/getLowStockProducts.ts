import { Product } from '../models/Product';
import { LowStockProduct } from './types';

export async function getLowStockProducts(): Promise<LowStockProduct[]> {
  const products = await Product.find({
    $expr: {
      $and: [
        { $gt: ['$stock', 0] },
        { $lt: ['$stock', '$reorderThreshold'] }
      ]
    }
  });

  return products.map((p) => ({
    productId: p.productId,
    productName: p.name,
    stock: p.stock,
    reorderThreshold: p.reorderThreshold
  }));
}
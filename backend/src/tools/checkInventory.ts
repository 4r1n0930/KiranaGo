import { Product } from '../models/Product';
import { InventoryCheckResult } from './types';

export async function checkInventory(
  productName: string,
  quantity: number
): Promise<InventoryCheckResult> {
  let product = await Product.findOne({ $text: { $search: productName } });

  if (!product) {
    // Fallback regex if text index didn't match exact phrase
    product = await Product.findOne({
      name: { $regex: new RegExp(productName, 'i') }
    });
  }

  if (!product) {
    return { found: false, productName };
  }

  const available = product.stock >= quantity;

  return {
    found: true,
    available,
    productId: product.productId,
    productName: product.name,
    stock: product.stock,
    requested: quantity,
    unitPrice: product.price
  };
}
import { Product } from '../models/Product';
import { StockUpdateResult } from './types';

export async function updateStock(
  productId: string,
  delta: number
): Promise<StockUpdateResult> {
  const currentProduct = await Product.findOne({ productId });

  if (!currentProduct) {
    throw new Error(`Product not found with ID: ${productId}`);
  }

  if (delta < 0 && currentProduct.stock < Math.abs(delta)) {
    throw new Error(
      `Cannot update stock for ${productId}: Current stock (${currentProduct.stock}) is insufficient for reduction of ${Math.abs(delta)}.`
    );
  }

  const query: any = { productId };
  if (delta < 0) {
    query.stock = { $gte: Math.abs(delta) };
  }

  const updatedProduct = await Product.findOneAndUpdate(
    query,
    { $inc: { stock: delta } },
    { new: true }
  );

  if (!updatedProduct) {
    throw new Error(
      `Stock update rejected for product ${productId}. Insufficient stock to decrement by ${Math.abs(delta)}.`
    );
  }

  return {
    productId,
    previousStock: currentProduct.stock,
    newStock: updatedProduct.stock,
    delta
  };
}
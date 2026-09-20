import { Product } from '../models/Product';
import { ResolvedProduct } from './types';

export async function resolveProductName(
  query: string
): Promise<ResolvedProduct | null> {
  if (!query || !query.trim()) {
    return null;
  }

  const cleanQuery = query.trim();

  let product = await Product.findOne({
    $text: { $search: cleanQuery }
  });

  if (!product) {
    product = await Product.findOne({
      name: { $regex: new RegExp(cleanQuery, 'i') }
    });
  }

  if (!product) {
    return null;
  }

  return {
    productId: product.productId,
    productName: product.name,
    category: product.category,
    stock: product.stock,
    unitPrice: product.price
  };
}
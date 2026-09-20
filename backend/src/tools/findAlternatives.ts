import { Product } from '../models/Product';
import { AlternativeProduct } from './types';

export async function findAlternatives(
  productName: string
): Promise<AlternativeProduct[]> {
  let product = await Product.findOne({ $text: { $search: productName } });

  if (!product) {
    product = await Product.findOne({
      name: { $regex: new RegExp(productName, 'i') }
    });
  }

  if (!product) {
    return [];
  }

  const alternatives = await Product.find({
    category: product.category,
    stock: { $gt: 0 },
    productId: { $ne: product.productId }
  }).limit(3);

  return alternatives.map((alt) => ({
    productId: alt.productId,
    productName: alt.name,
    stock: alt.stock,
    unitPrice: alt.price
  }));
}
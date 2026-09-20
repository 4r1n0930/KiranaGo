import { InventoryResult, ResolvedItem } from './types';
import { checkInventory } from '../tools/checkInventory';
import { findAlternatives } from '../tools/findAlternatives';
import { resolveProductName } from '../tools/resolveProductName';

export async function checkAndAlternatives(
  productName: string,
  quantity: number
): Promise<InventoryResult> {
  const invCheck = await checkInventory(productName, quantity);

  if (invCheck.found && invCheck.available) {
    return {
      status: 'available',
      product: {
        productId: invCheck.productId!,
        productName: invCheck.productName!,
        stock: invCheck.stock!,
        unitPrice: invCheck.unitPrice!
      },
      alternatives: []
    };
  }

  const alternatives = await findAlternatives(productName);

  return {
    status: invCheck.found ? 'unavailable' : 'not_found',
    product: invCheck.found
      ? {
          productId: invCheck.productId!,
          productName: invCheck.productName!,
          stock: invCheck.stock!,
          unitPrice: invCheck.unitPrice!
        }
      : undefined,
    alternatives
  };
}

export async function resolveItems(
  items: { product: string; quantity: number }[]
): Promise<ResolvedItem[]> {
  const resolvedList: ResolvedItem[] = [];

  for (const item of items) {
    const resolvedProduct = await resolveProductName(item.product);

    if (!resolvedProduct) {
      const alternatives = await findAlternatives(item.product);
      resolvedList.push({
        productId: '',
        productName: item.product,
        quantity: item.quantity,
        unitPrice: 0,
        available: false,
        stock: 0,
        alternatives
      });
      continue;
    }

    const invCheck = await checkInventory(resolvedProduct.productName, item.quantity);
    const alternatives = !invCheck.available
      ? await findAlternatives(resolvedProduct.productName)
      : [];

    resolvedList.push({
      productId: resolvedProduct.productId,
      productName: resolvedProduct.productName,
      quantity: item.quantity,
      unitPrice: resolvedProduct.unitPrice,
      available: invCheck.available,
      stock: invCheck.stock,
      alternatives
    });
  }

  return resolvedList;
}
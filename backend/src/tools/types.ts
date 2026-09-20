export interface OrderItem {
  productId?: string;
  productName?: string;
  product?: string;
  quantity: number;
  unitPrice?: number;
}

export interface InventoryCheckResult {
  found: boolean;
  available?: boolean;
  productId?: string;
  productName?: string;
  stock?: number;
  requested?: number;
  unitPrice?: number;
}

export interface AlternativeProduct {
  productId: string;
  productName: string;
  stock: number;
  unitPrice: number;
}

export interface CreatedOrder {
  success: boolean;
  orderId?: string;
  items?: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
  total?: number;
  status?: string;
  reason?: string;
  productId?: string;
}

export interface StockUpdateResult {
  productId: string;
  previousStock: number;
  newStock: number;
  delta: number;
}

export interface RestockAlertResult {
  created: boolean;
  alertId?: string;
}

export interface ResolvedProduct {
  productId: string;
  productName: string;
  category: string;
  stock: number;
  unitPrice: number;
}

export interface LowStockProduct {
  productId: string;
  productName: string;
  stock: number;
  reorderThreshold: number;
}

export interface ImportResult {
  total: number;
  inserted: number;
  updated: number;
  failed: {
    row: number;
    data: any;
    reason: string;
  }[];
}
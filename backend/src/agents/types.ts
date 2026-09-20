import { AlternativeProduct } from '../tools/types';

export interface StructuredRequestItem {
  product: string;
  quantity: number | null;
}

export interface StructuredRequest {
  intent: 'create_order' | 'check_stock' | 'cancel_order' | 'other';
  items: StructuredRequestItem[];
  orderId: string | null;
  rawText: string;
}

export interface OrchestratorInstruction {
  action: 'ASK_CUSTOMER' | 'ORDER_CONFIRMED' | 'OUT_OF_STOCK' | 'ORDER_CANCELLED' | 'ERROR';
  context?: any;
  alternatives?: AlternativeProduct[];
  message?: string;
}

export interface SessionState {
  customerId: string;
  pendingOrder?: any;
  awaitingField?: string;
  pendingProduct?: string;
  lastUpdated: Date;
}

export interface ResolvedItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  available?: boolean;
  stock?: number;
  alternatives?: AlternativeProduct[];
}

export interface InventoryResult {
  status: 'available' | 'unavailable' | 'not_found';
  product?: {
    productId: string;
    productName: string;
    stock: number;
    unitPrice: number;
  };
  alternatives: AlternativeProduct[];
}
import { Router, Request, Response } from 'express';
import { Customer } from '../models/Customer';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { RestockAlert } from '../models/RestockAlert';
import { Deadstock } from '../models/Deadstock';
import { parseMessage, formatResponse } from '../agents/conversationAgent';
import { getSession } from '../agents/session';
import { processRequest } from '../agents/orchestrator';

const router = Router();

function formatDateTime(value: Date | string | undefined): string {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  const datePart = date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  return `${datePart} ${timePart}`;
}

function timeAgo(value: Date | string | undefined): string {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function statusLabel(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'Confirmed';
    case 'cancelled':
      return 'Cancelled';
    case 'pending':
      return 'Pending';
    default:
      return status;
  }
}

function inferUnit(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('kg')) return 'kg';
  if (n.includes('ml')) return 'ml';
  if (n.includes(' l') || n.includes('litre') || n.includes('liter')) return 'L';
  if (n.includes('pack')) return 'pack';
  if (n.includes('box')) return 'box';
  if (n.includes('g ')) return 'g';
  return 'units';
}

function inventoryStatus(stock: number, reorderThreshold: number): string {
  if (stock <= 0) return 'Critical';
  if (stock < reorderThreshold) return 'Low Stock';
  return 'In Stock';
}

function serializeOrder(order: any, customer?: any) {
  return {
    orderId: order.orderId,
    customerId: order.customerId,
    customerName: customer?.name || 'Walk-in Customer',
    phone: customer?.phone || '',
    date: formatDateTime(order.createdAt),
    status: statusLabel(order.status),
    total: order.total,
    items: (order.items || []).map((item: any) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.unitPrice
    }))
  };
}

router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  const message = (req.body?.message || '').toString().trim();
  const customerId = (req.body?.customerId || '').toString().trim() || `CUST-WEB-${Date.now()}`;
  const channel = (req.body?.channel || 'web_chat').toString().trim();

  if (!message) {
    res.status(400).json({ error: 'message is required' });
    return;
  }

  try {
    let customer = await Customer.findOne({ customerId });
    if (!customer) {
      customer = await Customer.create({
        customerId,
        phone: `web-${customerId.toLowerCase()}`
      });
    }

    const structuredRequest = await parseMessage(message, customer.customerId);
    const session = getSession(customer.customerId);
    const instruction = await processRequest(structuredRequest, session);
    const reply = await formatResponse(instruction);

    let extractedItems: any[] = [];
    let total: number | null = null;
    let orderId: string | null = null;
    let status: string | null = null;

    if (instruction.action === 'ORDER_CONFIRMED') {
      const context = instruction.context || {};
      orderId = context.orderId || null;
      total = typeof context.total === 'number' ? context.total : null;
      status = 'Pending';
      extractedItems = Array.isArray(context.items)
        ? context.items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          }))
        : [];
    }

    res.json({ reply, extractedItems, total, orderId, status });
  } catch (error: any) {
    console.error('[API /chat] Error processing chat message:', error);
    res.status(500).json({ error: 'Failed to process message', details: error.message });
  }
});

router.get('/orders', async (req: Request, res: Response): Promise<void> => {
  const rawStatus = (req.query.status as string) || 'all';
  const limit = Math.min(parseInt((req.query.limit as string) || '20', 10) || 20, 100);
  const page = Math.max(parseInt((req.query.page as string) || '1', 10) || 1, 1);

  const query: any = {};
  if (rawStatus !== 'all' && rawStatus !== '') {
    query.status = rawStatus;
  }

  try {
    const [documents, totalCount] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Order.countDocuments(query)
    ]);

    const customerIds = Array.from(
      new Set(documents.map((order: any) => order.customerId).filter(Boolean))
    );
    const customers = customerIds.length
      ? await Customer.find({ customerId: { $in: customerIds } })
      : [];
    const customerMap = new Map(customers.map((customer) => [customer.customerId, customer]));

    const orders = documents.map((order: any) =>
      serializeOrder(order, customerMap.get(order.customerId))
    );

    res.json({ orders, totalCount });
  } catch (error: any) {
    console.error('[API /orders] Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

router.get('/orders/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const customer = await Customer.findOne({ customerId: order.customerId });
    const serialized = serializeOrder(order, customer);

    res.json({
      ...serialized,
      paymentDetails: {
        method: 'Udhar Ledger / Cash',
        isPaid: serialized.status === 'Confirmed'
      }
    });
  } catch (error: any) {
    console.error(`[API /orders/:id] Error fetching order ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch order', details: error.message });
  }
});

router.get('/inventory', async (req: Request, res: Response): Promise<void> => {
  const search = (req.query.search as string) || '';
  const category = (req.query.category as string) || 'all';

  const query: any = {};
  if (category !== 'all') query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };

  try {
    const products = await Product.find(query).sort({ name: 1 });

    const inventory = products.map((product: any) => ({
      id: product.productId,
      name: product.name,
      category: product.category,
      stock: product.stock,
      unit: inferUnit(product.name),
      price: `₹${product.price}`,
      status: inventoryStatus(product.stock, product.reorderThreshold)
    }));

    res.json(inventory);
  } catch (error: any) {
    console.error('[API /inventory] Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory', details: error.message });
  }
});

router.get('/alerts', async (req: Request, res: Response): Promise<void> => {
  const alerts: any[] = [];

  try {
    const restockAlerts = await RestockAlert.find({ status: 'open' })
      .sort({ createdAt: -1 })
      .limit(50);

    for (const alert of restockAlerts) {
      alerts.push({
        id: `RA-${alert.alertId}`,
        type: 'Restock Warning',
        severity: 'high',
        title: `${alert.productName} Running Out`,
        desc: `Stock reached ${alert.currentStock} units. Reorder threshold: ${alert.reorderThreshold}.`,
        time: timeAgo(alert.createdAt)
      });
    }

    const deadstock = await Deadstock.find({ status: 'pending_disposal' })
      .sort({ detectedAt: -1 })
      .limit(50);

    for (const entry of deadstock) {
      alerts.push({
        id: `DEAD-${entry.deadstockId}`,
        type: 'Expiry Notice',
        severity: 'medium',
        title: `${entry.productName} Expired`,
        desc: `${entry.quantity} units expired. Estimated loss: ₹${entry.totalLoss}.`,
        time: timeAgo(entry.detectedAt)
      });
    }

    res.json(alerts);
  } catch (error: any) {
    console.error('[API /alerts] Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts', details: error.message });
  }
});

export default router;
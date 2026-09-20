import axios from 'axios';

export interface LowStockPayload {
  productName: string;
  stock: number;
  reorderThreshold: number;
}

export interface ExpiryPayload {
  productName: string;
  quantity: number;
  expiryDate: string;
  totalLoss: number;
}

export type AlertPayload = LowStockPayload | ExpiryPayload;

export async function sendMessage(phone: string, text: string): Promise<void> {
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_TOKEN;

  if (!phoneId || !token) {
    console.warn(
      `[WhatsApp Sender] WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_TOKEN missing. Simulated send to ${phone}: "${text}"`
    );
    return;
  }

  const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;
  const body = {
    messaging_product: 'whatsapp',
    to: phone,
    type: 'text',
    text: { body: text }
  };
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    await axios.post(url, body, { headers });
    console.log(`[WhatsApp Sender] Message sent successfully to ${phone}`);
  } catch (error: any) {
    console.warn(`[WhatsApp Sender] First attempt failed. Retrying in 1000ms... Error:`, error.message);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      await axios.post(url, body, { headers });
      console.log(`[WhatsApp Sender] Retry succeeded for ${phone}`);
    } catch (retryError: any) {
      console.error(`[WhatsApp Sender] Failed to send message to ${phone}:`, retryError.message);
    }
  }
}

export async function sendShopkeeperAlert(
  type: 'low_stock' | 'expiry',
  payload: AlertPayload
): Promise<void> {
  const shopkeeperPhone = process.env.SHOPKEEPER_PHONE;

  if (!shopkeeperPhone) {
    console.warn('[WhatsApp Sender] SHOPKEEPER_PHONE not set. Alert content:', payload);
    return;
  }

  let text = '';

  if (type === 'low_stock') {
    const p = payload as LowStockPayload;
    text = `⚠️ Low stock: ${p.productName} has only ${p.stock} units left.\nReorder threshold: ${p.reorderThreshold}`;
  } else if (type === 'expiry') {
    const p = payload as ExpiryPayload;
    text = `🚨 Expired stock: ${p.productName} — ${p.quantity} units expired on ${p.expiryDate}.\nEstimated loss: ₹${p.totalLoss}. Moved to deadstock.`;
  }

  await sendMessage(shopkeeperPhone, text);
}

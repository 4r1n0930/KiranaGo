/**
 * KiranaGo Mock Data
 * Used for development and demonstrating the web app order workflows.
 */

export const MOCK_ORDERS = [
  {
    orderId: 'KG-1092',
    customerId: 'CUST-8801',
    customerName: 'Ramesh Verma',
    phone: '+91 98765 43210',
    date: '2026-09-20 11:30 AM',
    status: 'Completed',
    total: 585,
    items: [
      { productId: 'P-101', productName: 'Aashirvaad Whole Wheat Atta 10kg', quantity: 1, price: 440 },
      { productId: 'P-102', productName: 'Fortune Mustard Oil 1L', quantity: 1, price: 145 },
    ],
  },
  {
    orderId: 'KG-1093',
    customerId: 'CUST-8802',
    customerName: 'Priya Sharma',
    phone: '+91 98123 76543',
    date: '2026-09-20 12:15 PM',
    status: 'Ready for Pickup',
    total: 196,
    items: [
      { productId: 'P-103', productName: 'Tata Salt 1kg', quantity: 1, price: 28 },
      { productId: 'P-104', productName: 'Maggi 2-Minute Noodles 12-Pack', quantity: 1, price: 168 },
    ],
  },
  {
    orderId: 'KG-1094',
    customerId: 'CUST-8803',
    customerName: 'Anand Kumar',
    phone: '+91 97654 32109',
    date: '2026-09-20 01:05 PM',
    status: 'Pending',
    total: 535,
    items: [
      { productId: 'P-105', productName: 'Red Label Tea 500g', quantity: 1, price: 310 },
      { productId: 'P-106', productName: 'Madhur Sugar 5kg', quantity: 1, price: 225 },
    ],
  },
  {
    orderId: 'KG-1095',
    customerId: 'CUST-8804',
    customerName: 'Sunita Gupta',
    phone: '+91 99887 76655',
    date: '2026-09-20 01:40 PM',
    status: 'Processing',
    total: 340,
    items: [
      { productId: 'P-107', productName: 'Fortune Mustard Oil 2L', quantity: 1, price: 280 },
      { productId: 'P-108', productName: 'MDH Deggi Mirch 100g', quantity: 1, price: 60 },
    ],
  },
];

# KiranaGo Backend API Requirements & Specification

This document details the API endpoints assumed by the KiranaGo web application frontend.

---

## 1. Conversation Agent Endpoint

### `POST /api/chat`
- **Consumer Component**: `src/pages/app/Chat.jsx`
- **Description**: Processes raw customer voice transcript or text message, extracts structured inventory line items, updates customer tabs/orders, and returns the AI Conversation Agent's structured response.
- **Request Shape**:
  ```json
  {
    "message": "Send 2 bags Atta and 1L Mustard Oil to Ramesh",
    "customerId": "CUST-8801",
    "channel": "web_chat"
  }
  ```
- **Response Shape**:
  ```json
  {
    "reply": "Extracted items:\n• 1x Aashirvaad Whole Wheat Atta 10kg (₹440)\n• 1x Fortune Mustard Oil 1L (₹145)\n\nOrder total: ₹585. Added to queue for Ramesh Verma.",
    "extractedItems": [
      { "productId": "P-101", "productName": "Aashirvaad Whole Wheat Atta 10kg", "quantity": 1, "unitPrice": 440 },
      { "productId": "P-102", "productName": "Fortune Mustard Oil 1L", "quantity": 1, "unitPrice": 145 }
    ],
    "total": 585,
    "orderId": "KG-1096",
    "status": "Pending"
  }
  ```

---

## 2. Orders Endpoints

### `GET /api/orders`
- **Consumer Component**: `src/pages/app/Orders.jsx`, `src/pages/Orders.jsx`
- **Description**: Retrieves list of past customer orders and walk-in counter ledger entries.
- **Request Parameters**: `?status=all&limit=20&page=1`
- **Response Shape**:
  ```json
  {
    "orders": [
      {
        "orderId": "KG-1092",
        "customerId": "CUST-8801",
        "customerName": "Ramesh Verma",
        "phone": "+91 98765 43210",
        "date": "2026-09-20 11:30 AM",
        "status": "Completed",
        "total": 585,
        "items": [
          { "productId": "P-101", "productName": "Aashirvaad Whole Wheat Atta 10kg", "quantity": 1, "price": 440 },
          { "productId": "P-102", "productName": "Fortune Mustard Oil 1L", "quantity": 1, "price": 145 }
        ]
      }
    ],
    "totalCount": 1
  }
  ```

### `GET /api/orders/:id`
- **Consumer Component**: `src/pages/app/Orders.jsx`
- **Description**: Retrieves full itemized breakdown and audit trail for a single order by ID.
- **Request Parameters**: Path parameter `id` (e.g., `KG-1092`)
- **Response Shape**:
  ```json
  {
    "orderId": "KG-1092",
    "customerId": "CUST-8801",
    "customerName": "Ramesh Verma",
    "phone": "+91 98765 43210",
    "date": "2026-09-20 11:30 AM",
    "status": "Completed",
    "total": 585,
    "items": [
      { "productId": "P-101", "productName": "Aashirvaad Whole Wheat Atta 10kg", "quantity": 1, "price": 440 },
      { "productId": "P-102", "productName": "Fortune Mustard Oil 1L", "quantity": 1, "price": 145 }
    ],
    "paymentDetails": {
      "method": "Udhar Ledger / Cash",
      "isPaid": true
    }
  }
  ```

---

## 3. Inventory & Smart Restock Endpoints

### `GET /api/inventory`
- **Consumer Component**: `src/pages/Inventory.jsx`
- **Description**: Returns digital store stock inventory with status indicators (`Low Stock`, `Critical`, `In Stock`).
- **Request Parameters**: `?search=&category=all`
- **Response Shape**:
  ```json
  [
    { "id": 1, "name": "Aashirvaad Whole Wheat Atta 10kg", "category": "Staples", "stock": 4, "unit": "bags", "price": "₹440", "status": "Low Stock" }
  ]
  ```

### `GET /api/alerts`
- **Consumer Component**: `src/pages/Alerts.jsx`
- **Description**: Returns automated restock warnings, price fluctuation alerts, and udhar payment reminders.
- **Response Shape**:
  ```json
  [
    { "id": 1, "type": "Restock Warning", "severity": "high", "title": "Aashirvaad Atta Running Out", "desc": "Stock reached 4 bags.", "time": "10 mins ago" }
  ]
  ```

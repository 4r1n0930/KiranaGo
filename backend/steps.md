# KiranaGo Backend Implementation Steps

Stack: Node.js + TypeScript | Internal tool module (MCP-style) | Pure REST API | Gemini 3.6 Flash | MongoDB

## Phase 1 — Scaffold & Data Layer

1. Init TypeScript project (package.json, tsconfig, ESLint, .env, tsx dev script)
2. MongoDB connection module (mongoose or native driver) + config
3. Models/schemas: `Product`, `Order`, `Customer`, `RestockAlert`
4. Seed script with sample inventory (from CSV example)

## Phase 2 — MCP Tool Layer (deterministic, no LLM)

5. Tool registry + executor (`tools/index.ts` — name/schema/handler pattern)
6. `check_inventory` — available, stock, requested check
7. `find_alternatives` — same category, in-stock, excludes unavailable
8. `create_order` — builds order, computes total, generates `ORD-`
9. `update_stock` — decrement stock, set unavailable at 0
10. `get_order`, `cancel_order`
11. `create_restock_alert` — dedupe unresolved alerts
12. Tool-result shape contract (structured, no prose)

## Phase 3 — Agent Layer (Gemini 3.6 Flash)

13. LLM client wrapper (Gemini API key, prompt constants)
14. **Conversation Agent** — NL → structured request (`intent`, `items[]`, `customerId`)
15. **Conversation Agent reverse side** — `ASK_CUSTOMER`/confirmations → natural language response
16. **Inventory Agent** — product-name resolution + availability reasoning over tool results
17. Session store per customer (in-memory Map → Redis/Mongo later) for multi-turn `ASK_CUSTOMER` loop

## Phase 4 — Orchestrator

18. Orchestrator core: validate request → missing fields → `ASK_CUSTOMER`
19. Workflow: complete → inventory check → alternatives or create order → update stock → low-stock check → reply action
20. Action schema contract shared with agents (`ASK_CUSTOMER`, `CONFIRM_ORDER`, `ORDER_CREATED`, etc.)
21. Handlers for each action type (deterministic routing between agents/tools)

## Phase 5 — Inventory Monitor

22. Scheduled job (node-cron): expiry scan → mark unavailable → notify shopkeeper log
23. Scheduled low-stock scan → `create_restock_alert` → notify log
24. Separate from order flow

## Phase 6 — CSV Import

25. CSV parser + validation (header: productId,name,category,price,stock,reorderThreshold,expiryDate)
26. Bulk upsert endpoint `/api/inventory/import`

## Phase 7 — REST API

27. `POST /api/conversation` — inbound message → Conversation Agent → Orchestrator loop → NL reply (core loop)
28. Optional status endpoints: `GET /api/products`, `GET /api/orders`, `GET /api/restock-alerts`
29. End-to-end test of the full loop ("3 Maggi bhej do" → ASK_CUSTOMER → confirm → order → stock update)
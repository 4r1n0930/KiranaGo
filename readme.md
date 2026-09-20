KiranaGo

AI-powered conversational operations layer for neighborhood stores

KiranaGo transforms manual store operations into an automated, conversational workflow.

Customers can interact naturally through WhatsApp, while AI agents, an orchestrator, MCP tools, and MongoDB work together to handle inventory queries, product alternatives, order creation, stock updates, and inventory monitoring.

1. Problem

General store shopkeepers often have to manually:

Maintain inventory records
Search databases when customers ask about products
Check product availability
Calculate order quantities and prices
Create orders
Update stock after every sale
Monitor low-stock products
Remove expired inventory
Respond to repetitive customer queries

This creates unnecessary manual work and makes the customer experience slower.

KiranaGo aims to replace this repetitive manual workflow with an automated system.

2. Core Idea

The customer communicates naturally.

For example:

"Bhaiya 2 packets of Maggi and one bread bhej do."

KiranaGo understands the request, validates the inventory, handles missing information or alternatives, creates the order, updates stock, and communicates the result back to the customer.

The core architectural principle is:

Agents decide.
Orchestrator coordinates.
Tools execute.
Database stores.
Conversation Agent communicates with the customer.
3. High-Level Workflow
                         CUSTOMER
                            │
                            │ Natural Language
                            ▼
                ┌──────────────────────┐
                │  CONVERSATION AGENT  │
                │                      │
                │ Understand message   │
                │ Extract information  │
                │ Create structured    │
                │ request              │
                └──────────┬───────────┘
                           │
                           │ Structured Request
                           ▼
                ┌──────────────────────┐
                │     ORCHESTRATOR     │
                │                      │
                │ Analyze request      │
                │ Decide next action   │
                │ Select tools/agents  │
                │ Validate workflow    │
                └──────────┬───────────┘
                           │
              ┌────────────┼─────────────┐
              │            │             │
              ▼            ▼             ▼
        Missing Info   Inventory      Other
              │          Check        Operations
              │            │
              │            ▼
              │      Inventory Agent
              │            │
              │            ▼
              │         MongoDB
              │            │
              │     ┌──────┴──────┐
              │     │             │
              │   Found        Not Found
              │     │             │
              │     │       Find Alternative
              │     │             │
              │     └──────┬──────┘
              │            │
              └────────────┤
                           ▼
                ┌──────────────────────┐
                │     ORCHESTRATOR     │
                │                      │
                │ Produces next action │
                └──────────┬───────────┘
                           │
                           │ ASK_CUSTOMER
                           ▼
                ┌──────────────────────┐
                │  CONVERSATION AGENT  │
                │                      │
                │ Converts action into │
                │ natural language     │
                └──────────┬───────────┘
                           │
                           ▼
                       CUSTOMER
4. Most Important Architectural Rule

The Orchestrator never talks directly to the customer.

The Conversation Agent is the only customer-facing component.

For example, the Orchestrator should not produce:

"How many packets of Maggi do you want?"

Instead, it produces a structured instruction:

{
  "action": "ASK_CUSTOMER",
  "missing": ["quantity"],
  "context": {
    "product": "Maggi"
  }
}

The Conversation Agent receives this instruction and converts it into natural language:

"Sure! How many packets of Maggi would you like?"

This keeps responsibilities clearly separated.

5. Complete Conversation Loop

The system works as a loop between the customer, Conversation Agent, and Orchestrator.

CUSTOMER
   │
   │ Message
   ▼
CONVERSATION AGENT
   │
   │ Structured Request
   ▼
ORCHESTRATOR
   │
   ├── ASK_CUSTOMER ──────────────┐
   │                              │
   │                              ▼
   │                       CONVERSATION AGENT
   │                              │
   │                              ▼
   │                           CUSTOMER
   │                              │
   │                              │ New information
   │                              ▼
   │                       CONVERSATION AGENT
   │                              │
   │                              ▼
   └──────────────────────── ORCHESTRATOR
                                  │
                                  ▼
                            Tools / Agents

This loop continues until the Orchestrator has enough information to complete the requested operation.

6. Step 1 — Customer Message

Suppose the customer sends:

"Bhaiya Maggi bhej do."

The Conversation Agent receives the message.

7. Step 2 — Conversation Agent

The Conversation Agent is responsible for understanding the customer's language.

Its responsibilities include:

Understanding intent
Extracting products
Extracting quantities
Extracting relevant customer information
Identifying obvious missing information
Converting natural language into structured data

Example output:

{
  "intent": "create_order",
  "items": [
    {
      "product": "Maggi"
    }
  ]
}

The Conversation Agent does not create the order.

It forwards the structured request to the Orchestrator.

8. Step 3 — Orchestrator

The Orchestrator receives the structured request.

It determines whether the request contains enough information to continue.

In this case:

Product: Maggi
Quantity: Missing

Therefore, the Orchestrator generates:

{
  "action": "ASK_CUSTOMER",
  "missing": [
    "quantity"
  ],
  "context": {
    "product": "Maggi"
  }
}

This instruction is sent back to the Conversation Agent.

9. Step 4 — Conversation Agent Asks Customer

The Conversation Agent converts the structured instruction into natural language.

Orchestrator
     │
     │ ASK_CUSTOMER
     ▼
Conversation Agent
     │
     ▼
"Sure! How many packets of Maggi would you like?"

The customer responds:

"3 packets."

The Conversation Agent extracts the new information:

{
  "quantity": 3
}

The request is now sent back to the Orchestrator.

10. Step 5 — Inventory Validation

Now that the request is complete, the Orchestrator determines that inventory needs to be checked.

It invokes the Inventory Agent or the appropriate inventory tool.

Orchestrator
      │
      ▼
Inventory Agent
      │
      ▼
check_inventory()
      │
      ▼
MongoDB

Example result:

{
  "product": "Maggi",
  "available": true,
  "stock": 15,
  "requested": 3
}

The Orchestrator can now continue with the order.

11. Inventory Agent

The Inventory Agent is responsible for inventory-related reasoning.

It can:

Find products
Validate availability
Check quantities
Resolve product names
Find alternatives
Return structured inventory information

For example:

Customer:
"Do you have bread?"

Inventory:

Bread
Stock = 0

Instead of simply returning:

Unavailable

the system can search for alternatives:

Available alternatives:

Modern Bread
Harvest Gold Bread

The Orchestrator can then decide to ask the customer whether they want an alternative.

12. Alternative Product Workflow
Customer
   │
   ▼
Conversation Agent
   │
   ▼
Orchestrator
   │
   ▼
Inventory Agent
   │
   ▼
Product Not Found / Unavailable
   │
   ▼
Find Alternatives
   │
   ▼
Orchestrator
   │
   │ ASK_CUSTOMER
   ▼
Conversation Agent
   │
   ▼
Customer

Example:

Customer:
"Give me one bread."

Inventory:
Bread unavailable.

Alternatives:
- Modern Bread
- Harvest Gold Bread

Orchestrator:
ASK_CUSTOMER

Conversation Agent:
"Regular bread is currently unavailable.
Would you like Modern Bread instead?"
13. MCP Tool Layer

MCP tools provide the controlled execution layer.

Possible tools include:

check_inventory()
find_alternatives()
create_order()
update_stock()
get_order()
cancel_order()
create_restock_alert()

The AI does not directly manipulate MongoDB.

Instead:

AI / Agent
    │
    │ Tool Request
    ▼
MCP Tool
    │
    ▼
Application Logic
    │
    ▼
MongoDB
    │
    ▼
Structured Result
    │
    ▼
Orchestrator

This creates a clean separation between reasoning and execution.

14. Agent vs Tool Responsibility
Component	Responsibility
Conversation Agent	Communicate with customer and convert natural language into structured requests
Orchestrator	Control workflow and decide what should happen next
Inventory Agent	Handle inventory-related reasoning and product resolution
MCP Tools	Execute deterministic operations
MongoDB	Persist application data
Inventory Monitor	Detect expiry and low-stock events
WhatsApp Layer	Transport customer messages
Simplified principle
Conversation Agent → Communicates
Orchestrator       → Decides
Agents             → Reason
MCP Tools          → Execute
MongoDB            → Stores
15. Order Creation

Once the request is complete and inventory has been validated:

Customer Request
       │
       ▼
Information Complete
       │
       ▼
Inventory Validated
       │
       ▼
Price Calculated
       │
       ▼
create_order()

Example:

{
  "orderId": "ORD-10291",
  "customerId": "CUS-421",
  "items": [
    {
      "productId": "MAGGI-001",
      "quantity": 3,
      "price": 15
    }
  ],
  "total": 45,
  "status": "confirmed"
}
16. Stock Update

After an order is successfully created:

create_order()
      │
      ▼
update_stock()

Example:

Maggi

Before: 15
Sold:    3
After:  12

The inventory is updated automatically.

17. Low-Stock Detection

Low stock should be treated separately from product expiry.

After updating inventory:

Current Stock
      │
      ▼
Compare with Reorder Threshold
      │
      ├───────────────┐
      │               │
      ▼               ▼
Above Threshold   Below Threshold
      │               │
      │               ▼
      │        Restock Alert
      │               │
      │               ▼
      │          Shopkeeper
      │
      ▼
   Nothing

Example:

Product: Maggi

Current Stock: 7
Reorder Threshold: 10

→ Low stock detected
→ Create restock alert
→ Notify shopkeeper
18. Expiry Management

Expiry should be handled as an independent inventory process.

A background inventory monitor periodically checks expiry information.

                     MongoDB
                        │
                        ▼
                 Expiry Monitor
                        │
               ┌────────┴────────┐
               │                 │
          Not Expired          Expired
               │                 │
           No Action      Mark Unavailable
                                 │
                                 ▼
                          Update Inventory
                                 │
                                 ▼
                         Notify Shopkeeper

Example:

Product: Milk
Expiry Date: 20 September 2026

→ Expiry detected
→ Mark stock unavailable
→ Update inventory
→ Notify shopkeeper
19. Low Stock vs Expiry

These should remain separate workflows.

Order / Low Stock
Order
  ↓
Stock Decreases
  ↓
Check Reorder Threshold
  ↓
Low Stock?
  ↓
Restock Alert
Expiry
Expiry Monitor
      ↓
Expiry Detected
      ↓
Mark Stock Unavailable
      ↓
Update Inventory
      ↓
Notify Shopkeeper

This separation keeps inventory logic predictable.

20. CSV Inventory Import

Shopkeepers should not have to manually enter hundreds of products.

KiranaGo can support CSV-based inventory import.

CSV File
   │
   ▼
CSV Parser
   │
   ▼
Validate Data
   │
   ▼
Transform Data
   │
   ▼
MongoDB
   │
   ▼
Inventory Available

Example CSV:

productId,name,category,price,stock,reorderThreshold,expiryDate
MAGGI-001,Maggi,Instant Noodles,15,50,10,2026-12-20
MILK-001,Amul Milk,Dairy,30,20,5,2026-09-25
BREAD-001,Modern Bread,Bakery,40,10,3,2026-09-23

This allows the shopkeeper to bulk-import existing inventory.

21. Complete Architecture
                         ┌──────────────┐
                         │   CUSTOMER   │
                         └──────┬───────┘
                                │
                                │ WhatsApp
                                ▼
                  ┌─────────────────────────┐
                  │   CONVERSATION AGENT    │
                  │                         │
                  │ • Understand language   │
                  │ • Extract information   │
                  │ • Build request         │
                  │ • Generate responses    │
                  └────────────┬────────────┘
                               │
                               │ Structured Request
                               ▼
                  ┌─────────────────────────┐
                  │      ORCHESTRATOR       │
                  │                         │
                  │ • Analyze request       │
                  │ • Control workflow      │
                  │ • Select tools          │
                  │ • Handle missing data   │
                  │ • Produce next action   │
                  └────────────┬────────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             │                 │                 │
             ▼                 ▼                 ▼
       ASK_CUSTOMER      Inventory Agent     MCP Tools
             │                 │                 │
             │                 ▼                 │
             │              MongoDB             │
             │                                   │
             │                 ┌─────────────────┤
             │                 │                 │
             │                 ▼                 ▼
             │          create_order()    update_stock()
             │
             ▼
   ┌──────────────────────┐
   │  CONVERSATION AGENT  │
   │                      │
   │ Converts orchestrator│
   │ instruction into     │
   │ natural language     │
   └──────────┬───────────┘
              │
              ▼
           CUSTOMER
22. Complete Order Flow
Customer
   │
   │ "Send me 3 Maggi"
   ▼
Conversation Agent
   │
   │ Structured Request
   ▼
Orchestrator
   │
   ▼
Inventory Agent
   │
   ▼
check_inventory()
   │
   ▼
MongoDB
   │
   ▼
Inventory Result
   │
   ▼
Orchestrator
   │
   ▼
create_order()
   │
   ▼
MongoDB
   │
   ▼
update_stock()
   │
   ▼
MongoDB
   │
   ▼
Orchestrator
   │
   ▼
Conversation Agent
   │
   ▼
Customer
23. Missing Information Flow
Customer
   │
   │ "Send Maggi"
   ▼
Conversation Agent
   │
   ▼
Orchestrator
   │
   │ Quantity missing
   ▼
ASK_CUSTOMER
   │
   ▼
Conversation Agent
   │
   │ "How many packets?"
   ▼
Customer
   │
   │ "3"
   ▼
Conversation Agent
   │
   ▼
Orchestrator
   │
   ▼
Continue Workflow
24. Alternative Product Flow
Customer
   │
   ▼
Conversation Agent
   │
   ▼
Orchestrator
   │
   ▼
Inventory Agent
   │
   ▼
Product unavailable
   │
   ▼
Find Alternatives
   │
   ▼
Orchestrator
   │
   │ ASK_CUSTOMER
   ▼
Conversation Agent
   │
   │ "Would you like Modern Bread?"
   ▼
Customer
   │
   ▼
Conversation Agent
   │
   ▼
Orchestrator
   │
   ▼
Continue Order
25. Complete System Workflow

The entire KiranaGo system can be summarized as:

                  CUSTOMER
                     │
                     ▼
             Conversation Agent
                     │
                     ▼
               Orchestrator
                     │
          ┌──────────┼───────────┐
          │          │           │
          ▼          ▼           ▼
      Ask User   Inventory    Other Action
          │          │
          │          ▼
          │       MongoDB
          │          │
          │     ┌────┴─────┐
          │     │          │
          │   Found     Not Found
          │     │          │
          │     │     Alternatives
          │     │          │
          └─────┴──────────┘
                     │
                     ▼
                Orchestrator
                     │
                     ▼
               create_order()
                     │
                     ▼
               update_stock()
                     │
              ┌──────┴──────┐
              │             │
              ▼             ▼
         Stock Normal    Stock Low
              │             │
              │       Restock Alert
              │
              ▼
        Conversation Agent
              │
              ▼
           CUSTOMER
26. Architectural Philosophy

KiranaGo is designed around a clear separation of responsibilities.

Customer communication

Handled by the Conversation Agent.

Workflow decisions

Handled by the Orchestrator.

Domain reasoning

Handled by specialized Agents.

Database operations

Handled through controlled MCP Tools.

Persistence

Handled by MongoDB.

Background inventory operations

Handled by the Inventory Monitor.

This prevents the LLM from becoming directly responsible for critical database operations.

27. Technical Positioning

KiranaGo is not simply an AI chatbot.

It is a:

Conversational commerce and inventory orchestration system that converts natural-language customer requests into validated store operations through an AI orchestrator and MCP-based tool layer.

The core pipeline is:

Natural Language
       ↓
Intent Understanding
       ↓
Structured Request
       ↓
Orchestration
       ↓
Inventory Validation
       ↓
Missing Information / Alternatives
       ↓
Order Creation
       ↓
Stock Mutation
       ↓
Inventory Monitoring
       ↓
Restocking / Expiry Management
28. One-Line Architecture
WhatsApp → Conversation Agent → Orchestrator → Agents/MCP Tools → MongoDB
                ↑                    │
                └──── ASK_CUSTOMER ─┘

The critical loop is:

Customer ↔ Conversation Agent ↔ Orchestrator ↔ Agents/Tools ↔ MongoDB

This makes KiranaGo a complete AI-driven store operations system, rather than just a conversational interface.
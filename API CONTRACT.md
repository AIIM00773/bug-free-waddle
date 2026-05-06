
**strict, versioned API contract** for:

* Buyer app (AI commerce)
* Merchant app (AI listing system)
* Search/AI layer
* Orders + Payments (M-Pesa)
* Core system (auth, products)

Everything is structured so both **frontend + backend + AI workers speak the same language**.


# 📡 API CONTRACT (v1)


## 🧠 Design Principles

> * API is **state-driven**, not request-driven
> * AI outputs are **structured contracts, not free text**
> * Backend is **source of truth**
> * Frontend only renders + triggers actions
> * Every response is **predictable JSON**





# 🧩 1. AUTH CONTRACT

## POST `/auth/register`


### Request

```json id="auth1"
{
  "email": "string",
  "full_name": "string",
  "password": "string",
  "phone": "string",
  "role": "buyer | merchant"
}
```

### Response

```json id="auth2"
{
  "user": {
    "id": "uuid",
    "email": "string",
    "role": "buyer"
  },
  "access_token": "jwt",
  "refresh_token": "jwt"
}
```

---

## POST `/auth/login`

### Response

Same as register.

---


# 🧠 2. CONVERSATION / AI CHAT CONTRACT (CORE SYSTEM)

## POST `/conversations/message`

### Request

```json id="chat1"
{
  "conversation_id": "uuid | null",
  "message": "I want a clean outfit for going out",
  "context": {
    "device": "mobile"
  }
}
```


---

## Response (CRITICAL STRUCTURE)

```json id="chat2"
{
  "conversation_id": "uuid",
  "intent": {
    "domain": "fashion",
    "category": "clothing",
    "budget": {
      "max": 2000
    },
    "attributes": {
      "style": "clean",
      "use_case": "going_out"
    },
    "confidence": 0.78
  },
  "search_state": {
    "query_vector": "clean going out outfit fashion",
    "filters": {
      "price_max": 2000,
      "category": "fashion"
    }
  },
  "ui": {
    "message": "Got it — here are clean outfits under your budget.",
    "suggestion_chips": ["Cheaper", "More stylish", "Streetwear", "Formal"]
  },
  "products": [
    {
      "id": "uuid",
      "title": "Black Oversized Shirt",
      "price": 1800,
      "match_reason": "Matches style + budget"
    }
  ]
}
```

---

# 🔍 3. SEARCH CONTRACT

## POST `/search/query`

### Request

```json id="search1"
{
  "query": "nike shoes under 3000",
  "filters": {
    "category": "shoes",
    "price_max": 3000
  },
  "relaxation_level": 1
}
```

---

### Response

```json id="search2"
{
  "results": [
    {
      "id": "uuid",
      "title": "Nike Air Max",
      "price": 2900,
      "score": 0.92
    }
  ],
  "refinement_options": [
    "cheaper",
    "more premium",
    "different brands"
  ]
}
```

---

# 🛍️ 4. PRODUCTS CONTRACT

## GET `/products`

### Query Params

```
?category=fashion&limit=20&cursor=uuid
```

---

### Response

```json id="prod1"
{
  "products": [
    {
      "id": "uuid",
      "title": "Oversized Black Shirt",
      "price": 1800,
      "attributes": {
        "color": "black",
        "fit": "oversized"
      },
      "images": ["url1", "url2"]
    }
  ],
  "next_cursor": "uuid"
}
```

---

# 🏪 5. MERCHANT UPLOAD CONTRACT (AI PIPELINE CORE)

## POST `/merchant/upload-batch`

### Request

```json id="merchant1"
{
  "images": ["url1", "url2", "url3"],
  "merchant_id": "uuid"
}
```

---

### Response

```json id="merchant2"
{
  "batch_id": "uuid",
  "status": "processing"
}
```

---

## GET `/merchant/batch/{id}`

### Response

```json id="merchant3"
{
  "status": "processing",
  "progress": 65,
  "drafts": [
    {
      "id": "uuid",
      "title": "Black Hoodie",
      "price_suggestion": 2500,
      "category": "fashion/hoodies",
      "status": "pending_review"
    }
  ]
}
```

---

## POST `/merchant/publish`

```json id="merchant4"
{
  "draft_ids": ["uuid1", "uuid2"]
}
```

---

# 📦 6. ORDERS CONTRACT

## POST `/orders/create`

```json id="order1"
{
  "user_id": "uuid",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 1
    }
  ]
}
```

---

### Response

```json id="order2"
{
  "order_id": "uuid",
  "status": "pending_payment",
  "total": 1800
}
```

---

## GET `/orders/{id}`

```json id="order3"
{
  "order_id": "uuid",
  "status": "paid",
  "items": [],
  "total": 1800
}
```

---

# 💳 7. PAYMENTS (M-PESA CONTRACT)

## POST `/payments/initiate`

```json id="pay1"
{
  "order_id": "uuid",
  "phone": "2547XXXXXXXX"
}
```

---

### Response

```json id="pay2"
{
  "status": "pending",
  "checkout_request_id": "abc123"
}
```

---

## POST `/payments/callback`

(Safaricom → Backend)

```json id="pay3"
{
  "ResultCode": 0,
  "MpesaReceiptNumber": "XYZ123",
  "OrderId": "uuid"
}
```

---

### Backend Action:

* verify payment
* update order
* trigger realtime update

---

# 🧠 8. SEARCH STATE CONTRACT (CRITICAL AI CORE)

This is shared between frontend + backend + AI.

```json id="state1"
{
  "intent": {
    "domain": "fashion",
    "category": "shirts"
  },
  "attributes": {
    "color": "black",
    "style": "clean"
  },
  "budget": {
    "max": 2000
  },
  "refinement_level": 2,
  "history": []
}
```

---

# 🔄 9. ERROR CONTRACT (GLOBAL STANDARD)

Every endpoint MUST return:

```json id="error1"
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Budget is required",
    "field": "budget"
  }
}
```

---

# ⚡ 10. AI RESPONSE RULES (STRICT)

AI outputs MUST:

* always be JSON structured
* never include raw text-only responses
* never invent products
* always include confidence score
* always update search_state

---

# 🧭 11. SYSTEM FLOW CONTRACT (END-TO-END)

## Buyer Flow

```text id="flow1"
User Message
→ /conversations/message
→ AI Intent Extraction
→ SearchState Update
→ /search/query
→ Product Ranking
→ Response to UI
```

---

## Merchant Flow

```text id="flow2"
Upload Images
→ /merchant/upload-batch
→ Worker AI processing
→ Draft generation
→ /merchant/batch/{id}
→ /merchant/publish
→ Products indexed
```

---

## Payment Flow

```text id="flow3"
Create Order
→ Initiate Payment
→ M-Pesa STK Push
→ Callback verification
→ Order marked paid
→ UI updates realtime
```

---

# 🚨 CRITICAL CONTRACT RULES

## 1. No free-text AI responses

Everything is structured JSON.

---

## 2. Backend is authoritative

Frontend NEVER modifies business logic.

---

## 3. Payments are immutable

Once confirmed → cannot be altered.

---

## 4. Products are DB-source only

AI cannot invent listings.

---

## 5. SearchState is single source of truth

All recommendations derive from it.

---

# 🧭 WHAT YOU NOW HAVE

You now have:

✔ Full system architecture
✔ Backend structure
✔ Frontend structure
✔ AI system design
✔ Execution roadmap
✔ API contract (this layer)

---

# 🚀 NEXT STEP (IMPORTANT)

Now we can move into **actual build readiness mode**, meaning:

> **DATABASE SCHEMA (production-ready Supabase/Postgres design OR Django models fully mapped)**

That is the final missing “ground truth layer” before coding starts.

Just say:
👉 **DATABASE SCHEMA**

and I’ll design your entire production-grade data model (users, products, embeddings, orders, payments, search state, merchant batches, everything).

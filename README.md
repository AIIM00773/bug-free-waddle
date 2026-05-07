# bug-free-waddle

# 📦 Conversational AI Marketplace (CAM)

> A next-generation AI-powered marketplace where users shop through conversation, and merchants create products instantly using AI-driven image understanding.

---

## 🚀 Overview

This platform is a **hybrid AI commerce system** that replaces traditional search-based marketplaces with an **intent-driven conversational shopping experience**.

Instead of browsing listings, users:

* Describe what they want in natural language
* Receive guided refinement via AI
* Get ranked product recommendations
* Purchase directly via in-app checkout (M-Pesa)

Merchants:

* Upload product images in bulk
* Let AI generate structured listings instantly
* Review, edit, and publish at scale

---

## 🧠 Core Philosophy

This system is built on four principles:

* **Intent over search** → users express needs, not queries
* **Structure over chaos** → AI outputs must be validated and structured
* **Speed over perfection** → fast usable results first, enrichment later
* **Hybrid intelligence** → AI suggests, system decides

---

## 🏗️ System Architecture

The system is split into layered services:

```
Frontend (React Native)
        ↓
API Layer (Node/Django + Supabase Edge Functions)
        ↓
---------------------------------------------------
| Supabase (Auth + DB + Realtime + Storage)       |
| Custom Backend (Search, AI, Payments, Orders)   |
| Worker System (Async AI + Processing Jobs)       |
---------------------------------------------------
        ↓
External Services (M-Pesa, AI APIs)
```

---

## 🧩 Key Modules

### 1. Buyer System (Conversational Commerce)

Users interact with a **hybrid AI chat interface**:

* Natural language shopping
* AI-guided clarification
* Structured product recommendations
* Inline refinement controls (chips/buttons)
* Direct checkout flow

#### Flow:

```
User Input → Intent Extraction → SearchState → Retrieval → Ranking → Products → Checkout
```

---

### 2. Merchant System (AI Listing Engine)

Merchants upload product images and receive instant structured listings.

#### Features:

* Bulk image upload (1–20+ images)
* AI-generated product titles, categories, attributes
* Price suggestions
* Draft review system
* One-click publishing

#### Pipeline:

```
Upload → Queue → AI Fast Pass → Structured Draft → Merchant Review → Publish → Index
```

---

### 3. AI Intelligence Layer

A controlled AI system that operates under strict guardrails.

#### Responsibilities:

* Intent extraction
* SearchState generation
* Product classification
* Listing generation
* Conversation guidance

#### Constraints:

* No hallucinated products
* Structured JSON outputs only
* Confidence scoring required
* System always validates outputs

---

### 4. Search & Ranking Engine

Hybrid retrieval system combining:

* Vector search (semantic matching)
* Structured filtering (SQL)
* Multi-pass query relaxation
* Ranking scoring engine

#### Ranking formula:

```
Score =
  semantic_match +
  attribute_match +
  budget_fit +
  popularity +
  recency
```

---

### 5. Payments System (M-Pesa Integration)

Fully integrated mobile money checkout system.

#### Flow:

```
Order Created → STK Push → User PIN → Callback → Payment Confirmation → Order Update
```

#### States:

* INITIATED
* PENDING
* SUCCESS
* FAILED

---

## 📊 Core Data Models

### Users

* id
* name
* phone
* role (buyer / merchant)

---

### Products

* id
* merchant_id
* title
* description
* price
* category_path
* attributes (JSONB)
* embedding (vector)
* is_active

---

### Orders

* id
* user_id
* status
* total_amount
* payment_status

---

### Order Items

* id
* order_id
* product_id
* quantity
* unit_price

---

### Payments

* id
* order_id
* method (mpesa)
* status
* mpesa_receipt

---

## 🔄 SearchState (Core Intelligence Object)

The system uses a structured state instead of raw chat history.

```ts
SearchState = {
  domain,
  category,
  subcategory,
  attributes,
  budget,
  intent_type,
  confidence_score,
  missing_fields,
  results_ids,
  selected_product_id
}
```

---

## ⚙️ Repository Structure

The project uses a **multi-environment staged architecture**:

```
frontend/          → Development UI
backend/           → Development APIs

main/              → Integrated testing (frontend + backend)
master/            → Production release
```

---

## 🔁 Deployment Flow

```
frontend/backend (dev)
        ↓
main (integration testing)
        ↓
master (production)
```

---

## 🧪 Environments

| Environment | Purpose             |
| ----------- | ------------------- |
| Dev         | Feature development |
| Main        | Integration testing |
| Master      | Production users    |

---

## 📱 Frontend Features

### Buyer App

* Conversational shopping UI
* Product cards with explanations
* Refinement chips (cheaper, better, different style)
* Checkout flow
* Order tracking

### Merchant App

* Image upload interface
* AI-generated product drafts
* Bulk approval system
* Product management dashboard

---

## 🧠 AI Guardrails

The AI system MUST:

* Output structured JSON only when required
* Never invent products or prices
* Always rely on database for product data
* Use confidence scoring
* Ask clarification when uncertain

---

## 💳 Payments (M-Pesa)

Integration via Safaricom Daraja API:

* STK Push initiation
* Callback validation
* Secure transaction verification
* Idempotent payment handling

---

## 🔒 Security Principles

* Server-side price validation
* Strict order state machine
* Secure payment callbacks
* Role-based access control (RLS via Supabase)
* No trust in client-side data

---

## ⚡ Performance Strategy

* Hybrid search (vector + SQL)
* Caching for frequent queries
* Background job processing for AI tasks
* Parallel processing for image uploads
* Pagination for all product queries

---

## 📦 Merchant AI Pipeline

```
Image Upload
→ Queue Job
→ Fast AI Classification
→ Structured Draft Product
→ Merchant Review
→ Optional Enrichment
→ Publish
→ Embedding Generation
```

---

## 🧭 Buyer Experience Flow

```
User Input
→ Intent Extraction
→ SearchState Update
→ Retrieval Engine
→ Ranking System
→ Product Display
→ Refinement Loop
→ Checkout
→ Payment
→ Order Confirmation
```

---

## 🚧 Known System Risks

* Cold start (no merchant products initially)
* AI misclassification of attributes
* Payment callback delays
* Over-relaxed search results
* Data inconsistency without validation layer

---

## 🧱 Tech Stack (Recommended)

### Frontend

* React Native (Expo)

### Backend

* Node.js / Django (hybrid services)
* Supabase (DB, Auth, Storage)

### AI

* OpenAI / Vision models
* Embedding models (pgvector)

### Payments

* Safaricom Daraja API (M-Pesa)

---

## 🎯 MVP Success Criteria

The system is successful if:

* Users can describe what they want and get relevant products
* Merchants can upload products in under 5 minutes (batch flow)
* Users can complete purchases via M-Pesa
* Search feels conversational, not transactional

---

## 🧭 Future Expansion

* Recommendation engine (personalization layer)
* Bargaining system
* Logistics integration
* Merchant analytics dashboard
* AI shopping assistant memory
* Multi-country expansion

---

## ⚠️ Important Design Rule

> This is not a search engine.
> This is a **decision-making system for commerce.**

---

## 🤝 Contribution Flow

```
feature → dev (frontend/backend)
        → main (integration test)
        → master (production release)
```

---

## 📌 License

Private / Proprietary (for MVP phase)

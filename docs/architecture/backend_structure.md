

# 🏗️ Backend Folder Structure (Django + DRF + JWT + AI Marketplace)

## 📦 Root Structure

```text id="root1"
backend/
│
├── config/                     # Django project config (core)
├── apps/                       # All business logic modules
├── core/                       # Shared utilities + base logic
├── ai/                        # AI services (intent, listing, ranking)
├── workers/                   # Background jobs / async processing
├── integrations/              # External services (M-Pesa, etc.)
├── tests/                     # Global test suite
├── manage.py
├── requirements.txt
└── .env
```

---

# ⚙️ 1. CONFIG MODULE (PROJECT CORE)

```text id="config1"
config/
│
├── __init__.py
├── settings/
│   ├── base.py              # shared settings
│   ├── dev.py               # development settings
│   ├── prod.py              # production settings
│
├── urls.py                  # root routes
├── asgi.py
├── wsgi.py
└── jwt.py                   # JWT config (SimpleJWT)
```

---

## Key Responsibilities

* Django setup
* environment switching
* JWT authentication config
* middleware setup
* global routing

---

# 🧠 2. APPS MODULE (CORE BUSINESS LOGIC)

Each feature is a **separate Django app** (clean modular architecture).

```text id="apps1"
apps/
│
├── users/
├── products/
├── merchants/
├── orders/
├── payments/
├── conversations/
├── search/
└── analytics/
```

---

# 👤 USERS APP

```text id="users1"
users/
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── services.py
└── permissions.py
```

### Responsibilities:

* Authentication (JWT login/register)
* user profiles
* roles (buyer / merchant)

---

# 🛍️ PRODUCTS APP

```text id="products1"
products/
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── services.py
└── selectors.py
```

### Responsibilities:

* product CRUD
* category system
* attributes (JSONB)
* embedding storage reference
* product search interface

---

# 🏪 MERCHANTS APP

```text id="merchants1"
merchants/
├── models.py
├── serializers.py
├── views.py
├── services.py
└── batch_processing.py
```

### Responsibilities:

* merchant profiles
* product uploads
* batch uploads
* AI draft handling

---

# 📦 ORDERS APP

```text id="orders1"
orders/
├── models.py
├── serializers.py
├── views.py
├── services.py
├── state_machine.py
└── selectors.py
```

### Responsibilities:

* order creation
* order items
* order state transitions
* checkout logic

---

# 💳 PAYMENTS APP (M-PESA CORE)

```text id="payments1"
payments/
├── models.py
├── serializers.py
├── views.py
├── services.py
├── mpesa/
│   ├── stk_push.py
│   ├── callbacks.py
│   └── utils.py
└── webhooks.py
```

### Responsibilities:

* STK push initiation
* callback handling
* payment verification
* idempotency control

---

# 💬 CONVERSATIONS APP (AI CHAT CORE)

```text id="conv1"
conversations/
├── models.py
├── serializers.py
├── views.py
├── services.py
└── state_manager.py
```

### Responsibilities:

* chat sessions
* message history
* SearchState storage
* AI interaction logging

---

# 🔍 SEARCH APP (INTELLIGENCE ENGINE)

```text id="search1"
search/
├── engine/
│   ├── intent_extractor.py
│   ├── query_builder.py
│   ├── retriever.py
│   ├── ranker.py
│   └── relaxer.py
│
├── services.py
├── views.py
└── serializers.py
```

---

## Responsibilities:

* SearchState generation
* hybrid search (SQL + vector)
* ranking system
* query relaxation logic

---

# 🤖 AI MODULE (CORE INTELLIGENCE LAYER)

This is separate from apps because it’s cross-cutting logic.

```text id="ai1"
ai/
├── prompts/
│   ├── intent_extraction.py
│   ├── product_generation.py
│   ├── listing_enhancement.py
│   └── ranking_reasoning.py
│
├── services/
│   ├── llm_client.py
│   ├── intent_service.py
│   ├── product_ai_service.py
│   └── safety_guardrails.py
│
└── schemas/
    ├── intent_schema.py
    ├── product_schema.py
    └── search_state_schema.py
```

---

## Responsibilities:

* AI prompting
* structured output enforcement
* guardrails (no hallucinations)
* merchant listing generation
* buyer intent extraction

---

# ⚙️ CORE MODULE (SHARED LOGIC)

```text id="core1"
core/
├── models/
│   ├── base_model.py
│   └── timestamps.py
│
├── utils/
│   ├── validators.py
│   ├── helpers.py
│   ├── response.py
│   └── exceptions.py
│
└── constants.py
```

---

## Responsibilities:

* shared models
* reusable utilities
* global exceptions
* formatting responses

---

# ⚡ WORKERS MODULE (ASYNC SYSTEM)

```text id="workers1"
workers/
├── celery_app.py
├── tasks/
│   ├── image_processing.py
│   ├── ai_generation.py
│   ├── embedding_generation.py
│   └── retry_tasks.py
└── scheduler.py
```

---

## Responsibilities:

* background processing
* AI batch jobs
* image processing
* embeddings generation

---

# 🔌 INTEGRATIONS MODULE

```text id="integrations1"
integrations/
├── mpesa/
│   ├── client.py
│   ├── stk.py
│   └── callbacks.py
│
├── storage/
│   ├── supabase_storage.py
│
└── ai_providers/
    ├── openai_client.py
```

---

## Responsibilities:

* external APIs
* M-Pesa
* storage (Supabase / S3)
* AI providers

---

# 🧪 TEST STRUCTURE

```text id="tests1"
tests/
├── unit/
├── integration/
├── ai_tests/
└── payments_tests/
```

---

## Testing Strategy:

* unit tests per app
* integration tests in `main flow`
* payment simulation tests
* AI response validation tests

---

# 🔐 JWT AUTH STRUCTURE

Inside `config/jwt.py`:

* access token lifetime
* refresh token handling
* role-based claims (buyer/merchant)

---

# 📌 KEY ARCHITECTURAL RULES

## 1. No business logic in views

→ views only route requests

## 2. Services contain logic

→ all computation happens in `services.py`

## 3. AI is isolated

→ never directly inside views or models

## 4. Workers handle heavy tasks

→ image processing, embeddings, AI enrichment

## 5. Payments are isolated

→ never mixed with order logic

---

# 🚀 WHY THIS STRUCTURE WORKS FOR YOU

This design supports:

### ✔ AI marketplace complexity

### ✔ M-Pesa integration safely

### ✔ scalable search engine

### ✔ merchant bulk uploads

### ✔ future microservices split

### ✔ clean testing strategy

---



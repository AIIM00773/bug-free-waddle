
# 📱 Frontend Structure (React Native + Expo + TypeScript)

## 🧠 Core Design Philosophy

> UI is not screens-first.
> It is **feature + state + interaction-first**.

Your app is:

* Conversational (AI chat core)
* Marketplace (products + checkout)
* Dual-mode (Buyer + Merchant)

So structure must reflect that.

---

# 🏗️ Root Structure

```text id="root_frontend"
frontend/
│
├── app/                     # Expo Router (if used) OR navigation entry
├── src/
├── assets/
├── app.config.ts
├── package.json
├── tsconfig.json
└── .env
```

---

# 🧩 1. SOURCE (CORE ARCHITECTURE)

```text id="src1"
src/
│
├── api/                     # backend communication layer
├── app/                     # app-level providers & bootstrap
├── features/                # core business modules (VERY IMPORTANT)
├── components/              # reusable UI components
├── navigation/              # routing structure
├── store/                   # global state (Zustand/Redux)
├── hooks/                   # reusable hooks
├── utils/                  # helpers & utilities
├── constants/              # static values
├── types/                  # global TypeScript types
└── styles/                 # theme system
```

---

# 🌐 2. API LAYER (Backend Communication)

```text id="api1"
api/
├── client.ts               # axios/fetch base client
├── endpoints.ts            # all API routes
│
├── auth.api.ts
├── products.api.ts
├── search.api.ts
├── orders.api.ts
├── payments.api.ts
└── conversations.api.ts
```

---

## Responsibilities

* API abstraction
* JWT handling
* request interceptors
* error normalization

---

# 🚀 3. FEATURES (MOST IMPORTANT LAYER)

This is the **heart of your app architecture**.

Each feature is self-contained:

```text id="features1"
features/
│
├── buyer/
├── merchant/
├── search/
├── chat/
├── products/
├── orders/
├── payments/
└── auth/
```

---

# 👤 FEATURE BREAKDOWN

---

## 🛒 BUYER FEATURE (CORE EXPERIENCE)

```text id="buyer1"
features/buyer/
├── screens/
│   ├── HomeScreen.tsx
│   ├── DiscoverScreen.tsx
│   ├── ProductScreen.tsx
│   └── CheckoutScreen.tsx
│
├── components/
├── hooks/
├── services/
└── buyer.types.ts
```

### Responsibilities:

* product browsing
* recommendations
* checkout flow

---

## 🏪 MERCHANT FEATURE (AI LISTING SYSTEM)

```text id="merchant1"
features/merchant/
├── screens/
│   ├── Dashboard.tsx
│   ├── UploadScreen.tsx
│   ├── BatchProcessing.tsx
│   ├── ProductEditor.tsx
│   └── Earnings.tsx
│
├── components/
├── hooks/
└── merchant.types.ts
```

### Responsibilities:

* image upload
* AI-generated listings
* batch management
* publishing products

---

## 🔍 SEARCH FEATURE (AI CORE UX)

```text id="search1"
features/search/
├── screens/
│   ├── SearchScreen.tsx
│   └── ResultsScreen.tsx
│
├── components/
├── hooks/
├── searchState.ts
└── search.types.ts
```

### Responsibilities:

* conversational search UI
* filters (chips)
* AI refinement flow
* product ranking display

---

## 💬 CHAT FEATURE (CONVERSATIONAL ENGINE)

```text id="chat1"
features/chat/
├── screens/
│   ├── ChatScreen.tsx
│
├── components/
│   ├── MessageBubble.tsx
│   ├── SuggestionChips.tsx
│   └── ProductCarousel.tsx
│
├── hooks/
└── chat.types.ts
```

### Responsibilities:

* AI conversation UI
* SearchState updates
* contextual suggestions

---

## 🛍️ PRODUCTS FEATURE

```text id="products1"
features/products/
├── screens/
│   ├── ProductDetails.tsx
│
├── components/
├── hooks/
└── product.types.ts
```

---

## 💳 PAYMENTS FEATURE (M-PESA FLOW)

```text id="payments1"
features/payments/
├── screens/
│   ├── PaymentScreen.tsx
│   └── SuccessScreen.tsx
│
├── hooks/
└── payments.types.ts
```

---

## 📦 ORDERS FEATURE

```text id="orders1"
features/orders/
├── screens/
│   ├── OrdersScreen.tsx
│   └── OrderDetails.tsx
│
├── components/
└── orders.types.ts
```

---

## 🔐 AUTH FEATURE

```text id="auth1"
features/auth/
├── screens/
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   └── OTPVerification.tsx
│
├── hooks/
└── auth.types.ts
```

---

# 🧱 4. GLOBAL COMPONENTS

```text id="components1"
components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── Loader.tsx
│
├── layout/
│   ├── ScreenWrapper.tsx
│   ├── Header.tsx
│   └── SafeArea.tsx
│
├── marketplace/
│   ├── ProductCard.tsx
│   ├── PriceTag.tsx
│   └── Rating.tsx
│
└── ai/
    ├── TypingIndicator.tsx
    ├── AIReasoning.tsx
    └── SuggestionChips.tsx
```

---

# 🧭 5. NAVIGATION SYSTEM

```text id="nav1"
navigation/
├── AppNavigator.tsx
├── AuthNavigator.tsx
├── BuyerNavigator.tsx
├── MerchantNavigator.tsx
└── routes.ts
```

---

## Structure Logic

* Auth → login/register flow
* Buyer → shopping experience
* Merchant → listing system

---

# 🧠 6. STATE MANAGEMENT

```text id="store1"
store/
├── auth.store.ts
├── cart.store.ts
├── search.store.ts
├── chat.store.ts
├── merchant.store.ts
└── app.store.ts
```

---

## Recommended Stack:

* Zustand (lightweight, scalable)
* OR Redux Toolkit (if team is large)

---

# 🔧 7. HOOKS LAYER

```text id="hooks1"
hooks/
├── useAuth.ts
├── useSearch.ts
├── useChat.ts
├── useProducts.ts
├── usePayments.ts
└── useDebounce.ts
```

---

# 🧠 8. SEARCH STATE (CRITICAL)

This is your AI brain in frontend.

```text id="searchstate1"
searchState = {
  intent,
  category,
  budget,
  attributes,
  refinementLevel,
  selectedProducts,
  conversationHistory
}
```

---

# 🎨 9. STYLES SYSTEM

```text id="styles1"
styles/
├── theme.ts
├── colors.ts
├── spacing.ts
├── typography.ts
└── globalStyles.ts
```

---

# 📊 10. TYPES (VERY IMPORTANT)

```text id="types1"
types/
├── user.types.ts
├── product.types.ts
├── order.types.ts
├── payment.types.ts
├── chat.types.ts
└── api.types.ts
```

---

# ⚡ KEY DESIGN RULES

## 1. Feature-first architecture

Never mix unrelated logic.

---

## 2. UI is dumb, state is smart

UI only renders state.

---

## 3. Chat is NOT just UI

It is a state machine interface.

---

## 4. Merchant and Buyer are isolated domains

Do NOT mix flows.

---

## 5. API layer is single source of truth

No direct backend calls inside components.

---

# 🚀 WHY THIS STRUCTURE WORKS FOR YOU

This structure enables:

### ✔ AI chat commerce system

### ✔ scalable merchant AI ingestion

### ✔ clean separation of concerns

### ✔ easy testing per feature

### ✔ future micro-frontend migration

### ✔ production-grade maintainability

---

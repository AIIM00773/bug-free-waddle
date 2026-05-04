# Implementation Roadmap

This document outlines the improvements made and recommended next steps for the Market app.

## ✅ Completed Improvements

### 1. Security & Configuration
- [x] Moved API URLs from hardcoded constants to `.env` file
- [x] Created centralized API client (`utils/api.ts`)
- [x] Implemented input validation utility (`utils/validation.ts`)
- [x] Added proper TypeScript types for API responses (`types/auth.ts`)

### 2. Code Quality
- [x] Refactored `AuthProvider` to use API client
- [x] Added input validation in login/signup
- [x] Removed console logging of sensitive data
- [x] Updated error handling with structured types
- [x] Fixed file naming issues (PrompSuggestions → PromptSuggestions)
- [x] Fixed router path in Merchant dashboard

### 3. Developer Experience
- [x] Created `ErrorBoundary` component for catching component errors
- [x] Created custom hook `useAuthManagement` for auth utilities
- [x] Added comprehensive `DEVELOPMENT.md` guide
- [x] Enhanced package.json with better scripts
- [x] Created this implementation roadmap

---

## 📋 Recommended Next Steps (Priority Order)

### Phase 1: Foundation (1-2 Weeks)
**Focus: Testing & Error Monitoring**

#### 1.1 Set Up Testing Framework
**Status:** Not Started
**Effort:** Medium
**Steps:**
```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
npm install --save-dev ts-jest @types/jest
```

**Files to Create:**
- `jest.config.js` - Jest configuration
- `tests/` directory with test examples
- `utils/__tests__/validation.test.ts` - Validation tests
- `__mocks__/` directory for mocking modules

**Example Test:**
```typescript
// utils/__tests__/validation.test.ts
import { validateEmail, validatePassword } from '@/utils/validation';

describe('Input Validation', () => {
  describe('validateEmail', () => {
    it('should accept valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });
    
    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
    });
  });
});
```

#### 1.2 Add Error Monitoring (Sentry)
**Status:** Not Started
**Effort:** Low
**Steps:**
```bash
npm install @sentry/react-native
```

**Update `_layout.tsx`:**
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**Benefits:**
- Track runtime errors automatically
- Monitor API failures
- Alert on critical issues

#### 1.3 Set Up Pre-commit Hooks
**Status:** Not Started
**Effort:** Low
**Steps:**
```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

**Add to `package.json`:**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

### Phase 2: Architecture (2-3 Weeks)
**Focus: Advanced State Management & API Enhancements**

#### 2.1 Implement Refresh Token Logic
**Status:** Not Started
**Effort:** Medium
**Current Issue:** No token refresh mechanism

**Implementation:**
```typescript
// utils/api.ts - Add this method
private async requestWithRefresh<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    return await this.request<T>(endpoint, options);
  } catch (error: any) {
    if (error.statusCode === 401) {
      // Token expired - refresh and retry
      const newToken = await refreshAccessToken();
      // Retry original request with new token
      return this.request<T>(endpoint, options);
    }
    throw error;
  }
}
```

#### 2.2 Create Merchant API Client Layer
**Status:** Not Started
**Effort:** Medium
**Files to Create:**
```
api/
├── authApi.ts        (Already using apiClient)
├── productApi.ts     (Products endpoints)
├── merchantApi.ts    (Merchant operations)
├── orderApi.ts       (Order management)
└── cartApi.ts        (Shopping cart)
```

**Example:**
```typescript
// api/merchantApi.ts
import { apiClient } from '@/utils/api';
import type { MerchantProfile, UpdateMerchantRequest } from '@/types/merchant';

export const merchantApi = {
  getProfile: () => 
    apiClient.get<MerchantProfile>('/merchants/profile/'),
  
  updateProfile: (data: UpdateMerchantRequest) =>
    apiClient.put<MerchantProfile>('/merchants/profile/', data),
  
  getInventory: () =>
    apiClient.get<Product[]>('/merchants/inventory/'),
};
```

#### 2.3 Implement Redux or Zustand for Complex State
**Status:** Not Started  
**Effort:** High
**Recommendation:** Start with Zustand (lighter, simpler)

```bash
npm install zustand
```

**Create Store:**
```typescript
// stores/productStore.ts
import { create } from 'zustand';

interface ProductStore {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  fetchProducts: async () => {
    set({ loading: true });
    // fetch...
    set({ loading: false });
  },
}));
```

---

### Phase 3: Performance & Monitoring (2-3 Weeks)
**Focus: Speed & Analytics**

#### 3.1 Implement Image Optimization
**Status:** Not Started
**Effort:** Low
**Current:** expo-image imported but not used

**Update Image Components:**
```typescript
import { Image } from 'expo-image';

export function ProductImage({ uri }: { uri: string }) {
  return (
    <Image
      source={uri}
      style={{ width: 200, height: 200 }}
      contentFit="cover"
      placeholder="loading..."
    />
  );
}
```

#### 3.2 Add Performance Monitoring
**Status:** Not Started
**Effort:** Medium
**Tool:** Use React DevTools Profiler

```typescript
// components/PerformanceMonitor.tsx
import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    const navigationStart = window.performance.timing.navigationStart;
    const interactive = window.performance.timing.domContentLoaded;
    console.log('Time to Interactive:', interactive - navigationStart);
  }, []);
  
  return null;
}
```

#### 3.3 Implement Analytics
**Status:** Not Started
**Effort:** Low
**Tool:** Firebase Analytics or Segment

---

### Phase 4: Documentation & DevOps (1-2 Weeks)
**Focus: CI/CD & Team Readiness**

#### 4.1 Set Up GitHub Actions CI/CD
**Status:** Not Started
**Effort:** Medium
**Files to Create:**
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
```

#### 4.2 Create API Documentation
**Status:** Not Started
**Effort:** Low
**Tool:** Swagger/OpenAPI or Postman

**Example:** Create `docs/API.md`
```markdown
## Login Endpoint
- **URL:** `/drop/auth/user-login/`
- **Method:** POST
- **Auth:** None required
- **Request Body:**
  - email: string
  - password: string
- **Response:** LoginResponse with tokens and user
```

#### 4.3 Create Architecture Decision Records (ADRs)
**Status:** Not Started
**Effort:** Low
**Files:**
- `docs/adr/0001-use-context-api-for-auth.md`
- `docs/adr/0002-centralized-api-client.md`
- `docs/adr/0003-typescript-types-structure.md`

---

## 🎯 Quick Wins (Can do Immediately)

### 1. Add TypeScript Strict Mode Check
```bash
npm run type-check
```

### 2. Clean Up Unused Dependencies
Audit current dependencies:
```bash
npm audit
npm prune
```

Potentially remove:
- `lucide-react-native` - if not heavily used
- `moti` - if no complex animations needed
- `aes-js` - if not encrypting locally

### 3. Update README with Setup Instructions
```markdown
## Quick Start

1. Install dependencies: `npm install`
2. Create .env from .env.example
3. Start dev: `npm run dev`
4. For staging: Update .env and rebuild
```

### 4. Add Error Logging to API Client
```typescript
// utils/api.ts
private async request<T>(...) {
  try {
    // request code
  } catch (error: any) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}
```

---

## 📊 Impact Summary

| Improvement | Impact | Effort | Timeline |
|---|---|---|---|
| Testing Framework | HIGH | Medium | Week 1 |
| Error Monitoring | HIGH | Low | Day 1 |
| Token Refresh | HIGH | Medium | Week 2 |
| API Layers | MEDIUM | Medium | Week 2-3 |
| State Management | MEDIUM | High | Week 3-4 |
| CI/CD Pipeline | MEDIUM | Medium | Week 4 |
| Documentation | MEDIUM | Low | Ongoing |

---

## 🔍 Monitoring Checklist

Starting today, monitor:
- [ ] API error rates
- [ ] Authentication failures
- [ ] Component errors
- [ ] Performance metrics
- [ ] User session duration

---

## 📞 Questions?

Refer to:
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Dev guide
- [Expo Docs](https://docs.expo.dev)
- Project ADRs in `docs/adr/`

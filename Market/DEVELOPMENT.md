# Market App - Development Guide

## Overview
This is a React Native marketplace application built with Expo, TypeScript, and Supabase authentication. The app supports user authentication, merchant management, and product browsing.

## Project Structure

```
Market/
├── app/                    # Main app screens (Expo Router)
│   ├── AppForms/          # Authentication & user management screens
│   ├── General/           # General user screens (cart, profile, etc.)
│   ├── Merchants/         # Merchant-specific screens
│   └── SubScreens/        # Modal/sub screens
├── Components/            # Reusable UI components
├── Providers/             # Context providers (Auth, etc.)
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions & API client
└── assets/               # Images, logos, fonts
```

## Architecture Patterns

### 1. API Communication
**Pattern: Centralized API Client**

All API calls go through the `apiClient` in `utils/api.ts`:

```typescript
import { apiClient } from "@/utils/api";
import type { LoginResponse } from "@/types/auth";

// Making requests
const response = await apiClient.post<LoginResponse>('/drop/auth/user-login/', {
  email: 'user@example.com',
  password: 'password123',
});
```

**Benefits:**
- Single point for authentication headers
- Consistent error handling
- Easy to add interceptors (token refresh, logging)
- Type-safe responses

### 2. State Management
**Pattern: React Context + Custom Hooks**

Authentication state is managed through `AuthProvider`:

```typescript
import { useAuth } from "@/Providers/AuthProvider";
import { useAuthManagement } from "@/hooks/useAuthManagement";

function MyComponent() {
  const { user, isAuthenticated, loading } = useAuth();
  
  // Or use the custom hook for additional helpers:
  const { isLoggedIn, getFullName } = useAuthManagement();
}
```

### 3. Type Safety
**All API responses and requests are typed:**

```typescript
// types/auth.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  tokens: TokenResponse;
  user: User;
}

// Usage
const data = await apiClient.post<LoginResponse>(endpoint, loginData);
// data is now fully typed ✅
```

### 4. Error Handling
**Structured error handling with custom types:**

```typescript
try {
  const result = await apiClient.post<LoginResponse>(url, data);
} catch (error: unknown) {
  const apiError = error as ApiError;
  console.error(apiError.message); // "Invalid credentials"
  console.error(apiError.statusCode); // 401
}
```

### 5. Input Validation
**Validate user inputs before sending to API:**

```typescript
import { 
  validateEmail, 
  validatePassword, 
  sanitizeEmail,
  validateName 
} from "@/utils/validation";

const email = sanitizeEmail(userInput);
if (!validateEmail(email)) {
  setError('Invalid email format');
  return;
}

const passwordCheck = validatePassword(password);
if (!passwordCheck.valid) {
  setError(passwordCheck.error);
  return;
}
```

## Environment Configuration

### 1. Environment Variables
Located in `.env` file:

```env
EXPO_PUBLIC_API_BASE_URL=https://api.example.com
EXPO_PUBLIC_API_LOGIN_ENDPOINT=/drop/auth/user-login/
EXPO_PUBLIC_API_SIGNUP_ENDPOINT=/drop/auth/user-signup/
```

**Note:** Only variables prefixed with `EXPO_PUBLIC_` are accessible in the app.

### 2. Updating API Endpoints
To change API endpoints:

1. Edit `.env` file
2. Update only the endpoint URLs
3. No code changes needed - the app picks up changes from env vars

## Common Tasks

### Adding a New API Endpoint

1. **Define types in `types/api.ts` or `types/<domain>.ts`:**
```typescript
export interface MyResponse {
  id: string;
  name: string;
}
```

2. **Call via apiClient:**
```typescript
const data = await apiClient.post<MyResponse>('/my-endpoint/', payload);
const list = await apiClient.get<MyResponse[]>('/my-endpoint/');
```

3. **Handle errors:**
```typescript
try {
  const result = await apiClient.post<MyResponse>(url, data);
} catch (error: unknown) {
  const apiError = error as ApiError;
  setError(apiError.message);
}
```

### Creating a Custom Hook for a Feature

**hooks/useProducts.ts:**
```typescript
import { useState, useEffect } from 'react';
import { apiClient } from '@/utils/api';
import type { Product } from '@/types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<Product[]>('/products/');
      setProducts(data);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}
```

### Using Error Boundary

Wrap screens or components that might throw errors:

```typescript
import { ErrorBoundary } from "@/Components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

## Best Practices

### ✅ DO:
- Use the `apiClient` for all API calls
- Validate inputs before sending to API
- Type all API responses
- Handle errors gracefully
- Use custom hooks for repeated logic
- Clear sensitive data from console logs
- Wrap auth providers around app tree
- Use environment variables for configuration

### ❌ DON'T:
- Call `fetch()` directly (use `apiClient`)
- Hardcode URLs in components
- Store sensitive data in state (use SecureStore)
- Ignore error responses
- Use generic `any` types (use proper TypeScript)
- Log sensitive user data
- Make API calls without error handling
- Skip input validation

## Security Checklist

- [ ] Api credentials in `.env` (not hardcoded)
- [ ] Sensitive tokens stored in SecureStore
- [ ] Input validation on all API calls
- [ ] No sensitive data in console logs
- [ ] Error messages don't expose system details
- [ ] Token refresh implemented
- [ ] Logout clears sensitive data
- [ ] API errors handled gracefully

## Debugging

### Check Auth State
```typescript
const { user, loading, isAuthenticated } = useAuth();
console.log({ user, loading, isAuthenticated });
```

### View Network Requests
Use Expo's built-in DevTools or network inspector to see API calls and responses.

### Validate Environment Variables
```typescript
import Constants from 'expo-constants';
console.log(Constants.expoConfig?.extra);
```

## Testing

Create tests for:
- API client methods
- Input validation functions
- Auth context behavior
- Custom hooks

Example:
```typescript
import { validateEmail } from '@/utils/validation';

test('validateEmail should return true for valid email', () => {
  expect(validateEmail('test@example.com')).toBe(true);
  expect(validateEmail('invalid.email')).toBe(false);
});
```

## Performance Optimization

1. **Code Splitting:** Use Expo Router's built-in lazy loading
2. **Images:** Use `expo-image` instead of `Image`
3. **State:** Lift state only as high as needed
4. **Memoization:** Use `React.memo()` for expensive components
5. **API Calls:** Cache responses when appropriate

## Troubleshooting

### API calls failing
- Check `.env` file is updated
- Verify endpoint URLs in environment variables
- Check network connectivity
- Review error message from API

### Auth state not persisting
- Ensure SecureStore is working on your device
- Check browser console for storage errors
- Verify tokens are being saved properly

### Type errors in TypeScript
- Import types from `types/` folder
- Use proper type casting with `as` keyword
- Check that API response types match actual responses

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

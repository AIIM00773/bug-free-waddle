
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './Providers/AuthProvider.tsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { ProductContextProvider } from './Providers/ProductsProvider.tsx'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductContextProvider>
          <App />
        </ProductContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
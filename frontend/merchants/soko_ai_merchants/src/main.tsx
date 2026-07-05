
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './Providers/AuthProvider.tsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { ProductContextProvider } from './Providers/ProductsProvider.tsx'
import { BranchContextProvider } from './Providers/BranchProvider.tsx'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BranchContextProvider>
          <ProductContextProvider>
            <App />
          </ProductContextProvider>
        </BranchContextProvider>

      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
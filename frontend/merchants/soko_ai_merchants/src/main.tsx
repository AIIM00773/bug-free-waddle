
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './Providers/AuthProvider.tsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 1. Wrap everything in the Router */}
    <BrowserRouter>
      {/* 2. Then the AuthProvider */}
      <AuthProvider>
        {/* 3. Then your App or Routes */}
        <App /> 
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
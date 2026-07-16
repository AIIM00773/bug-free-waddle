
import './index.css'
import App from './App.tsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './Providers/AuthProvider.tsx'
import {InventoryContextProvider} from "./Providers/InventoryProvider.tsx";
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <InventoryContextProvider>
            <App />
         </InventoryContextProvider>

      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

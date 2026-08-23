import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ReactDOM from 'react-dom/client'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import App from "./App";


import { AuthProvider } from "./Providers/profileContext";
import {CheckoutProvider } from "./Providers/CheckoutContext";
import {CartProvider} from "./Providers/CartContext"
import {SearchProvider} from "./Providers/SearchContext"; 


import{SidebarProvider} from "./Providers/ui/sidebar";
import {SettingsProvider} from "./Providers/ui/settings";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
  <BrowserRouter>
  <SidebarProvider>
  <SettingsProvider>
    <AuthProvider>
    <SearchProvider>
    <CartProvider>
    <CheckoutProvider>
          <App/>
    </CheckoutProvider>
    </CartProvider> 
    </SearchProvider> 
    </AuthProvider>
    </SettingsProvider>
  </SidebarProvider>

    </BrowserRouter>
  </React.StrictMode>
);




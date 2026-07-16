import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ReactDOM from 'react-dom/client'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import App from "./App";


import { AuthProvider } from "./Providers/AuthContex";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
          <App/>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

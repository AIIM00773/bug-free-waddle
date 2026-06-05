import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import ShopPage from "./Home"; // (rename later to ShopPage.tsx for clarity)
import AuthPage from "./Auth"; // (if you have an auth page, otherwise remove this import)
import CartPage from "./Cart"; // (if you have a cart page, otherwise remove this import)
import ProfilePage from "./Profile"; // (if you have a profile page, otherwise remove this import)

import { AuthProvider } from "./Providers/AuthContex"; // (if you have an auth context, otherwise remove this import)

const router = createBrowserRouter([
  {
    path: "/",
    element: <ShopPage />,
  },
  {
    path: "/home",
    element: <App />,
  },

    {
    path: "/shop",
    element: <ShopPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  }

]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);






// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import './index.css'
// import App from './App.tsx'
// import CustomAdminDashboard from './Admin.tsx'
// import ErrorPage from './ErrorPage.tsx'
// import { AdminAuthProvider } from './contex/AdminContex/AuthContext.tsx'
// import { WorkerProvider } from './contex/AdminContex/WorkerContext.tsx'
// import { MarketplaceProvider } from './contex/AdminContex/MarketplaceContex.tsx'
// import { DatabaseProvider } from './contex/AdminContex/DatabaseContext.tsx'
// // 1. Define your client-side routes mapping URLs to your components
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />, // Your main layout or landing page
//   },
//   {
//     path: "/admin-valid",

//     element: <AdminAuthProvider>
//       <MarketplaceProvider>
//         <WorkerProvider>
//           <DatabaseProvider>
//           <CustomAdminDashboard />,
//           </DatabaseProvider>
//         </WorkerProvider>
//       </MarketplaceProvider>
//     </AdminAuthProvider>
//   },
//   {
//     path: "*",
//     element: <ErrorPage />
//   }
// ]);

// // 2. Render the RouterProvider instead of nesting <App /> directly
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <RouterProvider router={router} />
//   </StrictMode>,
// )
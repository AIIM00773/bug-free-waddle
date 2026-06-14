import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import App from "./App";
import ShopPage from "./Home";
import AuthPage from "./Auth";
import ProfilePage from "./Profile";
import AboutPage from "./Aboutus";
import GlobalErrorBoundary from "./Components/GlobalErrorBoundary";

import { AuthProvider } from "./Providers/AuthContex";
import { ConversationProvider } from "./Providers/ConversationContext";
import { CartProvider } from "./Providers/CartProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        index: true,
        element: <ShopPage />,
      },
      {
        path: "home",
        element: <App />,
      },
      {
        path: "shop",
        element: <ShopPage />,
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "about",
        element: <AboutPage />
      }
    ]
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ConversationProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </ConversationProvider>
    </AuthProvider>
  </StrictMode>
);
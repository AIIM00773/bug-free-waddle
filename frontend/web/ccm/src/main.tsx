import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import ShopPage from "./Home"; // (rename later to ShopPage.tsx for clarity)
import AuthPage from "./Auth"; // (if you have an auth page, otherwise remove this import)
import CartPage from "./Cart"; // (if you have a cart page, otherwise remove this import)
import ProfilePage from "./Profile"; // (if you have a profile page, otherwise remove this import)
import HelpSupportPage from "./HelpAndSupport";
import AboutPage from "./Aboutus";
import { AuthProvider } from "./Providers/AuthContex"; // (if you have an auth context, otherwise remove this import)
import { ConversationProvider } from "./Providers/ConversationContext";

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
  },
  {
    path: "/support",
    element: <HelpSupportPage />
  },
  {
    path: "/about",
    element: <AboutPage />
  }

]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ConversationProvider>
        <RouterProvider router={router} />
      </ConversationProvider>
    </AuthProvider>
  </StrictMode>
);





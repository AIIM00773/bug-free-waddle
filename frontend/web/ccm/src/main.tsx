import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import App from "./App";
import ShopPage from "./Home"; 
import AuthPage from "./Auth"; 
import ProfilePage from "./Profile"; 
import AboutPage from "./Aboutus";
import GlobalErrorBoundary from "./Components/GlobalErrorBoundary"; // <-- Import error component

import { AuthProvider } from "./Providers/AuthContex"; 
import { ConversationProvider } from "./Providers/ConversationContext";

// Nested Route Topography setup for centralized error capturing
const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />, // Acts as a clean structural mounting anchor for nested child components
    errorElement: <GlobalErrorBoundary />, // Catch-all bubble net for 404, 500, and JavaScript code explosions
    children: [
      {
        index: true, // Matches exactly "/"
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
        <RouterProvider router={router} />
      </ConversationProvider>
    </AuthProvider>
  </StrictMode>
);
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AdminAuthProvider } from './Providers.tsx/AdminAuthContext.tsx'



import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { CatalogProvider } from './Providers.tsx/CatalogContext.tsx'
import { MarketplaceProvider } from './Providers.tsx/MarketplacesContex.tsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <App />,
    children: [
      {
        index: true,
        element: <App />,
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminAuthProvider>
      <CatalogProvider>
        <MarketplaceProvider>
          <RouterProvider router={router} />
        </MarketplaceProvider>
      </CatalogProvider>
    </AdminAuthProvider>
  </StrictMode>,
)

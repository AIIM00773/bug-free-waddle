import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AdminAuthProvider } from './Providers.tsx/AdminAuthContext.tsx'



import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { CatalogProvider } from './Providers.tsx/CatalogContext.tsx'

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
        <RouterProvider router={router} />
      </CatalogProvider>
    </AdminAuthProvider>
  </StrictMode>,
)

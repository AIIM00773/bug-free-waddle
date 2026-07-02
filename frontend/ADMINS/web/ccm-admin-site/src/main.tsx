import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.tsx';

// Import the consolidated engine wrapper
import { AdminWorkspaceProviders } from './Providers.tsx/_indexProvider.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminWorkspaceProviders>
      <RouterProvider router={router} />
    </AdminWorkspaceProviders>
  </StrictMode>
);
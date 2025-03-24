
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/auth/AuthContext';

import { AppLayout } from './components/layout/AppLayout'; // Changed from default to named import
import LoginPage from './pages/LoginPage';
import WorkflowsPage from './pages/WorkflowsPage';
import WorkflowPage from './pages/WorkflowPage';
import AccountSelectPage from './pages/AccountSelectPage';
import NotFound from './pages/NotFound';
import SettingsPage from './pages/SettingsPage';

// Export the router so it can be imported in App.tsx
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <AppLayout />
    ),
    children: [
      {
        path: '/',
        element: <WorkflowsPage />,
      },
      {
        path: '/workflows',
        element: <WorkflowsPage />,
      },
      {
        path: '/workflow/:id',
        element: <WorkflowPage />,
      },
      {
        path: '/account-select',
        element: <AccountSelectPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default function Routes() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

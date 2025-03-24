
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/auth/AuthContext';
import { WorkflowProvider } from './contexts/WorkflowContext';

import { AppLayout } from './components/layout/AppLayout'; // Use named import
import LoginPage from './pages/LoginPage';
import WorkflowsPage from './pages/WorkflowsPage';
import WorkflowPage from './pages/WorkflowPage';
import AccountSelectPage from './pages/AccountSelectPage';
import NotFound from './pages/NotFound';
import SettingsPage from './pages/SettingsPage';

// Create and export the router
export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    ),
  },
  {
    path: '/',
    element: (
      <AuthProvider>
        <WorkflowProvider>
          <AppLayout />
        </WorkflowProvider>
      </AuthProvider>
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

// Export the Routes component as default
export default function Routes() {
  return <RouterProvider router={router} />;
}

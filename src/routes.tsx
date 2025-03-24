
import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/auth/AuthContext';
import { WorkflowProvider } from './contexts/WorkflowContext';
import { useMsw } from './contexts/msw/MswContext';

import { AppLayout } from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import WorkflowsPage from './pages/WorkflowsPage';
import WorkflowPage from './pages/WorkflowPage';
import AccountSelectPage from './pages/AccountSelectPage';
import NotFound from './pages/NotFound';
import SettingsPage from './pages/SettingsPage';
import SubscribePage from './pages/SubscribePage';
import Documentation from './pages/Documentation';

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-medium">Initializing app...</h2>
        <p className="text-muted-foreground mt-2">Setting up mock API services</p>
      </div>
    </div>
  );
}

// Create the router
export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    index: true,
  },
  {
    path: '/subscribe',
    element: <SubscribePage />,
  },
  {
    path: '/docs',
    element: <Documentation />,
  },
  {
    path: '/login',
    element: (
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    ),
  },
  {
    path: '/accounts',
    element: (
      <AuthProvider>
        <AccountSelectPage />
      </AuthProvider>
    ),
  },
  {
    path: ':accountId',
    element: (
      <AuthProvider>
        <WorkflowProvider>
          <AppLayout />
        </WorkflowProvider>
      </AuthProvider>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="workflows" replace />,
      },
      {
        path: 'workflows',
        element: <WorkflowsPage />,
      },
      {
        path: 'workflow/:id',
        element: <WorkflowPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

// Export the Routes component with MSW loading state
export default function Routes() {
  const { isMswLoading } = useMsw();
  
  if (isMswLoading && process.env.NODE_ENV !== 'production') {
    return <LoadingScreen />;
  }
  
  return <RouterProvider router={router} />;
}

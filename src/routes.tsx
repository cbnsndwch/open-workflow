
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import WorkflowsPage from "./pages/WorkflowsPage";
import WorkflowPage from "./pages/WorkflowPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import { useAuth } from "./contexts/AuthContext";

// Protected route component
const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Navigate to="/workflows" replace />
          },
          {
            path: "workflows",
            element: <WorkflowsPage />
          },
          {
            path: "workflow/:id",
            element: <WorkflowPage />
          },
          {
            path: "settings",
            element: <div className="p-6">Settings page coming soon</div>
          },
        ]
      },
      {
        path: "help",
        element: <div className="p-6">Help page coming soon</div>
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

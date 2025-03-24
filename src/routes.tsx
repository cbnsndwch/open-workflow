
import { createBrowserRouter, Navigate, Outlet, LoaderFunctionArgs, redirect } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import WorkflowsPage from "./pages/WorkflowsPage";
import WorkflowPage from "./pages/WorkflowPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Auth check loader function
export async function authLoader({ request }: LoaderFunctionArgs) {
  // Check if user is authenticated
  const authData = localStorage.getItem('auth');
  
  // If no auth data is found, redirect to login
  if (!authData) {
    // Get the current path to redirect back after login
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Return a redirect with the current path as a search param
    return redirect(`/login?redirectTo=${path}`);
  }
  
  try {
    // User is authenticated, return the parsed auth data with a standard structure
    const parsedData = JSON.parse(authData);
    return { 
      user: parsedData.user || null,
      organizations: parsedData.organizations || []
    };
  } catch (error) {
    console.error("Error parsing auth data:", error);
    localStorage.removeItem('auth'); // Clear invalid data
    return redirect('/login');
  }
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        // Root path redirects to workflows
        index: true,
        loader: authLoader,
        element: <Navigate to="/workflows" replace />
      },
      {
        path: "workflows",
        loader: authLoader,
        element: <WorkflowsPage />
      },
      {
        path: "workflow/:id",
        loader: authLoader,
        element: <WorkflowPage />
      },
      {
        path: "settings",
        loader: authLoader,
        element: <div className="p-6">Settings page coming soon</div>
      },
      {
        path: "help",
        element: <div className="p-6">Help page coming soon</div>
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "*",
    element: <NotFound />,
    errorElement: <ErrorBoundary />
  }
]);

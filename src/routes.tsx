
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import WorkflowsPage from "./pages/WorkflowsPage";
import WorkflowPage from "./pages/WorkflowPage";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
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
      {
        path: "help",
        element: <div className="p-6">Help page coming soon</div>
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

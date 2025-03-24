
import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useWorkflowContext } from '@/contexts/workflow';
import WorkflowEditor from '@/components/WorkflowEditor';
import NodePalette from '@/components/NodePalette';
import { Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WorkflowPage = () => {
  const { id } = useParams();
  const { user, currentAccount } = useAuth();
  const { getWorkflowById } = useWorkflowContext();
  
  const workflow = id ? getWorkflowById(id) : undefined;
  const [showNodePalette, setShowNodePalette] = useState(true);
  
  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is logged in but no account is selected, redirect to account selection
  if (user && !currentAccount) {
    return <Navigate to="/accounts" replace />;
  }
  
  if (!workflow) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Workflow Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The workflow you are looking for could not be found.
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex">
      {/* Node Palette Sidebar */}
      {showNodePalette && (
        <div className="w-64 border-r border-border/30 bg-background overflow-auto flex flex-col">
          <div className="p-4 border-b border-border/30 flex items-center justify-between">
            <h2 className="font-semibold">Workflow Editor</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <NodePalette />
          </div>
          <div className="p-4 border-t border-border/30">
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2 justify-start"
              onClick={() => console.log("Settings clicked")}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden bg-muted/20">
          <WorkflowEditor 
            initialWorkflow={workflow} 
            onChange={(updatedWorkflow) => {
              console.log("Workflow updated:", updatedWorkflow);
            }}
          />
        </div>
        
        {/* Bottom Controls */}
        <div className="flex justify-between items-center p-2 border-t border-border/30 bg-background">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => console.log("Zoom out")}>
              <span className="text-xl">-</span>
            </Button>
            <div className="w-24 h-1 bg-gray-200 rounded-full"></div>
            <Button variant="outline" size="icon" onClick={() => console.log("Zoom in")}>
              <span className="text-xl">+</span>
            </Button>
            <span className="ml-2 text-sm text-muted-foreground">50%</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => console.log("Fullscreen")}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2H13V13H2V2Z" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M5.5 5.5V1.5H1.5" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M9.5 5.5V1.5H13.5" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M5.5 9.5V13.5H1.5" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M9.5 9.5V13.5H13.5" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => console.log("Reset view")}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPage;

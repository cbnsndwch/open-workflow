
import React, { useState, useEffect } from 'react';
import { WorkflowGraph } from '@/lib/workflow/types';
import {
  parseJsonWorkflow,
  serializeWorkflowToJson,
  validateWorkflow,
  traverseWorkflow,
  findStartNodes,
  findTerminalNodes,
} from '@/lib/workflow';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import WorkflowVisualizer from './WorkflowVisualizer';

interface WorkflowEditorProps {
  initialWorkflow?: WorkflowGraph;
  onChange?: (workflow: WorkflowGraph) => void;
  className?: string;
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
  initialWorkflow,
  onChange,
  className,
}) => {
  const [workflowJson, setWorkflowJson] = useState<string>('');
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowGraph | undefined>(initialWorkflow);
  const [activeTab, setActiveTab] = useState('visual');
  
  useEffect(() => {
    if (initialWorkflow) {
      setActiveWorkflow(initialWorkflow);
      setWorkflowJson(serializeWorkflowToJson(initialWorkflow));
      validateWorkflowJson(serializeWorkflowToJson(initialWorkflow));
    }
  }, [initialWorkflow]);
  
  const validateWorkflowJson = (json: string) => {
    try {
      const workflow = parseJsonWorkflow(json);
      const validation = validateWorkflow(workflow);
      
      if (validation.valid) {
        setValidationMessage('Workflow is valid');
        setIsValid(true);
        
        // Analyze workflow
        const startNodes = findStartNodes(workflow);
        const terminalNodes = findTerminalNodes(workflow);
        
        let nodeCount = 0;
        traverseWorkflow(workflow, () => {
          nodeCount++;
        });
        
        setValidationMessage(
          `Workflow is valid. ${startNodes.length} start node(s), ${terminalNodes.length} terminal node(s), ${nodeCount} reachable node(s).`
        );
        
        setActiveWorkflow(workflow);
        
        if (onChange) {
          onChange(workflow);
        }
      } else {
        const errorMessages = validation.errors.map(e => e.message).join(', ');
        setValidationMessage(`Workflow is invalid: ${errorMessages}`);
        setIsValid(false);
      }
    } catch (error) {
      setValidationMessage(`Invalid JSON: ${(error as Error).message}`);
      setIsValid(false);
    }
  };
  
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newJson = e.target.value;
    setWorkflowJson(newJson);
  };
  
  const handleValidate = () => {
    validateWorkflowJson(workflowJson);
  };
  
  const formatJson = () => {
    try {
      const parsed = JSON.parse(workflowJson);
      setWorkflowJson(JSON.stringify(parsed, null, 2));
      toast.success('JSON formatted successfully');
    } catch (error) {
      toast.error(`Invalid JSON: ${(error as Error).message}`);
    }
  };
  
  const handleWorkflowChange = (updatedWorkflow: WorkflowGraph) => {
    setActiveWorkflow(updatedWorkflow);
    setWorkflowJson(serializeWorkflowToJson(updatedWorkflow));
    
    if (onChange) {
      onChange(updatedWorkflow);
    }
  };
  
  return (
    <div className={`workflow-editor ${className || ''}`}>
      <div className="workflow-editor-header flex justify-between items-center">
        <h3 className="text-lg font-medium">Workflow Editor</h3>
        <div className={`workflow-badge ${isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isValid ? 'Valid' : 'Invalid'}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="mb-4">
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visual" className="min-h-[400px]">
          {activeWorkflow && (
            <WorkflowVisualizer 
              workflow={activeWorkflow} 
              onWorkflowChange={handleWorkflowChange}
              readOnly={false}
              className="h-[500px]"
            />
          )}
        </TabsContent>
        
        <TabsContent value="json">
          <textarea
            className="code-editor font-mono w-full"
            value={workflowJson}
            onChange={handleJsonChange}
            placeholder="Paste workflow JSON here..."
          />
          
          <div className="workflow-controls mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleValidate}
            >
              Validate
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={formatJson}
              className="ml-2"
            >
              Format
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {validationMessage && (
        <div className={`mt-4 p-3 rounded-md text-sm ${isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {validationMessage}
        </div>
      )}
    </div>
  );
};

export default WorkflowEditor;

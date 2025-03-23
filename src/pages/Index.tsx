
import React, { useState, useEffect } from 'react';
import WorkflowVisualizer from '@/components/WorkflowVisualizer';
import WorkflowEditor from '@/components/WorkflowEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WorkflowGraph } from '@/lib/workflow/types';
import { executeWorkflow, defaultNodeExecutor } from '@/lib/workflow/executor';
import { toast } from 'sonner';

// Example workflow from the specification
const exampleWorkflow: WorkflowGraph = {
  "nodes": [
    {
      "id": "cca820ee-0d8e-4220-8ffd-41e49e094660",
      "kind": "core:triggers:manual",
      "version": "1.0.0",
      "name": "Manual"
    },
    {
      "id": "eaae0678-09e7-4042-aa90-c5635f3a2625",
      "kind": "core:http_request",
      "version": "4.2.0",
      "name": "Get Table of Contents"
    },
    {
      "id": "99996bc0-809d-422d-bc1a-2868bd7e55fb",
      "kind": "core:split_input",
      "version": "1.0.0",
      "name": "Split Out Items"
    },
    {
      "id": "b3408535-9f25-401e-9afd-843c9b200cde",
      "kind": "core:filter",
      "version": "2.2.0",
      "name": "Keep HTTP Services Only"
    },
    {
      "id": "50abc6d6-ee14-4721-9dc1-06d25434cd4c",
      "kind": "core:code",
      "version": "2.0.0",
      "name": "Map Operations"
    },
    {
      "id": "20b98b6a-143c-468c-9e51-f2d6fd9deb52",
      "kind": "core:switch",
      "version": "3.2.0",
      "name": "Filter Operations With Errors"
    },
    {
      "id": "95e01fe1-7ff6-43cf-9790-eed0990d69ac",
      "kind": "core:no_op",
      "version": "1.0.0",
      "name": "Mapped Services"
    },
    {
      "id": "5193bab9-d7ee-40b0-b13e-9c84e187d63c",
      "kind": "core:set",
      "version": "3.4.0",
      "name": "Services"
    },
    {
      "id": "57c44dad-398b-42f2-873a-48eebd4e3019",
      "kind": "core:no_op",
      "version": "1.0.0",
      "name": "Services With Errors"
    },
    {
      "id": "40e404ff-e576-4472-bf07-e49d5ea2825f",
      "kind": "core:http_request",
      "version": "4.2.0",
      "name": "Get Service Nodes"
    },
    {
      "kind": "core:http_request",
      "version": "4.2.0",
      "id": "a139a82b-fd25-42e4-8efe-24aedd5efa89",
      "name": "Get Bundled Spec"
    },
    {
      "id": "e3d784b5-96d7-4756-9d5b-d01d16c064fc",
      "kind": "noco_db:action",
      "version": "3.0.0",
      "name": "Latest Known Spec"
    },
    {
      "id": "be3523bc-fdc6-442b-8c86-538ccab6504b",
      "kind": "noco_db:action",
      "version": "3.0.0",
      "name": "NocoDB"
    },
    {
      "id": "7f04e2aa-86cc-4b82-a5b5-3d3c76b5e351",
      "kind": "core:if",
      "version": "2.2.0",
      "name": "Is Known Service?"
    },
    {
      "id": "ad394f1f-d312-4167-bb1e-07df18b3738d",
      "kind": "core:code",
      "version": "2.0.0",
      "name": "Match Found, Check For Changes"
    },
    {
      "id": "810ee533-d784-4b66-9d38-82321728b3be",
      "kind": "core:switch",
      "version": "3.2.0",
      "name": "Has Changes?"
    },
    {
      "id": "53dc9809-be9a-4686-8509-8929f56f89a4",
      "kind": "core:aggregate",
      "version": "1.0.0",
      "name": "Aggregate"
    }
  ],
  "edges": {
    "Manual": {
      "main": [
        {
          "node": "Get Table of Contents",
          "port": "main",
          "order": 0
        }
      ]
    },
    "Get Table of Contents": {
      "main": [
        {
          "node": "Split Out Items",
          "port": "main",
          "order": 0
        }
      ]
    },
    "Split Out Items": {
      "main": [
        {
          "node": "Keep HTTP Services Only",
          "port": "main",
          "order": 0
        }
      ]
    },
    "Keep HTTP Services Only": {
      "main": [
        {
          "node": "Map Operations",
          "port": "main",
          "order": 0
        }
      ]
    },
    "Map Operations": {
      "main": [
        {
          "node": "Filter Operations With Errors",
          "port": "main",
          "order": 0
        }
      ]
    },
    "Filter Operations With Errors": {
      "main": [
        {
          "node": "Services With Errors",
          "port": "main",
          "order": 0
        },
        {
          "node": "Mapped Services",
          "port": "main",
          "order": 0
        }
      ]
    },
    "Mapped Services": {
      "main": [
        {
          "node": "Services",
          "port": "main",
          "order": 0
        }
      ]
    },
    "Services": {
      "main": [
        {
          "node": "Get Service Nodes",
          "port": "main",
          "order": 0
        }
      ]
    },
    "Get Service Nodes": {
      "main": [
        {
          "node": "Get Bundled Spec",
          "port": "main",
          "order": 0
        }
      ]
    },
    "Get Bundled Spec": {
      "main": [
        {
          "node": "Latest Known Spec",
          "port": "main",
          "order": 0
        }
      ]
    },
    "Latest Known Spec": {
      "main": [
        {
          "node": "Is Known Service?",
          "port": "main",
          "order": 0
        }
      ]
    },
    "Is Known Service?": {
      "main": [
        {
          "node": "Match Found, Check For Changes",
          "port": "main",
          "order": 0
        },
        {
          "node": "NocoDB",
          "port": "main",
          "order": 0
        }
      ]
    },
    "Match Found, Check For Changes": {
      "main": [
        {
          "node": "Has Changes?",
          "port": "main",
          "order": 0
        }
      ]
    },
    "Has Changes?": {
      "main": [
        {
          "node": "Aggregate",
          "port": "main",
          "order": 0
        }
      ]
    },
    "NocoDB": {
      "main": [
        {
          "node": "Aggregate",
          "port": "main",
          "order": 0
        }
      ]
    }
  }
};

// Simple workflow
const simpleWorkflow: WorkflowGraph = {
  "nodes": [
    {
      "id": "start-node",
      "kind": "core:triggers:manual",
      "version": "1.0.0",
      "name": "Start"
    },
    {
      "id": "process-node",
      "kind": "core:process",
      "version": "1.0.0",
      "name": "Process"
    },
    {
      "id": "decision-node",
      "kind": "core:decision",
      "version": "1.0.0",
      "name": "Decision"
    },
    {
      "id": "success-node",
      "kind": "core:success",
      "version": "1.0.0",
      "name": "Success"
    },
    {
      "id": "failure-node",
      "kind": "core:failure",
      "version": "1.0.0",
      "name": "Failure"
    }
  ],
  "edges": {
    "Start": {
      "main": [
        {
          "node": "Process",
          "port": "main",
          "order": 0
        }
      ]
    },
    "Process": {
      "main": [
        {
          "node": "Decision",
          "port": "main",
          "order": 0
        }
      ]
    },
    "Decision": {
      "success": [
        {
          "node": "Success",
          "port": "main",
          "order": 0
        }
      ],
      "failure": [
        {
          "node": "Failure",
          "port": "main",
          "order": 0
        }
      ]
    }
  }
};

const Index = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowGraph>(simpleWorkflow);
  const [activeTab, setActiveTab] = useState<string>('visualizer');
  const [executionStatus, setExecutionStatus] = useState<string>('');
  const [executionNodes, setExecutionNodes] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('simple');
  
  useEffect(() => {
    // Set the workflow based on selection
    if (selectedWorkflow === 'simple') {
      setActiveWorkflow(simpleWorkflow);
    } else {
      setActiveWorkflow(exampleWorkflow);
    }
  }, [selectedWorkflow]);
  
  const handleNodeClick = (nodeId: string) => {
    // Find the node by ID
    const node = activeWorkflow.nodes.find(n => n.id === nodeId);
    if (node) {
      toast.info(`Node: ${node.name}`, {
        description: `Kind: ${node.kind}, Version: ${node.version}`,
      });
    }
  };
  
  const handleWorkflowChange = (workflow: WorkflowGraph) => {
    setActiveWorkflow(workflow);
  };
  
  const executeActiveWorkflow = async () => {
    setIsExecuting(true);
    setExecutionStatus('Executing workflow...');
    setExecutionNodes([]);
    
    const visitedNodes: string[] = [];
    
    try {
      const result = await executeWorkflow(activeWorkflow, {
        nodeExecutors: {
          // Example custom node executor
          'core:http_request': async (node, inputs, context) => {
            console.log(`Executing HTTP request node: ${node.name}`);
            // Simulate an HTTP request
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
              outputs: {
                main: { status: 200, data: { message: 'Success' } }
              }
            };
          }
        },
        onNodeStart: (nodeId) => {
          const node = activeWorkflow.nodes.find(n => n.id === nodeId);
          if (node) {
            visitedNodes.push(node.name);
            setExecutionNodes([...visitedNodes]);
            setExecutionStatus(`Executing node: ${node.name}`);
          }
        },
        onNodeComplete: (nodeId, result) => {
          const node = activeWorkflow.nodes.find(n => n.id === nodeId);
          if (node) {
            setExecutionStatus(`Completed node: ${node.name}`);
          }
        },
        onNodeError: (nodeId, error) => {
          const node = activeWorkflow.nodes.find(n => n.id === nodeId);
          if (node) {
            setExecutionStatus(`Error executing node: ${node.name} - ${error.message}`);
          }
        }
      });
      
      if (result.successful) {
        setExecutionStatus('Workflow execution completed successfully');
        toast.success('Workflow executed successfully');
      } else {
        setExecutionStatus(`Workflow execution completed with errors: ${Object.keys(result.errors).length} errors`);
        toast.error('Workflow execution failed');
      }
    } catch (error) {
      setExecutionStatus(`Workflow execution failed: ${(error as Error).message}`);
      toast.error(`Execution failed: ${(error as Error).message}`);
    } finally {
      setIsExecuting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl heading-gradient mb-2">Workflow Graph Traversal</h1>
          <p className="subheading mx-auto">
            A powerful TypeScript library for creating, managing, and executing workflow graphs with ease.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card col-span-1">
            <CardHeader>
              <CardTitle>Workflow Selection</CardTitle>
              <CardDescription>Choose a workflow to visualize and edit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={selectedWorkflow === 'simple' ? 'default' : 'outline'}
                    onClick={() => setSelectedWorkflow('simple')}
                    className="flex-1"
                  >
                    Simple Workflow
                  </Button>
                  <Button
                    variant={selectedWorkflow === 'complex' ? 'default' : 'outline'}
                    onClick={() => setSelectedWorkflow('complex')}
                    className="flex-1"
                  >
                    Complex Workflow
                  </Button>
                </div>
                
                <Button 
                  onClick={executeActiveWorkflow} 
                  disabled={isExecuting}
                  className="w-full"
                >
                  {isExecuting ? 'Executing...' : 'Execute Workflow'}
                </Button>
                
                {executionStatus && (
                  <Alert>
                    <AlertTitle>Execution Status</AlertTitle>
                    <AlertDescription className="text-sm">{executionStatus}</AlertDescription>
                  </Alert>
                )}
                
                {executionNodes.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Execution Path:</h4>
                    <div className="bg-gray-50 p-3 rounded-md text-xs">
                      {executionNodes.join(' → ')}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card col-span-1 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Workflow SDK</CardTitle>
              <CardDescription>Explore and interact with the workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="visualizer" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="visualizer">Visualizer</TabsTrigger>
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                </TabsList>
                
                <TabsContent value="visualizer" className="mt-0">
                  <WorkflowVisualizer 
                    workflow={activeWorkflow} 
                    onNodeClick={handleNodeClick}
                  />
                </TabsContent>
                
                <TabsContent value="editor" className="mt-0">
                  <WorkflowEditor 
                    initialWorkflow={activeWorkflow}
                    onChange={handleWorkflowChange}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Graph Validation</CardTitle>
              <CardDescription>Ensure workflow integrity</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Node structure validation
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Edge connectivity checks
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Cycle detection
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Port compatibility validation
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Traversal Utilities</CardTitle>
              <CardDescription>Navigate complex workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Find start and terminal nodes
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Get all possible execution paths
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Topological sorting
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Advanced cycle handling
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Execution Engine</CardTitle>
              <CardDescription>Run workflows with ease</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Async node execution
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Custom node executors
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Execution lifecycle hooks
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  State management during execution
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <Separator className="my-8" />
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Powerful. Intuitive. Extensible.</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Build complex workflows with a type-safe, extensible library that handles everything from validation to execution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

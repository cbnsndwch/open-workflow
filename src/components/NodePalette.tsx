
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X } from 'lucide-react';

// Define available node types
const nodeTypes = [
  { type: 'core:triggers:manual', name: 'Manual Trigger', description: 'A manual trigger to start the workflow' },
  { type: 'core:http_request', name: 'HTTP Request', description: 'Make HTTP requests to external services' },
  { type: 'core:switch', name: 'Switch', description: 'Conditional branching based on input' },
  { type: 'core:code', name: 'Code', description: 'Execute custom code' },
  { type: 'core:if', name: 'If Condition', description: 'Simple condition evaluation' },
  { type: 'core:no_op', name: 'No Operation', description: 'Pass-through node' },
  { type: 'core:set', name: 'Set Value', description: 'Set or modify a value' },
  { type: 'noco_db:action', name: 'Database Action', description: 'Perform database operations' },
  { type: 'core:aggregate', name: 'Aggregate', description: 'Combine multiple inputs' },
  { type: 'core:filter', name: 'Filter', description: 'Filter data based on conditions' },
  { type: 'core:split_input', name: 'Split Input', description: 'Split input into multiple paths' },
];

interface NodePaletteProps {
  onSelect: (nodeType: string, nodeName: string) => void;
  onClose: () => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const [nodeName, setNodeName] = useState('');

  const filteredNodeTypes = nodeTypes.filter(
    node => node.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            node.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (nodeType: string) => {
    setSelectedNodeType(nodeType);
    // Generate a default name based on the node type
    const baseName = nodeType.split(':').pop() || 'Node';
    setNodeName(baseName.charAt(0).toUpperCase() + baseName.slice(1));
  };

  const handleAdd = () => {
    if (selectedNodeType && nodeName.trim()) {
      onSelect(selectedNodeType, nodeName.trim());
    }
  };

  return (
    <Card className="w-[500px] max-h-[80vh] shadow-xl">
      <CardHeader className="pb-4 flex flex-row justify-between items-center">
        <CardTitle>Add Node</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="max-h-[60vh] overflow-auto">
        {!selectedNodeType ? (
          <>
            <Input
              placeholder="Search node types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <div className="grid gap-2">
              {filteredNodeTypes.map((node) => (
                <Button
                  key={node.type}
                  variant="outline"
                  className="h-auto py-3 justify-start text-left flex flex-col items-start"
                  onClick={() => handleSelect(node.type)}
                >
                  <span className="font-medium">{node.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">{node.description}</span>
                  <span className="text-xs text-muted-foreground mt-1 opacity-60">{node.type}</span>
                </Button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Node Type</p>
              <div className="bg-muted p-2 rounded text-sm">
                {selectedNodeType}
              </div>
            </div>
            <div>
              <label htmlFor="node-name" className="text-sm font-medium mb-2 block">
                Node Name
              </label>
              <Input
                id="node-name"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                placeholder="Enter node name"
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        {selectedNodeType ? (
          <>
            <Button variant="outline" onClick={() => setSelectedNodeType(null)}>
              Back
            </Button>
            <Button onClick={handleAdd} disabled={!nodeName.trim()}>
              Add Node
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={onClose} className="ml-auto">
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default NodePalette;

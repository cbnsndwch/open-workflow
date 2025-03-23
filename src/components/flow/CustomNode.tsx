
import React from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface CustomNodeProps {
  data: {
    label: string;
    kind: string;
    isTerminal: boolean;
    onAddNode: (nodeId: string) => void;
    id: string;
  };
  selected: boolean;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data, selected }) => {
  const nodeTypeColors: Record<string, string> = {
    'core:triggers:manual': 'bg-blue-100 border-blue-400',
    'core:http_request': 'bg-purple-100 border-purple-400',
    'core:switch': 'bg-yellow-100 border-yellow-400',
    'core:code': 'bg-green-100 border-green-400',
    'core:if': 'bg-orange-100 border-orange-400',
    'core:no_op': 'bg-gray-100 border-gray-400',
    'core:set': 'bg-indigo-100 border-indigo-400',
    'noco_db:action': 'bg-pink-100 border-pink-400',
    'core:aggregate': 'bg-teal-100 border-teal-400',
    'core:filter': 'bg-red-100 border-red-400',
    'core:split_input': 'bg-emerald-100 border-emerald-400',
    'default': 'bg-white border-gray-300',
  };
  
  const nodeColor = nodeTypeColors[data.kind] || nodeTypeColors.default;
  
  return (
    <div className={`px-4 py-2 rounded-lg shadow-sm border ${nodeColor} ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="font-medium text-gray-800">{data.label}</div>
      <div className="text-xs text-gray-500 mt-1">{data.kind}</div>
      {!data.isTerminal && (
        <div className="absolute -bottom-3 right-1/2 translate-x-1/2 z-10">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-6 w-6 rounded-full bg-white"
            onClick={(e) => {
              e.stopPropagation();
              data.onAddNode(data.id);
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomNode;

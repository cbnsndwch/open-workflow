
import React from 'react';
import { RectangleHorizontal, GitBranch, LayoutTemplate, Combine, Check, Settings } from 'lucide-react';

const NodeTypes = [
  {
    id: 'initial',
    name: 'Initial Node',
    icon: <RectangleHorizontal className="h-5 w-5" />,
  },
  {
    id: 'transform',
    name: 'Transform Node',
    icon: <LayoutTemplate className="h-5 w-5" />,
  },
  {
    id: 'join',
    name: 'Join Node',
    icon: <Combine className="h-5 w-5" />,
  },
  {
    id: 'branch',
    name: 'Branch Node',
    icon: <GitBranch className="h-5 w-5" />,
  },
  {
    id: 'output',
    name: 'Output Node',
    icon: <Check className="h-5 w-5" />,
  },
];

const NodePalette = () => {
  return (
    <div className="py-2">
      {NodeTypes.map((nodeType) => (
        <div 
          key={nodeType.id}
          className="flex items-center justify-between px-4 py-3 hover:bg-muted cursor-pointer"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('application/reactflow', nodeType.id);
            e.dataTransfer.effectAllowed = 'move';
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-foreground/70">{nodeType.icon}</span>
            <span>{nodeType.name}</span>
          </div>
          <button className="opacity-50 hover:opacity-100">
            <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="3.5" cy="7.5" r="1.5" fill="currentColor" />
              <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
              <circle cx="11.5" cy="7.5" r="1.5" fill="currentColor" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NodePalette;

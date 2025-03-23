
import React from 'react';
import NodePalette from '../NodePalette';

interface FlowNodePaletteProps {
  show: boolean;
  onClose: () => void;
  onAddNode: (nodeType: string, nodeName: string) => void;
}

const FlowNodePalette: React.FC<FlowNodePaletteProps> = ({ show, onClose, onAddNode }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
      <NodePalette
        onSelect={onAddNode}
        onClose={onClose}
      />
    </div>
  );
};

export default FlowNodePalette;

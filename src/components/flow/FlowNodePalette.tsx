import React from 'react';
import NodePalette from '../NodePalette';

interface FlowNodePaletteProps {
    show: boolean;
    onClose: () => void;
    onAddNode: (nodeType: string, nodeName: string) => void;
}

const FlowNodePalette: React.FC<FlowNodePaletteProps> = ({
    show,
    onClose,
    onAddNode
}) => {
    return <NodePalette open={show} onSelect={onAddNode} onClose={onClose} />;
};

export default FlowNodePalette;

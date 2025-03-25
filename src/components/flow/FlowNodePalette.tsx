import NodePalette from '../NodePalette';

interface FlowNodePaletteProps {
    show: boolean;
    onClose: () => void;
    onAddNode: (nodeType: string, nodeName: string) => void;
}

export default function FlowNodePalette({
    show,
    onClose,
    onAddNode
}: FlowNodePaletteProps) {
    return <NodePalette open={show} onSelect={onAddNode} onClose={onClose} />;
}

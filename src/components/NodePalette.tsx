import {
    RectangleHorizontal,
    GitBranch,
    LayoutTemplate,
    Combine,
    Check
} from 'lucide-react';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose
} from '@/components/ui/sheet';

const NodeTypes = [
    {
        id: 'initial',
        name: 'Initial Node',
        icon: <RectangleHorizontal className="h-5 w-5" />
    },
    {
        id: 'transform',
        name: 'Transform Node',
        icon: <LayoutTemplate className="h-5 w-5" />
    },
    {
        id: 'join',
        name: 'Join Node',
        icon: <Combine className="h-5 w-5" />
    },
    {
        id: 'branch',
        name: 'Branch Node',
        icon: <GitBranch className="h-5 w-5" />
    },
    {
        id: 'output',
        name: 'Output Node',
        icon: <Check className="h-5 w-5" />
    }
];

interface NodePaletteProps {
    open?: boolean;
    onSelect?: (nodeType: string, nodeName: string) => void;
    onClose?: () => void;
}

export default function NodePalette({
    open = false,
    onSelect,
    onClose
}: NodePaletteProps) {
    const handleNodeSelect = (nodeType: (typeof NodeTypes)[number]) => {
        if (onSelect) {
            onSelect(nodeType.id, nodeType.name);
            if (onClose) onClose();
        }
    };

    return (
        <Sheet open={open} onOpenChange={isOpen => !isOpen && onClose?.()}>
            <SheetContent side="right" className="w-80 p-0 border-l">
                <SheetHeader className="px-4 py-2 border-b border-border/30">
                    <SheetTitle className="text-left text-lg">
                        Add Node
                    </SheetTitle>
                    <SheetClose className="absolute right-4 top-4" />
                </SheetHeader>

                <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
                    {NodeTypes.map(nodeType => (
                        <div
                            key={nodeType.id}
                            className="flex items-center justify-between px-4 py-3 hover:bg-muted cursor-pointer border-b border-border/10"
                            draggable
                            onDragStart={e => {
                                e.dataTransfer.setData(
                                    'application/reactflow',
                                    nodeType.id
                                );
                                e.dataTransfer.effectAllowed = 'move';
                            }}
                            onClick={() => handleNodeSelect(nodeType)}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-foreground/70">
                                    {nodeType.icon}
                                </span>
                                <span>{nodeType.name}</span>
                            </div>
                            <button className="opacity-50 hover:opacity-100">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="3.5"
                                        cy="7.5"
                                        r="1.5"
                                        fill="currentColor"
                                    />
                                    <circle
                                        cx="7.5"
                                        cy="7.5"
                                        r="1.5"
                                        fill="currentColor"
                                    />
                                    <circle
                                        cx="11.5"
                                        cy="7.5"
                                        r="1.5"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}

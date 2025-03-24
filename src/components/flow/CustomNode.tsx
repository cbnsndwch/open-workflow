
import React from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useTheme } from '@/components/theme/theme-provider';

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
    const { theme } = useTheme();
    const isDarkTheme = theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const nodeTypeColors: Record<string, { light: string, dark: string }> = {
        'core:triggers:manual': { 
            light: 'bg-blue-100 border-blue-400',
            dark: 'bg-blue-900/50 border-blue-700'
        },
        'core:http_request': { 
            light: 'bg-purple-100 border-purple-400',
            dark: 'bg-purple-900/50 border-purple-700'
        },
        'core:switch': { 
            light: 'bg-yellow-100 border-yellow-400',
            dark: 'bg-yellow-900/50 border-yellow-700'
        },
        'core:code': { 
            light: 'bg-green-100 border-green-400',
            dark: 'bg-green-900/50 border-green-700'
        },
        'core:if': { 
            light: 'bg-orange-100 border-orange-400',
            dark: 'bg-orange-900/50 border-orange-700'
        },
        'core:no_op': { 
            light: 'bg-gray-100 border-gray-400',
            dark: 'bg-gray-800 border-gray-600' 
        },
        'core:set': { 
            light: 'bg-indigo-100 border-indigo-400',
            dark: 'bg-indigo-900/50 border-indigo-700'
        },
        'noco_db:action': { 
            light: 'bg-pink-100 border-pink-400',
            dark: 'bg-pink-900/50 border-pink-700'
        },
        'core:aggregate': { 
            light: 'bg-teal-100 border-teal-400',
            dark: 'bg-teal-900/50 border-teal-700' 
        },
        'core:filter': { 
            light: 'bg-red-100 border-red-400',
            dark: 'bg-red-900/50 border-red-700'
        },
        'core:split_input': { 
            light: 'bg-emerald-100 border-emerald-400',
            dark: 'bg-emerald-900/50 border-emerald-700'
        },
        default: { 
            light: 'bg-white border-gray-300',
            dark: 'bg-gray-800 border-gray-600'
        }
    };

    const colorSet = nodeTypeColors[data.kind] || nodeTypeColors.default;
    const nodeColor = isDarkTheme ? colorSet.dark : colorSet.light;
    const textColor = isDarkTheme ? 'text-gray-200' : 'text-gray-800';
    const subtextColor = isDarkTheme ? 'text-gray-400' : 'text-gray-500';
    const connectorColor = isDarkTheme ? 'bg-gray-600' : 'bg-gray-300';
    const buttonColor = isDarkTheme 
        ? 'bg-gray-700 border-blue-700 hover:bg-blue-800 hover:border-blue-600' 
        : 'bg-white border-blue-300 hover:bg-blue-50 hover:border-blue-400';
    const iconColor = isDarkTheme ? 'text-blue-400' : 'text-blue-600';

    return (
        <div className="relative">
            {/* Main node */}
            <div
                className={`px-4 py-2 rounded-lg shadow-sm border ${nodeColor} ${selected ? 'ring-2 ring-primary' : ''}`}
            >
                <div className={`font-medium ${textColor}`}>{data.label}</div>
                <div className={`text-xs ${subtextColor} mt-1`}>{data.kind}</div>
            </div>

            {/* Connector line and add button for non-terminal nodes */}
            {!data.isTerminal && (
                <div className="flex flex-col items-center">
                    {/* Vertical connector line */}
                    <div className={`w-[2px] h-[30px] ${connectorColor} mt-1`}></div>

                    {/* Add node button */}
                    <div className="relative -mt-[1px]">
                        <Button
                            variant="outline"
                            size="icon"
                            className={`h-7 w-7 rounded-full ${buttonColor}`}
                            onClick={e => {
                                e.stopPropagation();
                                data.onAddNode(data.id);
                            }}
                        >
                            <Plus className={`h-3.5 w-3.5 ${iconColor}`} />
                            <span className="sr-only">Add Step</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomNode;

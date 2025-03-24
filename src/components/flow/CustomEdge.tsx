
import React from 'react';
import { EdgeProps, getBezierPath, MarkerType } from '@xyflow/react';
import { useTheme } from '@/components/theme/theme-provider';

const CustomEdge: React.FC<EdgeProps> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data
}) => {
    const { theme } = useTheme();
    const isDarkTheme = theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // getBezierPath returns an array with [path, labelX, labelY, offsetX, offsetY]
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetPosition,
        targetX,
        targetY
    });

    const edgeColor = isDarkTheme ? '#6b7280' : '#b1b1b7';
    const textColor = isDarkTheme ? 'fill-gray-400' : 'fill-gray-500';

    return (
        <>
            <path
                id={id}
                style={{
                    ...style,
                    strokeWidth: 2,
                    stroke: edgeColor
                }}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
            />
            {data?.label && (
                <text>
                    <textPath
                        href={`#${id}`}
                        style={{ fontSize: '12px' }}
                        startOffset="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={`text-[10px] ${textColor}`}
                    >
                        {data.label as string}
                    </textPath>
                </text>
            )}
        </>
    );
};

export default CustomEdge;

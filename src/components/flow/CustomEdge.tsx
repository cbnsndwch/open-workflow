
import React from 'react';
import { EdgeProps, getBezierPath, MarkerType } from '@xyflow/react';

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
  data,
}) => {
  // Adjust the source point to account for the connector line
  // The actual connection should start from the end of the connector line
  const adjustedSourceY = sourceY + 30; // Add the height of the connector line
  
  const path = `M${sourceX},${adjustedSourceY} C${sourceX},${adjustedSourceY + 50} ${targetX},${targetY - 50} ${targetX},${targetY}`;
  
  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: '#b1b1b7',
        }}
        className="react-flow__edge-path"
        d={path}
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
            className="text-[10px] fill-gray-500"
          >
            {data.label as string}
          </textPath>
        </text>
      )}
    </>
  );
};

export default CustomEdge;

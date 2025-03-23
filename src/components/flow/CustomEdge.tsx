
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
  const path = `M${sourceX},${sourceY} C${sourceX + 50},${sourceY} ${targetX - 50},${targetY} ${targetX},${targetY}`;
  
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
            {data.label}
          </textPath>
        </text>
      )}
    </>
  );
};

export default CustomEdge;


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
  // For vertical layout, we need to create a path from source to target
  // getBezierPath returns an array with [path, labelX, labelY, offsetX, offsetY]
  // We only need the first element which is the SVG path string
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  
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

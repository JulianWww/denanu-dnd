import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';

export default function EdgeBuilder(props: EdgeProps, className: string) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
    markerEnd,
  } = props;  
  const [edgePath] = getBezierPath({
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
        style={style}
        className={"react-flow__edge-path " + className}
        d={edgePath}
        markerEnd={markerEnd}
      />
    </>
  );
}

import {Connection } from 'reactflow';

export const canConnect = (connection:Connection) => {
  if (connection.sourceHandle && connection.targetHandle) {
    const sourceData = getNodeData(connection.sourceHandle);
    const targetData = getNodeData(connection.targetHandle);
    return (sourceData.type === targetData.type && connection.source !== connection.target) || ((sourceData.type === "wildcard" || targetData.type === "wildcard") && sourceData.type !== "exec" && targetData.type !== "exec")
  }
  return false;
}

export const getNodeId = (type: string, name: string) => {return type + "-" + name;}
export const getNodeData = (id: string) => {const data = id.split("-"); return {type: data[0], name: data[1]}}

export const range = (start: number, end: number) => Array.from(Array(end - start + 1).keys()).map(x => x + start);
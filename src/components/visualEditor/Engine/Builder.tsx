import {
  Node,
  Edge
  } from 'reactflow';
import { getNodeData } from '../Nodes/Utils';
import { useState } from 'react';

const getNodeByType = (nodes: Node[], type: string) => {
  for (const node of nodes) {
    if (node.type == "init") {
      return node;
    }
  }
}

const getEdgesBySource = (edges: Edge[], id: string) => {
  var out = Array<Edge>() ;
  for (const edge of edges) {
    if (edge.source === id){
      out.push(edge);
    }
  }
  return out;
}

const getEdgesByTarget = (edges: Edge[], id: string) => {
  var out = Array<Edge>() ;
  for (const edge of edges) {
    if (edge.target === id){
      out.push(edge);
    }
  }
  return out;
}


const buildNodeInput = (edges: Edge[], id: string) => {
  edges = getEdgesByTarget(edges, id);
  var out: Record<string, nodeValueData> = {};
  for (const edge of edges) {
    if (edge.targetHandle && edge.sourceHandle) {
      const targetData = getNodeData(edge.targetHandle);
      const sourceData = getNodeData(edge.sourceHandle)
      if (targetData.type === "exec") {
        continue;
      }
      out[targetData.name] = {
        nodeId: edge.source,
        propertyId: sourceData.name,
      }
    }
  }
  return out;
}

const buildNodeOutput = (edges: Edge[], id: string) => {
  edges = getEdgesBySource(edges, id);
  var out: Record<string, RoutingData> = {};
  for (const edge of edges) {
    if (edge.sourceHandle) {
      const sourceData = getNodeData(edge.sourceHandle);
      if (sourceData.type === "exec") {
        out[sourceData.name] = {
          nodeId: edge.target
        }
      }
    }
  }
  return out;
}

export interface nodeValueData extends RoutingData {
  propertyId: string;
}

interface RoutingData {
  nodeId: string
}

export type InputData = Record<string, nodeValueData>;

export interface ScriptNode {
  type: string;
  id: string;
  internalData: Record<string, any>;
  input: Record<string, nodeValueData>;
  output: Record<string, RoutingData>
}

export interface Script {
  start: string;
  nodes: Record<string, ScriptNode>;
}

function build(nodes: Node[], edges: Edge[], data: Record<string, Record<string, any>>) {
  const init = getNodeByType(nodes, "init");
  if (init) {
    var script: Script = {
      start: init.id,
      nodes: {}
    };

    for (const node of nodes) {
      if (node.type) {
        script.nodes[node.id] = {
          type: node.type,
          id: node.id,
          internalData: data[node.id],
          input: buildNodeInput(edges, node.id),
          output: buildNodeOutput(edges, node.id)
        };
      }
    }
    return script;
  }
  return {start: "0", nodes:{}};
}

export default build;
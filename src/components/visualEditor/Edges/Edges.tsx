import EdgeBuilder from "./EdgeBuilder";
import { EdgeProps } from 'reactflow';

export function ExecEdge(props: EdgeProps) {
  return EdgeBuilder(props, "exec");
}

export function BooleanEdge(props: EdgeProps) {
  return EdgeBuilder(props, "boolean");
}

export function NumberEdge(props: EdgeProps) {
  return EdgeBuilder(props, "number")
}

export function StringEdge(props: EdgeProps) {
  return EdgeBuilder(props, "string")
}
import * as React from "react";
import ReactFlow, { 
  Background, 
  Controls, ControlButton,
  Node, NodeChange,
  Edge, EdgeChange,
  applyNodeChanges,
  applyEdgeChanges, ReactFlowProvider,
  addEdge, Connection, XYPosition
  } from 'reactflow';
import 'reactflow/dist/style.css';
import ExecutionStartNode from "./Nodes/ExecutionStartNode"
import PrintNode from "./Nodes/Print";
import Attack from "./Nodes/Attack";
import Damage from "./Nodes/Damage";
import { addNode, subtractNode, MultiplyNode, divideNode, powerNode, rootNode, logNode, andNode, orNode, xorNode, notNode, concatNode, greaterNode, equalNode } from "./Nodes/OperationNode";
import SavingThrowTarget from "./Nodes/SavingThrowTarget";
import { ExecEdge, BooleanEdge, NumberEdge, StringEdge } from "./Edges/Edges";
import StdAttack from "./Nodes/StdAttack";
import RollDice from "./Nodes/RollDice";
import { BooleanNode, NumberNode, StringNode } from "./Nodes/ConstantNode"
import build, { Script } from "./Engine/Builder";
import { runScript } from "./Engine/Engine";
import { getNodeData } from "./Nodes/Utils";
import { Card, CardContent } from "@mui/material";
import NodeSelectionMenu from "./NodeSelectionMenu";
import {Button} from "semantic-ui-react";
import "./css/main.css"
import "./css/edges.css"
import { Markup } from 'interweave';
import Character from "../monsters/Character";

export const nodeTypes = { 
  init: ExecutionStartNode, 
  print: PrintNode,
  attack: Attack,
  applyDamage: Damage,
  stdattack: StdAttack,
  savingthrowtarget: SavingThrowTarget,
  rolldice: RollDice,

  add: addNode,
  subtract: subtractNode,
  mul: MultiplyNode,
  divide: divideNode,
  power: powerNode,
  root: rootNode,
  log: logNode,
  and: andNode,
  or: orNode,
  xor: xorNode,
  not: notNode,
  concatenate: concatNode,
  greater: greaterNode,
  equals: equalNode,

  number: NumberNode,
  boolean: BooleanNode,
  string: StringNode,
};

const edgeTypes = {
  exec: ExecEdge,
  boolean: BooleanEdge,
  number: NumberEdge,
  string: StringEdge
}

export interface MacroEditorData {
  nodes: Node[];
  edges: Edge[];
  data: Record<string, Record<string, any>>;
  script: Script;
}

interface Props {
  script?: MacroEditorData;
  save: (data: MacroEditorData)=>void;
  close: () => void;
  description?: string;
  character: Character;
  conditions: [string, number, string[]][]
}

interface State {
  nodes: Node[];
  edges: Edge[];
  data: Record<string, Record<string, any>>;

  contextMenuOpen: boolean;
  contextMenuPosition: XYPosition;
}

export default class Editor extends React.Component<Props, State> {
  id: number;
  flow: React.RefObject<any>;

  constructor(props: Props) {
    super(props);
    this.id = 3;
    this.flow = React.createRef()

    if (this.props.script) {
      this.state = {
        ...this.props.script,
        contextMenuOpen: false,
        contextMenuPosition: {x:0, y:0}
      }

      for (const node of this.state.nodes) {
        node.data = {set: this.setNodeState(node.id), get: this.getNodeState(node.id), editor: this}
      }
    }
    else {
      this.state = {
        edges: [],
        nodes: [
          {
            id: '1',
            data: {set: this.setNodeState("1"), get: this.getNodeState("1"), editor: this},
            position: { x: 0, y: 0 },
            type: 'init',
            deletable: false,
          }
        ],
        data: {},
        contextMenuOpen: false,
        contextMenuPosition: {x:0, y:0}
      }
    }

    this.id = this.state.nodes.length + 1;
  }

  getId() {
    this.id = this.id+1;
    return this.id;
  }

  setNodeState = (id: string) => {
    return (key: string, val: any) => {
      const {data} = this.state;
      var d = data[id];
      if (!d) {
        d = {};
      }
      d[key] = val;
      data[id] = d;
    }
  }

  getNodeState = (id: string) => {
    return () => {
      return this.state.data[id];
    }
  }

  addNode = (node: Node<any>) => {
    this.onNodesChange([{
      item: node,
      type: "add"
    }]);
  }

  onNodesChange = (changes: NodeChange[])=> {
    this.setState({nodes: applyNodeChanges(changes, this.state.nodes)});
  }

  onEdgesChange = (changes: EdgeChange[]) => {
    this.setState({edges: applyEdgeChanges(changes, this.state.edges)});
  }
  
  connectToWildcart = (nodeId: string) => {

  }

  onConnect = (params: Connection) => {
    var nextEdges = addEdge(params, this.state.edges);
    var chagne = Array<EdgeChange>();
    var nodeChanges = Array<NodeChange>();
    if (params.targetHandle) {
      for (const edge of nextEdges) {
        if (edge.sourceHandle && edge.targetHandle) {
          const {type} = getNodeData(edge.sourceHandle);
          edge.type = type;

          if (type === "wildcard") {
            const targetData = getNodeData(edge.targetHandle);
            edge.type = targetData.type;
          }

          // remove multi exec targets
          if (params.source === edge.source && params.sourceHandle === edge.sourceHandle && type === "exec" && (edge.target !== params.target || edge.targetHandle !== params.targetHandle)) {
            chagne.push({
              id: edge.id,
              type: "remove"
            })
          }

          // remove multi non exec targets
          if (params.target === edge.target && params.targetHandle === edge.targetHandle && type !== "exec" && (edge.source !== params.source || edge.sourceHandle !== params.sourceHandle)) {
            chagne.push({
              id: edge.id,
              type: "remove"
            })
          }
        }
      }
    }
    this.setState({edges: applyEdgeChanges(chagne, nextEdges), nodes: applyNodeChanges(nodeChanges, this.state.nodes), data: this.state.data});
  }

  removeUnconnectedEdges = (nodeid: string, handle: string) => {
    this.onEdgesChange(
    this.state.edges.filter(
      (edge: Edge, idx: number, arr: Edge[]) => (edge.target === nodeid && edge.targetHandle === handle))
      .map(
        (edge: Edge, idx: number, arr: Edge[]) => {return {id: edge.id, type: "remove"} as EdgeChange}
    ));
  }

  contextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    this.setState({
      contextMenuOpen: true,
      contextMenuPosition: {
        x: e.pageX,
        y: e.pageY - window.pageYOffset
      }
    })
  }

  closeContextMenu = () => {
    this.setState({contextMenuOpen: false})
  }

  jsonPrepNodes(nodes: Node[]) {
    return nodes.map(
      (node: Node) => {
        return {...node, data: {}}
      }
    );
  }

  render() {
    const { nodes, edges, data, contextMenuOpen, contextMenuPosition } = this.state;

    return (
      <ReactFlowProvider>
        <Card>
          <CardContent sx={{mb: 2}}>
            <Markup content={this.props.description}/>
          </CardContent>
        </Card>
        <div style={{ height: '100%' }} id="wraper" onContextMenu={this.contextMenu} ref={this.flow}>
          <NodeSelectionMenu visible={contextMenuOpen} pos={contextMenuPosition} editor={this}/>
          <ReactFlow 
            nodes={nodes}
            edges={edges}
            onNodesChange={this.onNodesChange}
            onEdgesChange={this.onEdgesChange}
            onConnect={this.onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            >
            <Background />
            <Controls>
            <ControlButton onClick={() => runScript(this.props.character, this.props.conditions, build(nodes, edges, data))} title="action">
              <div>
                ►
              </div>
            </ControlButton>
            </Controls>
          </ReactFlow>
      </div>
      <Button.Group>
        <Button primary onClick={() => this.props.save({nodes: this.jsonPrepNodes(nodes), edges: edges, data: data, script: build(nodes, edges, data)})}>Save</Button>
        <Button.Or/>
        <Button onClick={this.props.close}>Close</Button>
      </Button.Group>
    </ReactFlowProvider>
    )
  }
}
import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, Button, Grid, GridColumn, ButtonProps } from "semantic-ui-react"
import { canConnect } from "./Utils"
import Editor from '../Editor';
import { range } from './Utils';

function OperationNode({ id, data }: any, type: React.ReactNode, dtype: string, hasMultinode: boolean, outDtype?: string, hasNotSingleNode?: boolean) {
  const state = data.get();
  const [inputCount, setInputCount] = useState(state?.inputs || 2);

  outDtype = outDtype || dtype;

  const addNode = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, _: ButtonProps) => {
    setInputCount(inputCount + 1);
    data.set("inputs", inputCount + 1);
  };

  const removeNode = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, _: ButtonProps) => {
    if (inputCount > 2) {
      (data.editor as Editor).removeUnconnectedEdges(id, dtype + "-" + inputCount.toString())

      setInputCount(inputCount - 1);
      data.set("inputs", inputCount - 1)
    }
  }

  return (
    <Card className='node dataprop mathematics-operation'>
      <Card.Content className='data'>
        <Grid className='bound'>
          <Grid.Row>
            <Grid.Column width={1}>
            <Handle type="target" className={dtype} position={Position.Left} id={dtype + "-1"} isValidConnection={canConnect}/>
            </Grid.Column>
            <Grid.Column width={1}>
              <div style={{textAlign: "center", width: "100%"}}>{type}</div> 
            </Grid.Column>
            <Grid.Column width={1}>
              <Handle type="source" className={outDtype} position={Position.Right} id={outDtype + "-main"} isValidConnection={canConnect}/>
            </Grid.Column>
          </Grid.Row>
          {!hasNotSingleNode? <>
            {
              range(2, inputCount).map((idx: number) => (
                <Grid.Row>
                  <Grid.Column width={1}>
                  <Handle type="target" className={dtype} position={Position.Left} id={dtype + "-" + idx} isValidConnection={canConnect}/>
                  </Grid.Column>
                </Grid.Row>
              ))
            }
            {
              hasMultinode ?
              <Grid.Row>
                <GridColumn>
                      <Button circular size="mini" icon="plus" onClick={addNode}></Button>
                      <Button circular size="mini" icon="remove" onClick={removeNode} active={inputCount > 2}></Button>
                </GridColumn>
              </Grid.Row>
              :
              null
            }
            </>: null
          }
        </Grid>
      </Card.Content>
    </Card>
  );
}

export function addNode(props: any) {
  return OperationNode(props, "+", "number", true); 
}

export function subtractNode(props: any) {
  return OperationNode(props, "-", "number", true); 
}

export function MultiplyNode(props: any) {
  return OperationNode(props, "*", "number", true); 
}

export function divideNode(props: any) {
  return OperationNode(props, "/", "number", false); 
}

export function powerNode(props: any) {
  return OperationNode(props, "^", "number", false); 
}

export function rootNode(props: any) {
  return OperationNode(props, "√", "number", false); 
}

export function logNode(props: any) {
  return OperationNode(props, "log", "number", false); 
}

export function andNode(props: any) {
  return OperationNode(props, "and", "boolean", true); 
}

export function orNode(props: any) {
  return OperationNode(props, "or", "boolean", true); 
}

export function xorNode(props: any) {
  return OperationNode(props, "xor", "boolean", false); 
}

export function notNode(props: any) {
  return OperationNode(props, "not", "boolean", false, "boolean", true); 
}


export function concatNode(props: any) {
  return OperationNode(props, ".", "wildcard", true, "string"); 
} 

export function greaterNode(props: any) {
  return OperationNode(props, ">", "number", true, "boolean"); 
} 

export function equalNode(props: any) {
  return OperationNode(props, "=", "number", true, "boolean"); 
} 
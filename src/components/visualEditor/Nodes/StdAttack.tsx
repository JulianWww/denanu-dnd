import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, Input, Grid, Popup } from "semantic-ui-react";
import { canConnect } from "./Utils";
import NumberInput from "./Utility/NumberInput";
import StringInput from "./Utility/StringInput";

const handleStyle = { left: 10 };

export default function StdAttack({ data }: any) {
  return (
    <Card className='node'>
      <Card.Content className='function' inverted>
        <Card.Header>Standart Mele Attack</Card.Header>
      </Card.Content>
      <Card.Content className='data'>
        <Grid className="bound" style={{width: "300px"}}>
          <Grid.Row>
            <Grid.Column width={2}>
              <Handle type="target" className="execution" position={Position.Left} id="exec-exec" isValidConnection={canConnect}/>
            </Grid.Column>
            <Grid.Column width={14}>
              <p className='rightalign'>Normal Execution</p>
              <Handle type="source" className="execution" position={Position.Right} id="exec-main" isValidConnection={canConnect}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
           <Grid.Column width={8}>
              <Handle type="target" className="number" position={Position.Left} id="number-faces" isValidConnection={canConnect}/>
              <NumberInput className='leftalign' setNumber={(num: number) => data.set("faces", num)} val={data.get()?.faces || 6} label="Damage Dice Faces"/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <Handle type="target" className="number" position={Position.Left} id="number-dice" isValidConnection={canConnect}/>
              <NumberInput className='leftalign' setNumber={(num: number) => data.set("dice", num)} val={data.get()?.dice || 1} label="Damage Dice Count"/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <Handle type="target" className="number" position={Position.Left} id="number-mod" isValidConnection={canConnect}/>
              <NumberInput className='leftalign' setNumber={(num: number) => data.set("mod", num)} val={data.get()?.mod || 0} label="Damage Mod"/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
           <Grid.Column width={8}>
              <Handle type="target" className="string" position={Position.Left} id="string-type" isValidConnection={canConnect}/>
              <StringInput className='leftalign' setStr={(num: string) => data.set("type", num)} val={data.get()?.type} label="Damage Type"/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
           <Grid.Column width={8}>
              <Handle type="target" className="number" position={Position.Left} id="number-attackmod" isValidConnection={canConnect}/>
              <NumberInput className='leftalign' setNumber={(num: number) => data.set("attackmod", num)} val={data.get()?.attackmod || 0} label="Attack Mod"/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  );
}
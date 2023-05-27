import { Handle, Position } from 'reactflow';
import { Card, Grid } from "semantic-ui-react";
import { canConnect } from "./Utils";
import NumberInput from "./Utility/NumberInput";


export default function RollDice({ data }: any) {
  return (
    <Card className='node'>
      <Card.Content className='function' inverted>
        <Card.Header>Roll dice</Card.Header>
      </Card.Content>
      <Card.Content className='data'>
        <Grid className="bound" style={{width: "300px"}}>
          <Grid.Row>
            <Grid.Column width={2}>
              <Handle type="target" className="execution" position={Position.Left} id="exec-exec" isValidConnection={canConnect}/>
            </Grid.Column>
            <Grid.Column width={14}>
              <Handle type="source" className="execution" position={Position.Right} id="exec-main" isValidConnection={canConnect}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
           <Grid.Column width={8}>
              <Handle type="target" className="number" position={Position.Left} id="number-faces" isValidConnection={canConnect}/>
              <NumberInput className='leftalign' setNumber={(num: number) => data.set("faces", num)} val={data.get()?.faces || 6} label="Die Faces"/>
            </Grid.Column>
            <Grid.Column width={8}>
              <p className='rightalign'>value</p>
              <Handle type="source" className="number" position={Position.Right} id="number-roll" isValidConnection={canConnect}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <Handle type="target" className="number" position={Position.Left} id="number-dice" isValidConnection={canConnect}/>
              <NumberInput className='leftalign' setNumber={(num: number) => data.set("dice", num)} val={data.get()?.dice || 1} label="Dice Count"/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <Handle type="target" className="number" position={Position.Left} id="number-mod" isValidConnection={canConnect}/>
              <NumberInput className='leftalign' setNumber={(num: number) => data.set("mod", num)} val={data.get()?.mod || 0} label="Mod"/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  );
}
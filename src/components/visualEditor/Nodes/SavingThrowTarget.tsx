import { Handle, Position } from 'reactflow';
import { Card, Grid } from "semantic-ui-react";
import { canConnect } from "./Utils";
import NumberInput from "./Utility/NumberInput";
import StringInput from "./Utility/StringInput";


export default function SavingThrowTarget({ data }: any) {
  return (
    <Card className='node'>
      <Card.Content className='function' inverted>
        <Card.Header>Target Make Save</Card.Header>
      </Card.Content>
      <Card.Content className='data'>
        <Grid className="bound" style={{width: "300px"}}>
          <Grid.Row>
            <Grid.Column width={2}>
              <Handle type="target" className="execution" position={Position.Left} id="exec-exec" isValidConnection={canConnect}/>
            </Grid.Column>
            <Grid.Column width={14}>
              <p className='rightalign'>Succed Save</p>
              <Handle type="source" className="execution" position={Position.Right} id="exec-succed" isValidConnection={canConnect}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
           <Grid.Column width={8}>
              <Handle type="target" className="number" position={Position.Left} id="number-dc" isValidConnection={canConnect}/>
              <NumberInput className='leftalign' setNumber={(num: number) => data.set("dc", num)} val={data.get()?.dc || 0} label="DC"/>
            </Grid.Column>
            <Grid.Column width={8}>
              <p className='rightalign'>Fail Save</p>
              <Handle type="source" className="execution" position={Position.Right} id="exec-fail" isValidConnection={canConnect}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
           <Grid.Column width={8}>
              <Handle type="target" className="string" position={Position.Left} id="string-type" isValidConnection={canConnect}/>
              <StringInput className='leftalign' setStr={(num: string) => data.set("type", num)} val={data.get()?.type} label="Check Type"/>
            </Grid.Column>
            <Grid.Column width={8}>
              <p className='rightalign'>Success</p>
              <Handle type="source" className="boolean" position={Position.Right} id="boolean-success" isValidConnection={canConnect}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  );
}
import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, Input, Grid } from "semantic-ui-react"
import { canConnect } from "./Utils"


export default function Attack({ data }: any) {
  const [val, setVal] = useState(data.get()?.mod);

  const onChange = useCallback((evt: any) => {
    setVal(Number(evt.target.value.replace ( /[^0-9]/g, '' )));
  }, []);

  data.set("mod", val);

  return (
    <Card className='node'>
      <Card.Content className='function' inverted>
        <Card.Header>Attack</Card.Header>
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
              <Handle type="target" className="number" position={Position.Left} id="number-mod" isValidConnection={canConnect}/>
              <Input placeholder='0' className="leftalign" onChange={onChange} value={val} label="mod" style={{width: "100px"}}/>
            </Grid.Column>
            <Grid.Column width={8}>
              <p className='rightalign'>Crit Execution</p>
              <Handle type="source" className="execution" position={Position.Right} id="exec-crit" isValidConnection={canConnect}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
           <Grid.Column width={8}>
            </Grid.Column>
            <Grid.Column width={8}>
              <p className='rightalign'>Crit</p>
              <Handle type="source" className="boolean" position={Position.Right} id="boolean-crit" isValidConnection={canConnect}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  );
}
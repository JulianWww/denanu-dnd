import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Grid } from "semantic-ui-react"
import { canConnect } from "./Utils"
import { Card, CardContent, TextField } from '@mui/material';


export default function PrintNode({ data }: any) {
  const [txt, setText] = useState(data.get()?.txt);

  const onChange = (evt: any) => {
    setText(evt.target.value);
    data.set("txt", evt.target.value);
  }

  return (
    <Card className='node'>
      <CardContent className='function'>
        <h3>Print</h3>
      </CardContent>
      <CardContent className='data'>        
        <Grid className="bound">
          <Grid.Row>
            <Grid.Column width={8}>
              <Handle type="target" className="execution" position={Position.Left} id="exec-exec" isValidConnection={canConnect}/>
            </Grid.Column>
            <Grid.Column width={8}>
              <Handle type="source" className="execution" position={Position.Right} id="exec-main" isValidConnection={canConnect}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={15}>
              <Handle type="target" className="wildcard" position={Position.Left} id="wildcard-txt" isValidConnection={canConnect}/>
              <TextField className="leftalign" placeholder='Test Goes Here' onChange={onChange} value={txt} multiline minRows={3} fullWidth label="text"/>
           </Grid.Column>
          </Grid.Row>
        </Grid>
      </CardContent>
    </Card>
  );
}
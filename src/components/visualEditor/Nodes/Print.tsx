import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, TextArea, Grid } from "semantic-ui-react"
import { canConnect } from "./Utils"


export default function PrintNode({ data }: any) {
  const [txt, setText] = useState(data.get()?.txt);

  const onChange = (evt: any) => {
    setText(evt.target.value);
    data.set("txt", evt.target.value);
  }

  return (
    <Card className='node'>
      <Card.Content className='function' inverted>
        <Card.Header>Print</Card.Header>
      </Card.Content>
      <Card.Content className='data'>        
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
            <Grid.Column width={8}>
              <Handle type="target" className="wildcard" position={Position.Left} id="wildcard-txt" isValidConnection={canConnect}/>
             <TextArea className="leftalign" placeholder='Text Goes Here' onChange={onChange} value={txt}/>
           </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  );
}
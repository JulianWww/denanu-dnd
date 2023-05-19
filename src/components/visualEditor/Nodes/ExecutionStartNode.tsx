import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, Grid } from "semantic-ui-react"
import { canConnect, getNodeId } from "./Utils"

const handleStyle = { left: 10 };

export default function ExecutionStart({ data }: any) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <Card className='node'>
      <Card.Content className='type event' inverted>
        <Card.Header>Execution Start</Card.Header>
      </Card.Content>
      <Card.Content className='data'>
        <Grid className="bound">
          <Grid.Row>
            <Grid.Column>
              <Handle type="source" className="execution" position={Position.Right} id={getNodeId("exec", "main")} isValidConnection={canConnect}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  );
}
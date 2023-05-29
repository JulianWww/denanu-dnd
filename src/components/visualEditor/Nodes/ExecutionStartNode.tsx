import { Handle, Position } from 'reactflow';
import { canConnect, getNodeId } from "./Utils"
import { Card, CardContent } from '@mui/material';
import { Grid } from 'semantic-ui-react';


export default function ExecutionStart({ data }: any) {
  return (
    <Card className='node'>
      <CardContent className='type event'>
        <h3>Execution Start</h3>
      </CardContent>
      <CardContent className='data'>
        <Grid className="bound">
          <Grid.Row>
            <Grid.Column>
              <Handle type="source" className="execution" position={Position.Right} id={getNodeId("exec", "main")} isValidConnection={canConnect}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </CardContent>
    </Card>
  );
}
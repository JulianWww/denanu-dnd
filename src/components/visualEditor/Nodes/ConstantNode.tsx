import * as React from 'react';
import { Handle, Position } from 'reactflow';
import { Card, Checkbox, Grid, SemanticWIDTHS } from "semantic-ui-react";
import { canConnect } from "./Utils";
import NumberInput from "./Utility/NumberInput";
import Switch from "@mui/joy/Switch";
import Typography from "@mui/joy/Typography";
import { TextField } from '@mui/material';

function Constant<T>({}: any, type: string, selector: React.ReactNode, width: string, inpwidth?: SemanticWIDTHS) {
  return (
    <Card className='node'>
      <Card.Content className='propcess constant' inverted>
        <Card.Header>Constant</Card.Header>
      </Card.Content>
      <Card.Content className='data'>
        <Grid className="bound" style={{width: width}}>
          <Grid.Row>
            <Grid.Column width={inpwidth}>
              {selector}
            </Grid.Column>
            <Grid.Column width={2}>
              <Handle type="source" className={type} position={Position.Right} id={type + "-value"} isValidConnection={canConnect}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  );
}

export function NumberNode(props: any) {
  const {data} = props;
  const change = (num: number) => {
    data.set("value", num);
  };
  return Constant<Number>(props, "number", <NumberInput setNumber={change} val={data.get()?.value}/>, "230px", 14);
}

export function BooleanNode(props: any) {
  const {data} = props;
  const [checked, set] = React.useState((data.get()?.value as boolean));
  const change = (box: React.ChangeEvent<HTMLInputElement>) => {
    
    data.set("value", box.target.checked);
    if (box.target.checked !== undefined)
      set(box.target.checked);
  };
  return Constant<Number>(props, "boolean", 
    <Switch
      slotProps={{
        track: {
          children: (
            <React.Fragment>
              <Typography component="span" level="inherit" sx={{ ml: '10px' }}>
                True
              </Typography>
              <Typography component="span" level="inherit" sx={{ mr: '5px' }}>
                False
              </Typography>
            </React.Fragment>
          ),
        },
      }}
      sx={{
        '--Switch-thumbWidth': '35px',
        '--Switch-thumbSize': '27px',
        '--Switch-trackWidth': '74px',
        '--Switch-trackHeight': '31px',
      }}
      checked={checked}
      onChange={change}
    />,
    "120px",
    12
  );
}

export function StringNode(props: any) {
  const {data} = props;
  const [str, set] = React.useState((data.get()?.value as string));
  const change = (box: React.ChangeEvent<HTMLInputElement>) => {
    
    data.set("value", box.target.value);
    set(box.target.value);
  };
  return Constant<Number>(props, "string", 
    <TextField
      label="Text"
      placeholder="Placeholder"
      multiline
      variant="standard"
      onChange={change}
      defaultValue={str}
    />,
    "230px",
    14
  );
}
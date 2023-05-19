import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, Input, Grid, Popup } from "semantic-ui-react"
import { canConnect } from "./Utils"

const handleStyle = { left: 10 };

export default function Damage({ data }: any) {
  const [faces, setFaces] = useState(data.get()?.faces);
  const [dice, setDice] = useState(data.get()?.dice);
  const [mod, setMod] = useState(data.get()?.mod);
  const [type, setType] = useState(data.get()?.type);

  const onChangeDie = useCallback((evt: any) => {
    setFaces(Number(evt.target.value.replace ( /[^0-9]/g, '' )));
  }, []);
  const onChangeDieCount = useCallback((evt: any) => {
    setDice(Number(evt.target.value.replace ( /[^0-9]/g, '' )));
  }, []);
  const onChangeMod = useCallback((evt: any) => {
    setMod(Number(evt.target.value.replace ( /[^0-9]/g, '' )));
  }, []);
  const onChangeType = useCallback((evt: any) => {
    setType(evt.target.value);
  }, []);

  data.set("faces", faces);
  data.set("dice", dice);
  data.set("mod", mod);
  data.set("type", type);

  return (
    <Card className='node'>
      <Card.Content className='function' inverted>
        <Card.Header>Apply Damage</Card.Header>
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
              <Input className='leftalign' onChange={onChangeDie} value={faces} label="Die Faces" style={{width: "100px"}}/>
            </Grid.Column>
            <Grid.Column width={8}>
              <p className='rightalign'>Damage</p>
              <Handle type="source" className="number" position={Position.Right} id="number-damage" isValidConnection={canConnect}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
           <Grid.Column width={8}>
           <Handle type="target" className="number" position={Position.Left} id="number-dice" isValidConnection={canConnect}/>
              <Input className='leftalign' onChange={onChangeDieCount} value={dice} label="Die count" style={{width: "100px"}}/>
            </Grid.Column>
            <Grid.Column width={8}>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <Handle type="target" className="number" position={Position.Left} id="number-mod" isValidConnection={canConnect}/>
              <Input className='leftalign' onChange={onChangeMod} value={mod} label="Modifier" style={{width: "100px"}}/>
            </Grid.Column>
            <Grid.Column width={8}>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
           <Grid.Column width={8}>
              <Handle type="target" className="string" position={Position.Left} id="string-type" isValidConnection={canConnect}/>
              <Input className='leftalign' onChange={onChangeType} value={type} label="Type" style={{width: "100px"}}/>
            </Grid.Column>
            <Grid.Column width={8}>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
           <Grid.Column width={8}>
              <Handle type="target" className="boolean" position={Position.Left} id="boolean-crit" isValidConnection={canConnect}/>
              <p className='leftalign'><Popup content="Default: false" trigger={<span>Crit</span>}></Popup></p>
            </Grid.Column>
            <Grid.Column width={8}>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
           <Grid.Column width={8}>
              <Handle type="target" className="boolean" position={Position.Left} id="boolean-half" isValidConnection={canConnect}/>
              <p className='leftalign'><Popup content="Default: false" trigger={<span>Half Damage</span>}></Popup></p>
            </Grid.Column>
            <Grid.Column width={8}>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  );
}
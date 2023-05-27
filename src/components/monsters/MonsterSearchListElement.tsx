import { useNavigate } from "react-router-dom";
import { Grid } from 'semantic-ui-react';
import { Card, CardContent, Button } from "@mui/material";
import { MonsterIndex } from "../../pages/SelectMonserStatBlock";
import { loadPublicMonsterIndex, readPrivateIndex } from "../../Login/ServerApi";
import { Token } from "../../Login/UseToken";
import { MonserElement } from "../MonserSearchableList";

interface Props extends MonsterIndex {
}

export default function MonsterSearchListElement(props: Props & {onClick: VoidFunction}) {
  return <Button fullWidth variant="text">
    <Card className="fullWidth" onClick={props.onClick}>
      <CardContent className="searchlist-element">
        <Grid>
          <Grid.Row>
            <Grid.Column className="fifthwidth">
              {props.name}
            </Grid.Column>
            <Grid.Column className="fifthwidth">
              {props.cr}
            </Grid.Column>
            <Grid.Column className="fifthwidth">
              {props.size}
            </Grid.Column>
            <Grid.Column className="fifthwidth">
              {props.alignment}
            </Grid.Column>
            <Grid.Column className="fifthwidth">
              {props.type}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </CardContent>
    </Card>
  </Button>
}

export function MonsterForwardingListElement(props: Props & {target: string}) {
  const nav = useNavigate();
  return <MonsterSearchListElement {...props} onClick={() => nav(props.target)}/>
}

export async function loadMonsters(gen: (val: MonsterIndex)=> JSX.Element, token?: Token) {
  var data = await loadPublicMonsterIndex("monstermanual");
  data = data.concat(await readPrivateIndex("mobs", token));

  return data.map((val: MonsterIndex)=> {
    return {
      key: val.name,
      item: gen(val),
      ...val
    } as MonserElement
  });
}
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Button, Grid, Checkbox, Typography, makeStyles, CheckboxProps } from "@mui/material";
import { LocationData, loadPublicSpellIndex } from "../../Login/ServerApi";
import { Token } from "../../Login/UseToken";
import { SpellIndex } from "./Spell";
import { SpellElement } from "../../pages/SpellList";

interface Props extends SpellIndex {
}

const boxProps: CheckboxProps = {
  sx: {
    height: "0px",
    width: "0px",
  },
  disabled: true,
}


export default function SpellSearchListElement(props: Props & {onClick: VoidFunction}) {
  return <Button fullWidth variant="text">
    <Card className="fullWidth" onClick={props.onClick}>
      <CardContent className="searchlist-element">
        <Grid container>
          <Grid item sx={{flexGrow:1, textAlign: "left"}}>
            <Typography>
              {props.name}
            </Typography>
          </Grid>
          <Grid item sx={{width: "50px"}}>
            <Typography>
              {props.lvl}
            </Typography>
          </Grid>
          <Grid item sx={{width: "100px", textAlign: "left"}}>
           <Typography>
              {props.school}
            </Typography>
          </Grid>
          <Grid item>
            <Checkbox {...boxProps} checked={props.ritual}/>
          </Grid>
          <Grid item>
            <Checkbox {...boxProps} checked={props.concentration}/>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  </Button>
}

export function SpellClickElement(props: Props & {onClick: ()=>void}) {
  return <SpellSearchListElement {...props}/>
}

export async function loadSpells(gen: (val: SpellIndex)=> JSX.Element, token?: Token) {
  var data = await loadPublicSpellIndex("spells");
  //data = data.concat(await readPrivateIndex("mobs", token));

  return data.map((val: SpellIndex)=> {
    return {
      key: val.name,
      item: gen(val),
      ...val
    } as SpellElement
  });
}
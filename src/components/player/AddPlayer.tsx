import * as React from "react"
import { CampainIndex } from "../campain/Campain"
import { Button, ButtonGroup, CardActions, CardContent, Divider, TextField } from "@mui/material";
import PlayerSheet from "./PlayerSheet";
import { Campaign } from "@mui/icons-material";

interface Props {
  campain: CampainIndex;
  close: VoidFunction;
  update: VoidFunction;
}

export default function AddPlayer(props: Props) {
  const [name, setName] = React.useState("");
  const [file, setFile] = React.useState("");
  
  const player = {
    name: name, file: file
  }

  const add = () => {
    if (canAdd()) {
      props.campain.players.push(player);
      props.update();
    }
  }

  const canAdd = () => {
    return name != "" && file != ""
  }

  return <>
    <CardActions>
      <ButtonGroup sx={{justifyContent: "right"}} variant="contained" fullWidth>
        <Button onClick={add} disabled={!canAdd()}>Add</Button>
        <Button onClick={props.close}>Close</Button>
      </ButtonGroup>
    </CardActions>
    <CardContent sx={{height: "100%"}}>
      <TextField onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} variant="standard" label="name" fullWidth/>
      <TextField onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.value)} variant="standard" label="sheet url" fullWidth sx={{mb:2}}/>
      <PlayerSheet player={player} style={{height: "100%"}}/>
    </CardContent>
  </>
}
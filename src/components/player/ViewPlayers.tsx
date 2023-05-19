import { CardContent, ButtonGroup, Button, CardActions, Chip } from "@mui/material";
import { CampainIndex } from "../campain/Campain";
import { PlayerData } from "./PlayerSheet";

interface Props {
  campain: CampainIndex;
  close: VoidFunction;
  editPlayer: (idx: number) => void
}

export default function ViewPlayers(props: Props) {
return <>
    <CardActions sx={{justifyContent: "right"}}>
      <ButtonGroup fullWidth>
        <Button onClick={props.close} variant="contained">Close</Button>
      </ButtonGroup>
      </CardActions>
    <CardContent className="action-card-content-fix-size">
      {
        props.campain.players.map((p: PlayerData, idx: number) => <Chip key={idx} label={p.name} sx={{m:0.5}} onClick={()=>props.editPlayer(idx)}/>)
      }
    </CardContent>
  </>
}
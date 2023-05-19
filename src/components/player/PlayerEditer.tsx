import { Button, Dialog, DialogActions, DialogContent, Divider, IconButton, TextField } from "@mui/material";
import { CampainIndex } from "../campain/Campain";
import PlayerSheet from "./PlayerSheet";
import { Delete } from "@mui/icons-material";


interface Props {
  campain: CampainIndex;
  idx: number;
  open: boolean;
  update: VoidFunction;
  close: (c?: CampainIndex,) => void;
}

export default function PlayerEditor(props: Props) {
  const { idx, campain, open, update, close} = props;

  const player = campain.players[idx];
  if (!player) return null;

  const removePlayer = () => {
    const next = {
      ...campain,
      players: campain.players.splice(idx, 1),
    };
    console.log(next, campain);
    close(next);
  }

  return <Dialog open={open}>
    <DialogContent className="headerWithSubheader">
      <h3>
        {player.name}
        <IconButton sx={{float: "right"}} color="error" onClick={removePlayer}>
          <Delete/>
        </IconButton>
      </h3>
    </DialogContent>
    <DialogContent>
      <TextField variant="standard" label="Name" fullWidth onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        player.name = e.currentTarget.value;
        update();
      }}
      value={player.name}
      />
      <TextField variant="standard" label="sheet url" fullWidth onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        player.file = e.currentTarget.value;
        update();
      }}
      value={player.file}
      />
    </DialogContent>
    <Divider/>
    <DialogContent>
      <PlayerSheet player={player} style={{height: "100%"}}/>
    </DialogContent>
    <Divider/>
    <DialogActions>
      <Button variant="outlined" onClick={()=>close()}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
}
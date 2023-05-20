import { Button, Dialog, DialogActions, DialogContent, Grid } from "@mui/material";
import { SlideUp } from "../../Transitions";
import RightAlign from "../../RightAlign";
import { useState } from "react";
import NumberInput from "../../visualEditor/Nodes/Utility/NumberInput";
import { combineTimes, splitTime } from "./Time";
import TextWraper from "../../TextWraper";

interface Props {
  setTime: (seconds: number) => void;
  open: boolean;
  time: number;
  close: VoidFunction
}

export default function TimeDialog(props: Props) {
  const { setTime, open, close } = props;

  const [time, set_time] = useState(props.time);

  const times = splitTime(time);

  const setDay = (val: number) => {
    times.day = val;
    set_time(combineTimes(times))
  }

  const setHour = (val: number) => {
    times.hour = val;
    set_time(combineTimes(times))
  }

  const setMinutes = (val: number) => {
    times.minute = val;
    set_time(combineTimes(times))
  }

  const setSeconds = (val: number) => {
    times.second = val;
    set_time(combineTimes(times))
  }

  return <Dialog TransitionComponent={SlideUp} open={open} fullWidth>
    <DialogContent>
      <Grid container columns={4} columnSpacing={1}>
        <Grid item xs={1}>
          <NumberInput label="days" val={times.day} setNumber={setDay}/>
        </Grid>
        <Grid item xs={1}>
          <NumberInput label="hours" val={times.hour} setNumber={setHour}/>
        </Grid>
        <Grid item xs={1}>
          <NumberInput label="minutes" val={times.minute} setNumber={setMinutes}/>
        </Grid>
        <Grid item xs={1}>
          <NumberInput label="seconds" val={times.second} setNumber={setSeconds}/>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <RightAlign>
        <Button sx={{mr: 1}} onClick={() => {
          setTime(time);
          close();
        }}>Save</Button>
        <Button color="error" onClick={close}>Close</Button>
      </RightAlign>
    </DialogActions>

  </Dialog>
}
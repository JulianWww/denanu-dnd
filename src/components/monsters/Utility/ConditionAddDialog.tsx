import * as React from "react";
import { conditions } from "../Conditions";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, MenuItem, duration } from "@mui/material";
import NumberInput from "../../visualEditor/Nodes/Utility/NumberInput";
import DurationTypes, {durationTexts} from "../data/Time";

interface Props {
  imunities: string[];
  open: boolean;
  hanldeClose: VoidFunction;
  add: (cond: string, lvl: number, duration: number, durationType: DurationTypes, additionalData?: string)=>void;
}

interface State {
  condition: number;
  level: number;
  durationType: DurationTypes;
  duration: number;
  additionalData?: string;
}

const init_state = {
  condition: 0,
  level: 1,
  durationType: DurationTypes.LongRest,
  duration: 1,
}

export default class AddConditionDialog extends React.Component<Props, State> {
  days: number;
  hours: number;
  min: number;
  sec: number;

  constructor(props: Props) {
    super(props);

    this.state = init_state

    this.days = 0;
    this.hours = 0;
    this.min = 0;
    this.sec = 0;
  }

  reset() {
    if (this.state.level !== init_state.level)
      this.setState(init_state);

    this.days = 0;
    this.hours = 0;
    this.min = 0;
    this.sec = 0;
  }

  computeTime() {
    this.setState({duration: ((this.days*24 + this.hours) * 60 + this.min) *60 + this.sec})
  }

  addTimeingData() {
    const { duration, durationType } = this.state;
    switch (durationType) {
      case 0: return <NumberInput val={duration} setNumber={(num: number) => this.setState({duration: num})} label={"Last for " + duration + " Rounds"} fullWidth/>
      case 1: return <table><tbody><tr>
        <td><NumberInput val={this.days} setNumber={(num: number) => {this.days = num; this.computeTime()}} label="Days" fullWidth/></td>
        <td><NumberInput val={this.hours} setNumber={(num: number) => {this.hours = num; this.computeTime()}} label="Hours" fullWidth/></td>
        <td><NumberInput val={this.min} setNumber={(num: number) => {this.min = num; this.computeTime()}} label="Minutes" fullWidth/></td>
        <td><NumberInput val={this.sec} setNumber={(num: number) => {this.sec = num; this.computeTime()}} label="Seconds" fullWidth/></td>
        </tr></tbody></table>
      default: return null;
    }
  }

  getAdditionalDataLabel(cond: number) {
    switch (cond) {
      case 1: return "Charmer";
      case 2: return "Cause of Fear";
      default: return null;
    }
  }

  render() {
    const { open, hanldeClose, add, imunities } = this.props;
    const { level, durationType, additionalData, duration, condition } = this.state;

    if (!open) {
      this.reset();
    }

    return <Dialog open={open} onClose={hanldeClose}>
      <DialogTitle>Add Condition</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you want to add a Condition to this Entity?
        </DialogContentText>
        <TextField select label="Condition" variant="standard" fullWidth onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({condition: Number(e.target.value)})}>
          {conditions.map((options: string, idx: number)=> 
            [options, idx] as [string, number]
          ).filter((option: [string, number]) => { 
            return imunities.indexOf(option[0]) === -1;
          }).map(([option, idx]: [string, number]) => (
            <MenuItem key={idx} value={idx}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        {
          this.getAdditionalDataLabel(condition)?
          <TextField label={this.getAdditionalDataLabel(condition)} defaultValue={additionalData} variant="standard" fullWidth onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({additionalData: e.target.value})}/>
        : null
        }
        <NumberInput val={level} setNumber={(num: number) => this.setState({level: num})} label="Level" fullWidth/>
        <TextField select label="Duration" defaultValue={durationType} variant="standard" fullWidth onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({durationType: Number(e.target.value)})}>
          {Object.entries(durationTexts).map((option: [string, string | DurationTypes]) => (
            <MenuItem key={option[1]} value={option[1]}>
              {option[0]}
            </MenuItem>
          ))}
        </TextField>
        {
          this.addTimeingData()
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={hanldeClose} color="error">Cancel</Button>
        <Button onClick={()=>add(conditions[condition], level, duration, durationType, additionalData)}>Add</Button>
      </DialogActions>
    </Dialog>
  }
}
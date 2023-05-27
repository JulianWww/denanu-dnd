import { TextField, StandardTextFieldProps, Autocomplete } from "@mui/material";
import CampainList from "./CampainList";


interface Props extends StandardTextFieldProps {
  value?: string | null,
  onValueStringChange: (a: string|null)=>void;
}

export default class CampainSelector extends CampainList<Props> {
  render(): JSX.Element {
    const names = this.campainList.map((val) => val.name);
    const {value, onValueStringChange, token, ...other } = this.props;

    return <Autocomplete renderInput={(params) => {return <TextField {...other} variant="standard" label="Select Campaign" value={value} error={!Boolean(value) || names.findIndex((val: string)=>{
      return val === value;
    }) === -1} {...params}/>}}
      options={names}
      fullWidth
      value={value}
      onChange={(event: React.SyntheticEvent, value: string | null)=> {this.props.onValueStringChange(value)}}
    />
  }
}
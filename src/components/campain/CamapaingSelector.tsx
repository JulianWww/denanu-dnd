import { TextField, StandardTextFieldProps, Autocomplete, AutocompleteProps } from "@mui/material";
import CampainList from "./CampainList";


interface Props extends StandardTextFieldProps {
  value?: string | null,
  onValueChange: (a: string|null)=>void;
}

export default class CampainSelector extends CampainList<Props> {
  render(): JSX.Element {
    const names = this.campainList.map((val) => val.name);
    const {value } = this.props;

    return <Autocomplete renderInput={(params) => <TextField {...params} variant="standard" label="Select Campaign" value={value} error={!Boolean(value) || names.findIndex((val: string)=>{
      return val === value;
    }) === -1} {...this.props}/>}
      options={names}
      fullWidth
      onChange={(event: React.SyntheticEvent, value: string | null)=> {this.props.onValueChange(value)}}
    />
  }
}
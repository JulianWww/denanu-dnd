import { Box, Chip, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem, Checkbox } from "@mui/material";

interface BaseProps<T> {
  value: any[],
  options: T[],
  onChange: (val: string[])=>void;
  label: string;
  fullWidth?: boolean
}

interface Props<T> extends BaseProps<T> {
  render: (val: T)=>JSX.Element,
}

/*renderValue={(selected) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selected.map((value) => (
            <Chip key={value} label={value} />
          ))}
        </Box>
      )}*/
      

export function MultiSelect<T>(props: Props<T>) {
  const { value, options, onChange, label, render, fullWidth } = props;

  return <FormControl fullWidth={fullWidth === undefined ? true : fullWidth}>
    <InputLabel sx={{mt:1, ml: -2}} >{label}</InputLabel>
    <Select multiple value={value} fullWidth 
      renderValue={(selected) => selected.join(', ')}
      onChange={(event: SelectChangeEvent<string[]>) => { var val = event.target.value; if (typeof val === "string") {val = [val]}; onChange(val)}}
    >
      {options.map(render)}
    </Select>
  </FormControl>
}

export default function MultiSelectString(props: BaseProps<string>) {
  const {value} = props;
  return <MultiSelect {...props} render={(option: string) => (
    <MenuItem key={option} value={option}>
      <Checkbox checked={value.indexOf(option) > -1} />
      {option}
    </MenuItem>
  )}/>
}

export function MultiSelectRecord(props: BaseProps<[string, any]>) {
  const {value} = props;

  return <MultiSelect {...props} render={(option: [string, any]) => (
    <MenuItem key={option[0]} value={option[0]}>
      <Checkbox checked={value.indexOf(option[0]) > -1} />
      {option[1]}
    </MenuItem>
  )}/> 
}
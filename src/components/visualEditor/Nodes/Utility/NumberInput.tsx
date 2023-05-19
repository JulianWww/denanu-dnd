import * as React from "react";
import { TextField, StandardTextFieldProps } from '@mui/material';
import { evaluteDiceMacro } from "../../../Utils";

interface Props extends StandardTextFieldProps {
  setNumber: (num: number)=>void;
  val?: number;
}

export default function NumberInput(props: Props) {
  const { setNumber, val, ...other } = props;

  const [value, setVal] = React.useState(val === undefined ? "" : val.toString());
  const [defaultVal, setDefaultVal] = React.useState(val);
  const [macroVal, setMacroVal] = React.useState(NaN);
  const [num, setNum] = React.useState(Number(val));

  if (val && val !== defaultVal && val !== num) {
    setVal(val.toString());
    setDefaultVal(val);
  }

  const change = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const str = evt.target.value;
    setVal(str);
    if(str === "") {
      return;
    }
    
    var num = Number(str);

    var mval = NaN;
    if (Number.isNaN(num)) {
      num = evaluteDiceMacro(str);
      mval = num;
    }

    if (!Number.isNaN(num)) {
      setNumber(num);
      setNum(num);
    }

    setMacroVal(mval)
  }

  const invalidMacro = Number.isNaN(macroVal)
  const error = Number.isNaN(Number(val)) && invalidMacro;
  const helpText = invalidMacro ?
    error ? "\"" + val + "\" is not a valid number or die macro like: 1d6+4" : null
    :
    macroVal;
    

  return <TextField
      error={error}
      helperText={helpText}
      {...other}
      value={value}
      variant="standard"
      onChange={change}
    />
}
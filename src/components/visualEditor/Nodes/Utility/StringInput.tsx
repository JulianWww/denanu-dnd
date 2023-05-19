import * as React from "react";
import { Input, InputProps, Popup, Icon } from "semantic-ui-react";
import { TextField, StandardTextFieldProps } from '@mui/material';

interface Props extends StandardTextFieldProps {
  setStr: (num: string)=>void;
  val?: string;
}

export default function StringInput(props: Props) {
  const change = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const str = evt.target.value;
    
    props.setStr(str);
  }

  return <TextField
      {...props}
      value={props.val}
      variant="standard"
      onChange={change}
    />
}
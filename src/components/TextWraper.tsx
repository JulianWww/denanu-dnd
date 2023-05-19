import { useTheme } from "@mui/material";
import * as React from "react";

export default function TextWraper(props: React.HTMLProps<HTMLDivElement> & {type?: "primary" | "secondary" | "disabled"}) {
  const theme = useTheme();
  const {style, type, ...other} = props;

  return <div style={{...style, color: theme.palette.text[type ? type : "primary"]}} {...other}/>
}
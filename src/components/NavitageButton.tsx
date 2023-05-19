import { Button, ButtonProps } from "@mui/material";
import { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

interface Props extends ButtonProps {
  url: string
}

export default function NavigateButton(props: Props) {
  const { url, onClick, ...other } = props;

  const nav = useNavigate();

  return <Button {...other} onClick={(e: MouseEvent<HTMLButtonElement>) =>{
    nav(url);
    if (onClick)
      onClick(e);
  }}/>
}
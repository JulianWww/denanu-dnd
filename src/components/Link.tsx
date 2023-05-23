import { LinkProps, Link as RouteLink } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props extends LinkProps {
  url: string;
}

export default function InternalLink(props: Props) {
  const { url, ...other } = props;
  const nav = useNavigate();

  return <RouteLink {...other} onClick={()=>nav(url)}/>
}
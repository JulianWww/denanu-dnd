import { HTMLProps } from "react";
import { HtmlIframeProps } from "semantic-ui-react";

export interface PlayerData {
  name: string;
  file: string;
}

interface Props extends HTMLProps<HTMLIFrameElement> {
  player: PlayerData;
}

export default function PlayerSheet(props: Props) {
  return <iframe src={props.player.file} className="fullWidth" style={{maxHeight: "1000px"}} {...props}/>
}
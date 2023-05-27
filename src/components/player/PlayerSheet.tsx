import { HTMLProps } from "react";
import addUUID, { UUID } from "../Uuid";

export interface PlayerData extends UUID {
  name: string;
  file?: string;
}

export function makeDefaultPlayerData() {
  const player: PlayerData = {
    name: "", file: ""
  };
  return addUUID(player);
}

interface Props extends HTMLProps<HTMLIFrameElement> {
  player: PlayerData;
}

export default function PlayerSheet(props: Props) {
  return <iframe src={props.player.file} className="fullWidth" width="1024" height="768"  {...props} title={props.player.key}/>
}
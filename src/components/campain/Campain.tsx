import { readPrivateData, readPrivateIndex } from "../../Login/ServerApi";
import { Token } from "../../Login/UseToken";
import { PlayerData } from "../player/PlayerSheet";

export interface CampainIndex {
  name: string;
  file: string;
  players: PlayerData[];
}

export async function loadCamapins(token?: Token) {
  if (!token) return [];
  return await readPrivateData(token, "other", "campains") as CampainIndex[];
}
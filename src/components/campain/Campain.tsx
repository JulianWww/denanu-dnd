import { readPrivateData } from "../../Login/ServerApi";
import { Token } from "../../Login/UseToken";
import addUUID from "../Uuid";
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

export async function loadCamapin(name: string, token?: Token, callback?: (campain: CampainIndex) => void): Promise<CampainIndex | undefined> {
  if (!token) return undefined;
  var data = await readPrivateData(token, "other", "campains") as CampainIndex[];
  data = data.filter((val:CampainIndex) => val.name = name);
  const campain = data[0];
  campain.players.forEach(player => {
    addUUID(player);
  });
  if (callback)
    callback(campain)
  return campain;
}
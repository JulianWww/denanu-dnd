import { readPrivateIndex } from "../../Login/ServerApi";
import { Token } from "../../Login/UseToken";
import { EncounterIndex } from "./Encounter";

export async function loadEncounters(token?: Token) {
  if (!token) return [];

  return await readPrivateIndex<EncounterIndex>("encounters", token);
}
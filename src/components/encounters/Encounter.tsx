import { randomFileName } from "../../Login/ServerApi";
import { MonsterIndex } from "../../pages/SelectMonserStatBlock";
import { Party } from "./PartyData";
import { IXP } from "./xpCalculation";

export interface EncounterMonster {
  count: number;
  mob: MonsterIndex;
  initatives?: number[];
}

export default interface Encounter {
  monsters: Record<string, EncounterMonster>;
  xpThreshhold: IXP;
  parties: Party[];
  name?: string;
  campain?: string;
}

export interface EncounterIndex {
  name: string,
  file: string,
  campain?: string
}

export function getEncounterIndex(name: string, campain?: string) {
  return {
    name: name,
    campain: campain,
  }
}

export function EncounterDefault(){
  return {
    monsters: {},
    xpThreshhold: {easy: 0, medium: 0, hard: 0, deadly: 0},
    parties: [{size: 4, lvl: 1}],
  } as Encounter;
}

export function addMonster(encounter: Encounter, mob: MonsterIndex) {
  if (encounter.monsters[mob.file]) {
    encounter.monsters[mob.file].count += 1;
  }
  else {
    encounter.monsters[mob.file] = {
      count: 1,
      mob: mob,
    };
  }
}
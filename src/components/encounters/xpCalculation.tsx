import { add } from "../Utils";
import Encounter, { EncounterMonster } from "./Encounter";
import { Party } from "./PartyData";

export interface IXP {
  easy: number;
  medium: number;
  hard: number;
  deadly: number;
}

function IXPEquality(a: IXP, b: IXP) {
  return a.easy === b.easy;
}

const playerXp: Record<string, [number, number, number, number]> = {
  0: [0, 0, 0, 0],
  1: [25,50,75,100],
	2: [50,100,150,200],
	3: [75,150,225,400],
	4: [125,250,375,500],
	5: [250,500,750,1100],
	6: [300,600,900,1400],
	7: [350,750,1100,1700],
	8: [450,900,1400,2100],
	9: [550,1100,1600,2400],
	10: [600,1200,1900,2800],
	11: [800,1600,2400,3600],
	12: [1000,2000,3000,4500],
	13: [1100,2200,3400,5100],
	14: [1250,2500,3800,5700],
	15: [1400,2800,4300,6400],
	16: [1600,3200,4800,7200],
	17: [2000,3900,5900,8800],
	18: [2100,4200,6300,9500],
	19: [2400,4900,7300,10900],
	20: [2800,5700,8500,12700]
}

var crXPLookup : Record<number, number>= {
  0: 10,
  0.125: 25,
  0.25: 50,
  0.5: 100,
  1: 200,
  2: 450,
  3: 700,
  4: 1100,
  5: 1800,
  6: 2300,
  7: 2900,
  8: 3900,
  9: 5000,
  10: 5900,
  11: 7200,
  12: 18400,
  13: 10000,
  14: 11500,
  15: 13000,
  16: 15000,
  17: 18000,
  18: 20000,
  19: 22000,
  20: 25000,
  21: 33000,
  22: 41000,
  23: 50000,
  24: 62000,
  25: 75000,
  26: 90000,
  27: 105000,
  28: 120000,
  29: 135000,
  30: 155000
}

export function calculateXpThreshhold(parties: Party[], enc: Encounter, update: VoidFunction) {
  var data: IXP = {easy: 0, medium: 0, hard: 0, deadly: 0}

  for (const party of parties) {
    const xp = playerXp[party.lvl];
    if (xp)
      data= {
        easy: data.easy     + xp[0] * party.size,
        medium: data.medium + xp[1] * party.size,
        hard: data.hard     + xp[2] * party.size,
        deadly: data.deadly + xp[3] * party.size,
      };
  }

  if (!IXPEquality(data, enc.xpThreshhold)) {
    enc.xpThreshhold = data;
    update();
  }

  return data;
}

export function calcMobXp(cr: number) {
  return crXPLookup[cr];
}

export function estimateDifficulty(xp: number, max: IXP) {
  if (xp > max.deadly) return "deadly";
  if (xp > max.hard) return "hard";
  if (xp > max.medium) return "medium";
  if (xp > max.easy) return "easy";
  return "trivial";
}

export function calcBaseEncounterXp(enc: [string, EncounterMonster][]) {
  if (enc.length === 0) return 0;
  return enc.map((val: [string, EncounterMonster]) => {
    return crXPLookup[val[1].mob.cr] * val[1].count
  }).reduce(add)
}

function getCountScalor(c: number) {
  if (c < 2) return 1;
  if (c < 3) return 1.5;
  if (c < 7) return 2;
  if (c < 11) return 2.5;
  if (c < 15) return 3;
  return 5;
}

export function ajustXp(xp: number, enc: [string, EncounterMonster][]) {
  if (xp === 0) return 0;
  const mobCount = enc.map((val: [string, EncounterMonster]) => val[1].count).reduce((add));
  return xp * getCountScalor(mobCount);
}
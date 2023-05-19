import Character, { merge } from "../Character";

export const damage_inputs: Record<string, boolean> = {
  "Acid": false,
  "Cold": false,
  "Fire": false,
  "Force": false,
  "Lightning": false,
  "Necrotic": false,
  "Poison": false,
  "Psychic": false,
  "Radiant": false,
  "Thunder": false,
  "Bludgeoning": true,
  "Slashing": true,
  "Piercing": true,
}

const magic = "Bludgeoning, Piercing, and Slashing from Nonmagical Attacks"
const silver = "Bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered"
const adamantine = "Bludgeoning, piercing, and slashing from nonmagical attacks that aren't adamantine"

export const damage_resistances = [
  magic, silver, adamantine
].concat(Object.keys(damage_inputs));

function hasModification(mods: string[], type: string, ismagic: boolean, issilver: boolean, isadamantine: boolean) {
  if (type === "Generic") return false;

  const includes = mods.includes(type);
  if (!damage_inputs[type] || includes) return includes;

  if (!ismagic) return false;
  if (mods.includes(silver)) return !issilver;
  if (mods.includes(adamantine)) return !isadamantine;
  return true;
}

function hasResistance(character: Character, type: string, magic: boolean, silver: boolean, adamantine: boolean) {
  return hasModification(merge(character.damage_resistances, character.damage_resistances_temp), type, magic, silver, adamantine);
}

function hasImmunity(character: Character, type: string, magic: boolean, silver: boolean, adamantine: boolean) {
  return hasModification(merge(character.damage_immunities, character.damage_immunities_tmp), type, magic, silver, adamantine);
}

function hasVulnerability(character: Character, type: string, magic: boolean, silver: boolean, adamantine: boolean) {
  return hasModification(character.damage_vulnerabilities, type, magic, silver, adamantine);
}


export function applyDamageModifications(character: Character, val: number, type: string, magic: boolean, silver: boolean, adamantine: boolean) {
  if (hasImmunity(character, type, magic, silver, adamantine))      return 0;
  if (hasResistance(character, type, magic, silver, adamantine))    return Math.floor(val/2);
  if (hasVulnerability(character, type, magic, silver, adamantine)) return val * 2;
  return val;
}
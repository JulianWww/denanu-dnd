import Character from "./Character";
import { AbilityToast } from "../visualEditor/Engine/Toasts";
import { Rolls, rollTypedDice } from "../visualEditor/Engine/Utils";
import { toMod } from "./Utility/Utils";

export const attributes = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma"
}

export function getAttribute(character: Character, attr: string) {
  switch(attr) {
    case "str": return character.str;
    case "dex": return character.dex;
    case "con": return character.con;
    case "int": return character.int;
    case "wis": return character.wis;
    case "cha": return character.cha;
    default: return 0;
  }
}

export function AttributeCheck(attr: string, character: Character, roll: Rolls) {
  const mod = toMod(getAttribute(character, attr));
  AbilityToast(attr, rollTypedDice(20, 1, mod, roll), mod);
}
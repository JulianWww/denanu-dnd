import { UUID } from "../Uuid";
import {MacroEditorData} from "../visualEditor/Editor"

export default interface Character extends UUID {
	Armor_Class: string,
	ac: number,
	alignment: string,
	cha: number,
	con: number,
	cr: string,
	dex: number,
	hp: number,
	hp_gen: string,
	int: number,
	name: string,
	size: string,
	str: number,
	type: string,
	wis: number,
	xp: number,
  speed: string,
  senses: string,
  languages: string,
  skills: Record<string, number>,
	saving_throws: Record<string, number>,
  traits: Trait[],
  actions: Trait[],

	legendary_description?: string,
	legendary_actions: Trait[],
	mythic_description?: string,
	mythic_actions: Trait[],
	lair_description?: string,
	lair_description_end?: string,
	lair_actions: Trait[],
	regional_description?: string,
	regional_description_end?: string,
	regional_actions: Trait[],

	condition_immunities: string[],
	damage_immunities: string[],
	damage_resistances: string[],
	damage_vulnerabilities: string[],

	damage_resistances_temp?: Modifier<string>[],
	damage_immunities_tmp?: Modifier<string>[],
	customHp?: number,
}

export function cleanCharacter(char: Character) {
	char.damage_resistances_temp = undefined;
	char.damage_immunities_tmp = undefined;
	char.customHp = undefined;
	return char;
}

export const default_Character: Character = {
	Armor_Class: "",
	ac: 10,
	alignment: "",
	cha: 10,
	con: 10,
	cr: "1",
	dex: 10,
	hp: 0,
	hp_gen: "1d6",
	int: 10,
	name: "",
	size: "",
	str: 10,
	type: "",
	wis: 10,
	xp: 0,
  speed: "",
  senses: "",
  languages: "",
  skills: {},
	saving_throws: {},
  traits: [],
  actions: [],
	
	legendary_description: "",
	legendary_actions: [],
	mythic_actions: [],
	lair_actions: [],
	regional_actions: [],

	condition_immunities: [],
	damage_immunities: [],
	damage_resistances: [],
	damage_vulnerabilities: [],
}

export function changeHP(character: Character, delta: number) {
	if (character.customHp != null) {
		character.customHp += delta;
		character.customHp = Math.min(character.customHp, character.hp);
	}
	else if (delta < 0) {
		character.customHp = character.hp + delta;
	}
}

export function getHp(character: Character) {
	return character.customHp || character.hp
}

export function merge<T>(normal: T[], tmp?: Modifier<T>[]) {
	if (tmp) {
		return Array.from(new Set(normal.concat(tmp.map((val: Modifier<T>) => val.value).flat())));
	}
	return normal;
}

export function hasTempOrOther<T>(normal: T[], tmp?: Modifier<T>[]) {
	return normal.length > 0 || (tmp && tmp.length > 0)
}

export function addDamageResistance(character: Character, id: string, value: string[]) {
	if (character.damage_resistances_temp) {
		const val = character.damage_resistances_temp.filter((val: Modifier<string>) => val.id !== id)
		val.push({id: id, value: value});
		character.damage_resistances_temp = val;
	}
	character.damage_resistances_temp = [{id: id, value: value}]
}

export function removeDamageResistance(character: Character, id: string) {
	if (character.damage_resistances_temp) {
		character.damage_resistances_temp = character.damage_resistances_temp.filter((val: Modifier<string>) => val.id !== id);
	}
}

export function addDamageImmunity(character: Character, id: string, value: string[]) {
	if (character.damage_immunities_tmp) {
		const val = character.damage_immunities_tmp.filter((val: Modifier<string>) => val.id !== id)
		val.push({id: id, value: value});
		character.damage_immunities_tmp = val;
	}
	character.damage_immunities_tmp = [{id: id, value: value}]
}

export function removeDamageImmunity(character: Character, id: string) {
	if (character.damage_immunities_tmp) {
		character.damage_immunities_tmp = character.damage_immunities_tmp.filter((val: Modifier<string>) => val.id !== id);
	}
}

export interface Trait extends UUID {
  name: string,
  description: string,
	script?: MacroEditorData,
}

export function defaultTrait() {
	return {
		name: "",
		description: "",
	}
}

interface Modifier<T> {
	id: string;
	value: T[]
}
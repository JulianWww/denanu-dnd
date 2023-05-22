import { Index } from "../../Login/ServerApi";
import { TimeData } from "../monsters/data/Time";

export default interface Spell extends TimeData {
	atHigherLevels: string;
	availableClasses: string[];
	bookSource: string;
	castingTime: string;
	components: {
		material: boolean;
		somatic: boolean;
		verbal: boolean;
	};
	concentration: boolean;
	damageDices: string[];
	damageTypes: string[];
	description: string;
	isDamaging: true;
	level: number;
	materialComponents: string;
	name: string;
	range: string;
	ritual: boolean;
	savingThrows: string[];
	school: string;
	sourcePage: string;
}

export interface SpellIndex extends Index {
	lvl: number;
	name: string;
	school: string;
	ritual: boolean;
	concentration: boolean;
  source: string;
}

export function calcSpellIdx(spell: Spell) {
	return {
		lvl: spell.level,
		name: spell.name,
		school: spell.school,
		ritual: spell.ritual,
		concentration: spell.concentration,
	} as SpellIndex
}

export function defaultSpell() {
	return {
		atHigherLevels: "",
		availableClasses: [],
		bookSource: "",
		castingTime: "",
		components: {
			material: false,
			somatic: false,
			verbal: false,
		},
		concentration: false,
		damageDices: [],
		damageTypes: [],
		description: "",
		duration: 0,
		duration_type: 0,
		isDamaging: true,
		level: 0,
		materialComponents: "",
		name: "",
		range: "",
		ritual: false,
		savingThrows: [],
		school: "",
		sourcePage: "",
	} as Spell;
}
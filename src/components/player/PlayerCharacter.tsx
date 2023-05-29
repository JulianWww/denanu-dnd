export default interface PlayerCharacter {
  name: string;
  player: string;
  campaign: string;
  cls: string;
  race: string;
  deity: string;
  alignment: string;
  caster: boolean;
  level?: number;
  experience?: number;
}

export function defaultPlayerCharacter() {
  return {
    name: "",
    player: "",
    campaign: "",
    cls: "",
    race: "",
    deity: "",
    alignment: "",
    caster: false,
  }
}

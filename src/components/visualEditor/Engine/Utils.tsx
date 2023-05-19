function rollDie(faces: number) {
  return Math.floor(Math.random() * faces) + 1;
}

export function rollDice(faces: number, die: number, mod: number) {
  var count = 0;
  for (var i=0; i < die; i++) {
    count += rollDie(faces);
  }
  return count + mod;
}

export function rollAdvantageDisadvantageDice(faces: number, die: number, mod: number, advantage: boolean, disadvantage: boolean) {
  return rollTypedDice(faces, die, mod, getRollType(advantage, disadvantage));
}

export function rollTypedDice(faces: number, die: number, mod: number, roll: Rolls) {
  switch(roll) {
    case Rolls.Advantage: return Math.max(rollDice(faces, die, mod), rollDice(faces, die, mod));
    case Rolls.Disadvantage: return Math.min(rollDice(faces, die, mod), rollDice(faces, die, mod));
    default: return rollDice(faces, die, mod);
  }
}

export enum Rolls {
  Advantage,
  Normal,
  Disadvantage,
}

export function getRollType(advantage: boolean, disadvantage: boolean) {
  if (advantage && !disadvantage) {
    return Rolls.Advantage;
  }
  if (!advantage && disadvantage) {
    return Rolls.Disadvantage
  }
  return Rolls.Normal;
}
import * as React from "react";
import { NativeSelect } from '@mui/material';
import { Rolls, getRollType, rollTypedDice } from "../visualEditor/Engine/Utils";
import { useState } from 'react';
import { attributes, getAttribute } from "./Attributes";
import Character from './Character';
import { SkillToast } from "../visualEditor/Engine/Toasts";
import { toMod } from './Utility/Utils';
import { hasSkillDisadvantage } from './Conditions';
import RunnTypeSelector, { RunApi } from "./Utility/RunnTypeSelector";
import CustomRef from "../../Utils/CustomRef";

export const skills: [string, string][] = [
  ["athletics", "str"],
  ["acrobatics", "dex"],
  ["sleight of hand", "dex"],
  ["stealth", "dex"],
  ["arcana", "int"],
  ["history", "int"],
  ["investigation", "int"],
  ["nature", "int"],
  ["religion", "int"],
  ["animal handling", "wis"],
  ["insight", "wis"],
  ["medicine", "wis"],
  ["perception", "wis"],
  ["survival", "wis"],
  ["deception", "cha"],
  ["intimidation", "cha"],
  ["performance", "cha"],
  ["persuasion", "cha"]
]

export const skillNames = skills.map((val: [string, string]) => val[0])

export function getSkillMod(char: Character, skill: string) {
  const atr =  skills.find((value: [string, string]) => {
    return value[0].toLocaleLowerCase() === skill;
  });
  if (!atr) { throw Error(skill + " is Not a valid Skill")}
  return toMod(getAttribute(char, atr[1]))
}

interface Props {
  skill: string,
  attribute: string,
  r: CustomRef<RunApi>;
  character: Character,
  conditions: [string, number, string[]][]
}

function SkillSearchListElement(props: Props) {
  const {skill, attribute, r} = props;
  const [attr, setAttr] = useState(attribute);
  const handleChange = (event: any) => {
    setAttr(event.target.value);
  };
  return <RunnTypeSelector r={r} run={(roll: Rolls) => {
      var mod = Math.floor((getAttribute(props.character, attr) - 10)/2);
      if (props.character.skills[skill]) {
        mod = props.character.skills[skill] + toMod(getAttribute(props.character, attr))
      }
      SkillToast(skill, attr, rollTypedDice(20, 1, mod, roll), mod);
    }}
    rollType={getRollType(false, hasSkillDisadvantage(props.conditions))}
    style={{width: "100%"}}
  >
          {skill}
          <NativeSelect
            variant="standard"
            style={{float: "right", marginLeft: "10px"}}
            value={attribute}
            onChange={handleChange}
          >
            {
              Object.entries(attributes).map(
                (val: [string, string]) => {
                  return <option value={val[0]}>{val[0]}</option>
                }
              )
            }
          </NativeSelect>
  </RunnTypeSelector>
}

const SkillSearch = (character: Character, conditions: [string, number, string[]][]) => skills.map(
  (val: [string, string]) => {
    const ref = new CustomRef<RunApi>();
    return [<SkillSearchListElement r={ref} skill={val[0]} attribute={val[1]} character={character} conditions={conditions}/>, ref] as [JSX.Element, CustomRef<RunApi>]
  }
)

export default SkillSearch;
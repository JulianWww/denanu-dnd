import * as React from "react";
import DurationTypes from "./data/Time";
import ConditionDataDisplay from "./Utility/ConditionDataDisplay";
import { Button, Tooltip } from "@mui/material";
import { Icon } from "semantic-ui-react";
import AddConditionDialog from "./Utility/ConditionAddDialog";
import { JSXToList, toList } from "./Utility/ConditionsListing";
import Character, { addDamageImmunity, addDamageResistance, removeDamageImmunity, removeDamageResistance } from "./Character";
import { damage_resistances } from "./Utility/Damage";


export const conditions: string[] = [
  "Blinded",
  "Charmed",
  "Frightened",
  "Grappled",
  "Incapacitated",
  "Invisible",
  "Paralyzed",
  "Petrified",
  "Poisoned",
  "Prone",
  "Restrained",
  "Stunned",
  "Unconscious",
  "Exhausted"
]

export interface ConditionData {
  level: number;
  duration: number;
  duration_type: DurationTypes;
  additionalData?: string;
}

function defaultConditionsStackInterface(): Record<string, ConditionData[]> {
  return {
    Blinded: [],
    Charmed: [],
    Frightened: [],
    Grappled: [],
    Incapacitated: [],
    Invisible: [],
    Paralyzed: [],
    Petrified: [],
    Poisoned: [],
    Prone: [],
    Restrained: [],
    Stunned: [],
    Unconscious: [],
    Exhausted: [],
  }
}

export interface ConditionStackUpdator {
  setConditionsStack?: (val: Record<string, ConditionData[]>) => void;
  getConditionsStack?: () => Record<string, ConditionData[]>;
}

interface Props extends ConditionStackUpdator {
  conditions: [string, number, string[]][];
  imunities: string[];
  setConditions: (cond: [string, number, string[]][]) => void;
}

interface State {
  conditionsStacks: Record<string, ConditionData[]>
  addCondDialogOpen: boolean;
}


export default class ConditionsDisplay extends React.Component<Props, State> {
  lastConditions?: React.Key;
  constructor(props: Props) {
    super(props);

    const setStack = props.getConditionsStack ? props.getConditionsStack() : {};

    this.state = {
      conditionsStacks: {...defaultConditionsStackInterface(), ...setStack},
      addCondDialogOpen: false
    }
  }

  componentDidMount(): void {
    this.updateConditions(this.state.conditionsStacks);
  }

  calcConditions(conditionsStacks: Record<string, ConditionData[]>) {
    return Object.entries(conditionsStacks).filter((val: [string, ConditionData[]]) => val[1].length > 0).map((val: [string, ConditionData[]]) => {
      return [val[0], 
      val[1].map((val: ConditionData) => val.level).reduce((acc: number, val: number)=> acc + val), 
      val[1].map((val: ConditionData) => val.additionalData).filter((val?: string) => val)] as [string, number, string[]]
    })
  }

  async updateConditionStack(conditionStack: Record<string, ConditionData[]>) {
    if (this.props.setConditionsStack){
      this.props.setConditionsStack(conditionStack);
    }
    else {
      this.setState({conditionsStacks: conditionStack})
    }
  }

  getConditionStack() {
    if (this.props.getConditionsStack) {
      return {...this.props.getConditionsStack()};
    }
    return this.state.conditionsStacks;
  }

  async updateConditions(conditionsStacks: Record<string, ConditionData[]>) {
    const { setConditions } = this.props;
    setConditions(this.calcConditions(conditionsStacks));

    this.setState({
      addCondDialogOpen: false
    });
    this.updateConditionStack(conditionsStacks);
  }


  render(): React.ReactNode {
    const {addCondDialogOpen } = this.state;
    const conditionsStacks = this.getConditionStack();
    const { conditions, imunities } = this.props;

    const hanldeAddCondDialogClose = () => {
      this.setState({addCondDialogOpen: false})
    }

    const addCondition = (cond: string, lvl: number, duration: number, durationType: DurationTypes, additionalData?: string) => {
      const { conditionsStacks } = this.state;
      conditionsStacks[cond].push({level: lvl, duration: duration, duration_type: durationType, additionalData: additionalData});
      this.updateConditions(conditionsStacks);
    }

    const removeCondition = (cond: string, idx: number) => {
      const { conditionsStacks } = this.state;
      conditionsStacks[cond].splice(idx, 1);
      this.updateConditions(conditionsStacks);
    }

    return <div className="positioning-wraper">
      <div className="dnd-condIcon-wraper">
        {conditions.filter((cond: [string, number, string[]]) => {
          return cond[1] > 0;
        }).map((cond: [string, number, string[]]) => {
          return <ConditionDataDisplay name={cond[0]} condition={cond[1]} conditionsStacks={conditionsStacks[cond[0]]} remove={removeCondition}/>
        })
        }
        <div className="dnd-condIcon">
          <Button onClick={() => this.setState({addCondDialogOpen: true})} color="info" variant="text"><Icon name="add"/></Button>
          <AddConditionDialog imunities={imunities} open={addCondDialogOpen} hanldeClose={hanldeAddCondDialogClose} add={addCondition}/>
        </div>
      </div>
    </div>
  }
}

export function hasCondition(conditions: [string, number, string[]][], search: [string, number][]) {
  for (const cond of conditions) {
    for (const s of search) {
      if (cond[0] === s[0] && cond[1] >= s[1]) {
        return cond;
      }
    }
  }
  return null;
}

function getIcon(icon: string) {
  return <img className="inlienImg" src={"/dndimages/conditions/" + icon + ".png"} alt={icon}/>
}
function getDisadvantage() {return getIcon("Disadvantage")}
function getAdvantage() {return getIcon("Advantage")}

export function acModDisplay(conditions: [string, number, string[]][]) {
  const disadvantage = hasCondition(conditions, [["Blinded", 1], ["Paralyzed", 1], ["Petrified", 1], ["Restrained", 1], ["Stunned", 1], ["Unconscious", 1]]) !== null;
  const advantage = hasCondition(conditions, [["Invisible", 1]]) !== null;
  if (disadvantage && !advantage) {
    return <Tooltip title="All attacks have advantage aginst this target" arrow>{getDisadvantage()}</Tooltip>
  }
  else if (!disadvantage && advantage) {
    return <Tooltip title="All attacks have disadvantage aginst this target" arrow>{getAdvantage()}</Tooltip>
  }
  else if (hasCondition(conditions, [["Unconscious", 1]])) {
    return <>
      <Tooltip title="Attacks against hava Advantage, auto crit when within 5 ft." arrow>{getDisadvantage()}</Tooltip>
    </>
  }
  else if (hasCondition(conditions, [["Prone", 1]])) {
    return <>
      <Tooltip title="Attacks from within 5ft have Advantage" arrow>{getDisadvantage()}</Tooltip>
      <Tooltip title="Attacks from further away then 5ft have Disadvantage" arrow>{getAdvantage()}</Tooltip>
    </>
  }
}

export function attackModDisplay(conditions: [string, number, string[]][]) {
  const advantage = hasCondition(conditions, [["Invisible", 1]]) !== null;
  var disadvantage = false;

  if (hasCondition(conditions, [["Blinded", 1], ["Poisoned", 1], ["Restrained", 1], ["Exhausted", 3]])) {
    disadvantage = true;
    if (!advantage) {
      return <Tooltip title="All Attacks have disadvantage" arrow>{getDisadvantage()}</Tooltip>
    }
  }
  var cond = hasCondition(conditions, [["Frightened", 1]])
  if (cond) {
    disadvantage = true;
    if (!advantage) {
      return <Tooltip title={"All Attacks have disadvantage while you can see any of: " + toList(cond[2])} arrow>{getDisadvantage()}</Tooltip>
    }
  }

  if (advantage && !disadvantage) {
    return <Tooltip title="All Attacks have advantage" arrow>{getAdvantage()}</Tooltip>
  }
}

export function skillModDisplay(conditions: [string, number, string[]][]) {
  var effects = [];
  if (hasCondition(conditions, [["Blinded", 1]])) {
    effects.push(<span className="vital">Fails all sight based checks</span>)
  }

  var cond = hasCondition(conditions, [["Frightened", 1]])
  if (hasCondition(conditions, [["Poisoned", 1]])) {
    effects.push(<Tooltip title="All Checks have disadvantage" arrow>{getDisadvantage()}</Tooltip>)
  }
  else if (cond) {
    effects.push(<Tooltip title={"All Checks have disadvantage while you can see any of: " + toList(cond[2])} arrow>{getDisadvantage()}</Tooltip>)
  }
  return JSXToList(effects);
}

export function CanNotMove(conditions: [string, number, string[]][]) {
  return hasCondition(conditions, [["Grappled", 1], ["Paralyzed", 1], ["Petrified", 1], ["Restrained", 1], ["Stunned", 1], ["Unconscious", 1], ["Exhausted", 5]])
}

export function HalfSpeed(conditions: [string, number, string[]][]) {
  return hasCondition(conditions, [["Prone", 1], ["Exhausted", 2]])
}

export function canNotSpeak(conditions: [string, number, string[]][]) {
  return hasCondition(conditions, [["Paralyzed", 1], ["Petrified", 1], ["Stunned", 1], ["Unconscious", 1]])
}

export function CanNotTakeActions(conditions: [string, number, string[]][]) {
  return hasCondition(conditions, [["Incapacitated", 1], ["Paralyzed", 1], ["Petrified", 1], ["Stunned", 1], ["Unconscious", 1]])
}

export function isDead(conditions: [string, number, string[]][], character: Character) {
  return hasCondition(conditions, [["Exhausted", 5]]) !== null
}

export function CanSucceedSaves(conditions: [string, number, string[]][], attr: string) {
  if (attr === "str" || attr === "dex") {
    return !hasCondition(conditions, [["Paralyzed", 1], ["Petrified", 1], ["Stunned", 1], ["Unconscious", 1]])
  }
  return true;
}

export function hasSaveDisadvantage(conditions: [string, number, string[]][], attr: string) {
  if (attr === "dex") {
    return hasCondition(conditions, [["Restrained", 1]]) !== null
  }
  return hasCondition(conditions, [["Exhausted", 3]]) !== null;
}

export function updateCharacterByConditions(character: Character, conditions: [string, number, string[]][]) {
  if (hasCondition(conditions, [["Petrified", 1]])) {
    addDamageResistance(character, "petrified", damage_resistances);
    addDamageImmunity(character, "petrified", ["Poison"]);
  }
  else {
    removeDamageResistance(character, "petrified");
    removeDamageImmunity(character, "petrified");
  }
}

export function hasHPMaxHalved(conditions: [string, number, string[]][]) {
  return hasCondition(conditions, [["Exhausted", 4]]) !== null
}

// Engine

export function hasAttackDisadvantage(conditions: [string, number, string[]][]) {
  if(hasCondition(conditions, [["Blinded", 1], ["Poisoned", 1], ["Restrained", 1], ["Exhausted", 3]])) 
    return true;
  if (hasCondition(conditions, [["Frightened", 1]]))
    return true; // for now change later maybe
  return false;
}

export function hasAttackAdvantage(conditions: [string, number, string[]][]) {
  return hasCondition(conditions, [["Invisible", 1]]) ? true : false;
}

export function hasSkillDisadvantage(conditions: [string, number, string[]][]) {
  return hasCondition(conditions, [["Frightened", 1], ["Poisoned", 1], ["Exhausted", 1]]) !== null
}
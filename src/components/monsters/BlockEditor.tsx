import * as React from "react";
import Character, { Trait, defaultTrait } from "./Character";
import { TextField, MenuItem, Select, InputLabel, FormControl, Box, Chip, SelectChangeEvent, Checkbox, Grid, IconButton, Card, CardContent, Divider, CardActions, Button, ButtonGroup, Collapse, BoxProps, Typography } from "@mui/material";
import NumberInput from "../visualEditor/Nodes/Utility/NumberInput";
import { toMod } from "./Utility/Utils";
import { range } from "../visualEditor/Nodes/Utils";
import { attributes, getAttribute } from "./Attributes";
import { skillNames, skills } from "./Skills";
import TextWraper from "../TextWraper";
import { conditions } from "./Conditions";
import { damage_resistances } from "./Utility/Damage";
import MultiSelectString, { MultiSelectRecord } from "../MultiSelect";
import { calcMobXp } from "../encounters/xpCalculation";
import IOSSwitch from "./Utility/IOSSwitch";
import StatsSheet from "./MonsterStatBlock";
import Draggable from "react-draggable";
import DraggableList from "../DraggableList";
import Inline from "../InlineDisplay";
import { Delete, Edit, Code } from "@mui/icons-material";
import { Markup } from "interweave";
import { TransitionGroup } from "semantic-ui-react";
import { chipSelector } from "../../MuiProps";
import { Center, toDnDString } from "../Utils";
import RightAlign from "../RightAlign";
const Dice = require('dice-notation-js');

export const sizes = ["tiny", "small", "medium", "large", "huge", "gargantuan"];
export const types = ["aberration", "beast", "celestial", "construct", "dragon", "elemental", "fey", "fiend", "giant", "humanoid", "monstrosity", "ooze", "plant", "undead"];
export const alignments = ["lawful good", "neutral good", "chaotic good", "lawful neutral", "neutral", "chaotic neutral", "lawful evil", "neutral evil", "chaotic evil"];
const armors: Record<string, Armor> = {
  "None": {ac: (dex: number, custom: number) => 10 + dex, canCary: (str: number)=> true},
  "Mage Armor": {ac: (dex: number, custom: number) => 13 + dex, canCary: (str: number)=> true},
  "Natural Armor": {ac: (dex: number, custom: number) => custom + dex, canCary: (str: number)=> true, customMod: true},
  Padded: {ac: (dex: number, custom: number) => 11 + dex, canCary: (str: number)=> true},
  Leather: {ac: (dex: number, custom: number) => 11 + dex, canCary: (str: number)=> true},
  "Studded Leather": {ac: (dex: number, custom: number) => 12 + dex, canCary: (str: number)=> true},
  Hide: {ac: (dex: number, custom: number) => 12 + Math.min(dex, 2), canCary: (str: number)=> true},
  "Chain Shirt": {ac: (dex: number, custom: number) => Math.min(dex, 2) + 13, canCary: (str: number)=> true},
  "Scale Mail": {ac: (dex: number, custom: number) => Math.min(dex, 2) + 14, canCary: (str: number)=> true},
  "Spiked Armor": {ac: (dex: number, custom: number) => Math.min(dex, 2) + 14, canCary: (str: number)=> true},
  "Brestplate": {ac: (dex: number, custom: number) => Math.min(dex, 2) + 14, canCary: (str: number)=> true},
  "Halfplate": {ac: (dex: number, custom: number) => Math.min(dex, 2) + 15, canCary: (str: number)=> true},
  "Ring Mail": {ac: (dex: number, custom: number) => 14, canCary: (str: number)=> true},
  "Chain Mail": {ac: (dex: number, custom: number) => 16, canCary: (str: number)=> str >= 13},
  "Splint": {ac: (dex: number, custom: number) => 17, canCary: (str: number)=> str >= 15},
  "Plate": {ac: (dex: number, custom: number) => 18, canCary: (str: number)=> str >= 15},
}
export const CRs = ["0", "1/8", "1/4", "1/2", ...range(1, 30).map((val: number) => val.toString())]
function getProficencyBonus(cr: string) {
  const c = eval(cr);
  if (c < 5) return 2;
  if (c < 9) return 3;
  if (c < 13) return 4;
  if (c < 17) return 5;
  if (c < 21) return 6;
  if (c < 25) return 7;
  if (c < 29) return 8;
  return 9;
}

export const baseLegendaryDescripton = "The monster can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The monster regains spent legendary actions at the start of its turn.";
export const baseMythicDescription = "If the monster's mythic trait is active, it can use the options below as legendary actions for 1 hour after using {Some Ability}.";
export const baseLairDescription = "When fighting inside its lair, the monster can invoke the ambient magic to take lair actions. On initiative count 20 (losing initiative ties), the monster can take one lair action to cause one of the following effects:";
export const baseLairDescriptionEnd = "The monster can't repeat an effect until they have all been used, and it can't use the same effect two rounds in a row.";
export const baseRegionalDescription = "The region containing the monster's lair is warped by the creature's presence, which creates one or more of the following effects:";
export const baseRegionalDescriptionEnd = "If the monster dies, the first two effects fade over the course of 3d10 days.";

const removeTrait = (trait: Trait, traits: Trait[]) =>{
  return traits.filter((val: Trait)=> trait.name !== val.name)
}

interface Armor {
  ac: (dex: number, custom: number) => number;
  canCary: (str: number) => boolean;
  customMod?: boolean
}


interface Props {
  character: Character;
  update: ()=>void;
  openEditor: (t: Trait) => ((e: React.BaseSyntheticEvent) => void);
}

interface Senses {
  blindsight?: number;
  darkvision?: number;
  tremorsense?: number;
  truesight?: number;
  passive?: number;
}

interface State {
  legendaryCreature: boolean;
  mythic: boolean;
  lair: boolean;
  regional: boolean;

  editingTrait: Trait;
}

export default class BlockEditor extends React.Component<Props, State> {
  hitDiceCount: number;
  hitDiceFaces: number;
  hitDiceMod: number;
  armorType: string;
  customAcMod: number;
  savingThrowProficencies: string[];
  skillProficencies: string[];
  skillExpertiese: string[];
  senses: Senses;

  constructor(props: Props) {
    super(props);
    console.clear();
    const { character } = props;

    const hpGenData = Dice.parse(character.hp_gen)
    this.hitDiceCount = hpGenData.number;
    this.hitDiceFaces = hpGenData.type;
    this.hitDiceMod = hpGenData.modifier;

    this.armorType = character.Armor_Class.includes("(") ? character.Armor_Class.substring(character.Armor_Class.indexOf("(")+1, character.Armor_Class.length-1): "None";
    this.customAcMod = character.ac - character.dex;
    this.savingThrowProficencies = Object.keys(character.saving_throws);

    this.skillProficencies = [];
    this.skillExpertiese = [];
    this.senses = {};
    this.computeSkills();
    this.computeSenses();

    this.state = {
      legendaryCreature:  character.legendary_actions.length > 0,
      mythic:             character.mythic_actions.length > 0,
      lair:               character.lair_actions.length > 0,
      regional:           character.regional_actions.length > 0,
      editingTrait: defaultTrait(),
    };

    console.log(character)
  }

  computeSenses() {
    const { character } = this.props;
    const { senses } = this;
    const sensesStrs = character.senses.split(",")
    for (var str of sensesStrs) {
      str = str.trim();
      if (str.startsWith("Passive Perception")) {
        senses.passive = Number(str.slice(19));
      }
      else if (str.startsWith("Darkvision")) {
        senses.darkvision = Number(str.slice(11, -4));
      }
      else if (str.startsWith("Blindsight")) {
        senses.blindsight = Number(str.slice(11, -4));
      }
      else if (str.startsWith("Tremorsense")) {
        senses.tremorsense = Number(str.slice(12, -4))
      }
      else if (str.startsWith("Truesight")) {
        senses.truesight = Number(str.slice(10, -4));
      }
      else {
        console.log(str);
      }
    }
  }

  computeSkills() {
    const proficency = getProficencyBonus(this.props.character.cr);
    this.skillProficencies = [];
    this.skillExpertiese = [];
    Object.entries(this.props.character.skills).forEach((val: [string, number]) => {
      const [skill, mod] = val;
      const lvl = mod / proficency;
      if (lvl === 1) {this.skillProficencies.push(skill); return}
      if (lvl === 2) {this.skillExpertiese.push(skill); return}
      throw Error("skill " + skill + " with additional mod " + mod + " and lvl " + lvl + " is not valid with proficency bonus " + proficency)
    })
  }

  update() {
    this.props.update()
  }

  updateTrait = () => {
    this.setState({
      editingTrait: defaultTrait()
    });
    this.update();
  }

  updateHpGen() {
    const {hitDiceCount, hitDiceFaces, hitDiceMod} = this;
    this.props.character.hp_gen = hitDiceCount + "d" + hitDiceFaces + " + " + hitDiceMod;
    this.props.character.hp = Math.ceil(((hitDiceFaces+1))/ 2 * hitDiceCount + hitDiceMod)
    this.update();
  }

  updateArmor() {
    this.props.character.ac = armors[this.armorType].ac(toMod(this.props.character.dex), this.customAcMod);
    this.props.character.Armor_Class = this.props.character.ac + " (" + this.armorType + ")";
    this.update();
  }

  _updateSavingThrows() {
    var out: Record<string, number> = {};
    const bonus = getProficencyBonus(this.props.character.cr);
    for (const stat of this.savingThrowProficencies) {
      out[stat] = toMod(getAttribute(this.props.character, stat)) + bonus;
    }
    this.props.character.saving_throws = out;
  }

  updateSavingThrows() {
    this._updateSavingThrows();
    this.update();
  }

  _updateSkills(skills: string[], mod: number) {
    for (const skill of skills) {
      this.props.character.skills[skill] = mod;
    }
  }

  _updateSkillsProficency() {
    this.props.character.skills = {};
    const bonus = getProficencyBonus(this.props.character.cr);
    this._updateSkills(this.skillExpertiese, bonus*2);
    this._updateSkills(this.skillProficencies, bonus);
  }

  updateSkillsProficency() {
    this._updateSkillsProficency();
    this.update();
    this.computeSkills();
  }

  updateSkillsExprtise() {
    this.props.character.skills = {};
    const bonus = getProficencyBonus(this.props.character.cr);
    this._updateSkills(this.skillProficencies, bonus);
    this._updateSkills(this.skillExpertiese, bonus*2);
    this.update();
    this.computeSkills();
  }

  updateProficencyBonus() {
    this._updateSavingThrows();
    this._updateSkillsProficency();
    this.update();
    this.computeSkills();
  }

  removeFromDamages(damages: string[]) {
    const predicate = (val: string) => damages.indexOf(val) === -1;
    const { character } = this.props;
    
    character.damage_immunities = character.damage_immunities.filter(predicate);
    character.damage_resistances = character.damage_resistances.filter(predicate);
    character.damage_vulnerabilities = character.damage_vulnerabilities.filter(predicate);
  }

  removeCharacterTrait = (trait: Trait) => {
    const { character } = this.props;
    character.traits = removeTrait(trait, character.traits);
  }

  removeCharacterAction = (trait: Trait) => {
    const { character } = this.props;
    character.actions = removeTrait(trait, character.actions);
  }

  removeCharacterLegendaryAction = (trait: Trait) => {
    const { character } = this.props;
    character.legendary_actions = removeTrait(trait, character.legendary_actions);
  }

  removeCharacterMythicActions = (trait: Trait) => {
    const { character } = this.props;
    character.mythic_actions = removeTrait(trait, character.mythic_actions);
  }

  removeCharacterLairActions = (trait: Trait) => {
    const { character } = this.props;
    character.lair_actions = removeTrait(trait, character.lair_actions);
  }

  removeCharacterRegionalActions = (trait: Trait) => {
    const { character } = this.props;
    character.regional_actions = removeTrait(trait, character.regional_actions);
  }

  render() {
    const {character} = this.props;
    const { legendaryCreature, editingTrait, mythic, lair, regional } = this.state;

    return <div id="stat-block-editing-wraper">
        <table>
          <tbody>
            <tr>
              <td>
                <TextField label="name" value={character.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {character.name = e.target.value; this.update()}} fullWidth/>
              </td>
              <td>
                <TextField select label="Size" value={character.size.toLowerCase()} fullWidth onChange={(e: React.ChangeEvent<HTMLInputElement>) => {character.size = e.target.value; this.update()}}>
                  {strSelect(sizes)}
                </TextField>
              </td>
              <td>
                <TextField select label="Type" value={character.type} fullWidth onChange={(e: React.ChangeEvent<HTMLInputElement>) => {character.type = e.target.value; this.update()}}>
                  {strSelect(types)}
                </TextField>
              </td>
              <td>
              <TextField select label="Alignment" value={character.alignment} fullWidth onChange={(e: React.ChangeEvent<HTMLInputElement>) => {character.alignment = e.target.value; this.update()}}>
                  {strSelect(alignments)}
                </TextField>
              </td>
            </tr>
          </tbody>
        </table>
        <hr/>
        <table>
          <tbody>
            <tr>
              <td>
                <NumberInput label="hit die count" val={this.hitDiceCount} setNumber={(n: number) => {this.hitDiceCount = n; this.updateHpGen();}} fullWidth/>
              </td>
              <td>
                <NumberInput label="hit die faces" val={this.hitDiceFaces} setNumber={(n: number) => {this.hitDiceFaces = n; this.updateHpGen();}} fullWidth/>
              </td>
              <td>
                <NumberInput label="hit die mod" val={this.hitDiceMod} setNumber={(n: number) => {this.hitDiceMod = n; this.updateHpGen();}} fullWidth/>
              </td>
              <td>
                <TextField select label="Armor" value={this.armorType} fullWidth onChange={(e: React.ChangeEvent<HTMLInputElement>) => {this.armorType = e.target.value; this.updateArmor()}}>
                  {Object.entries(armors).map((val: [string, Armor]) =>
                    <MenuItem key={val[0]} value={val[0]} className="fullWidth">
                      <Grid container columns={2} justifyContent="space-between">
                        <Grid item>
                          {val[0]}  
                        </Grid>
                        <Grid item>
                          {
                            val[1].ac(toMod(this.props.character.dex), this.customAcMod)
                          }
                        </Grid>
                      </Grid>
                    </MenuItem>)
                  }
                </TextField>
              </td>
              {armors[this.armorType]?.customMod ?
                <td>
                  <NumberInput label="hit die mod" val={this.customAcMod} setNumber={(n: number) => {this.customAcMod = n; this.updateArmor();}} fullWidth/>
                </td>
                : null
              }
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <td>
                <TextField label="speed" value={character.speed} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {character.speed = e.target.value; this.update()}} fullWidth/>
              </td>
            </tr>
          </tbody>
        </table>
        <hr/>
        <table>
          <tbody>
            <tr>
              <td>
                <NumberInput label="STR" val={character.str} setNumber={(n: number) => {character.str = n; this.updateArmor();}} fullWidth/>
              </td>
              <td>
                <NumberInput label="DEX" val={character.dex} setNumber={(n: number) => {character.dex = n; this.updateArmor();}} fullWidth/>
              </td>
              <td>
                <NumberInput label="CON" val={character.con} setNumber={(n: number) => {character.con = n; this.updateArmor();}} fullWidth/>
              </td>
              <td>
                <NumberInput label="INT" val={character.int} setNumber={(n: number) => {character.int = n; this.updateArmor();}} fullWidth/>
              </td>
              <td>
                <NumberInput label="WIS" val={character.wis} setNumber={(n: number) => {character.wis = n; this.updateArmor();}} fullWidth/>
              </td>
              <td>
                <NumberInput label="CHA" val={character.cha} setNumber={(n: number) => {character.cha = n; this.updateArmor();}} fullWidth/>
              </td>
            </tr>
          </tbody>
        </table>
        <hr/>
        <table>
          <tbody>
            <tr>
              <td>
                <MultiSelectString 
                  value={this.savingThrowProficencies} 
                  options={Object.keys(attributes)} 
                  onChange={(val: string[]) => {
                    this.savingThrowProficencies = val; this.updateSavingThrows()
                  }}
                  label="Saving Throw Proficencies"
                  />
              </td>
              <td>
                <MultiSelectString 
                  value={character.condition_immunities} 
                  options={conditions} 
                  onChange={(val: string[]) => {
                    character.condition_immunities = val;
                    this.update();
                  }}
                  label="Condition Immunities"
                  />
              </td>
            </tr>
          </tbody>
        </table>
        <h4>
          <TextWraper>
            Skills
          </TextWraper>
        </h4>
        <table>
          <tbody>
            <tr>
              <td>
              <MultiSelectString
                  value={this.skillProficencies} 
                  options={skillNames} 
                  onChange={(val: string[]) => {
                    this.skillProficencies = val;
                    this.updateSkillsExprtise()
                  }}
                  label="Skill Expertise"
                  />
              </td>
              <td>
              <MultiSelectString
                  value={this.skillExpertiese} 
                  options={skillNames} 
                  onChange={(val: string[]) => {
                    this.skillExpertiese = val;
                    this.updateSkillsExprtise()
                  }}
                  label="Skill Expertise"
                  />
              </td>
            </tr>
          </tbody>
        </table>
        <h4>
          <TextWraper>
            Damage
          </TextWraper>
        </h4>
        <table>
          <tbody>
            <tr>
              <td>
                <MultiSelectString 
                  value={character.damage_resistances} 
                  options={damage_resistances} 
                  onChange={(val: string[]) => {
                    this.removeFromDamages(val);
                    character.damage_resistances = val;
                    this.update();
                  }}
                  label="Damage Resistances"
                  />
              </td>
              <td>
                <MultiSelectString 
                  value={character.damage_immunities} 
                  options={damage_resistances} 
                  onChange={(val: string[]) => {
                    this.removeFromDamages(val);
                    character.damage_immunities = val;
                    this.update();
                  }}
                  label="Damage Immunities"
                  />
              </td>
              <td>
                <MultiSelectString 
                  value={character.damage_vulnerabilities} 
                  options={damage_resistances} 
                  onChange={(val: string[]) => {
                    this.removeFromDamages(val);
                    character.damage_vulnerabilities = val;
                    this.update();
                  }}
                  label="Damage Vulnerabilities"
                  />
              </td>
            </tr>
          </tbody>
        </table>
        <Grid container>
          <Grid item>
            <NumberInput label="Blindsights" setNumber={()=>1}/>
          </Grid>
        </Grid>
        <table>
          <tbody>
            <tr>
              <td/>
              <td>
                <TextField select label="Challenge Rating" value={character.cr} fullWidth onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  character.cr = e.target.value;
                  character.xp = calcMobXp(eval(character.cr));
                  this.updateProficencyBonus()
                }} 
                sx={{mt: 5}}
                >
                  {strSelect(CRs)}
                </TextField>
                <TextWraper type="secondary">
                  Proficency Bonus: {getProficencyBonus(character.cr)}
                </TextWraper>
              </td>
              <td/>
            </tr>
          </tbody>
        </table>
        <hr/>
        <TextWraper>
          <Grid container 
            justifyContent="center"
            columns={2}
            rowSpacing={1}
          >
            <Grid item xs={1} className="textRight">
              Legendary Creature:
            </Grid>
            <Grid item xs={1}>
              <IOSSwitch sx={{ml:1}} checked={legendaryCreature} onClick={()=>this.setState({legendaryCreature: !legendaryCreature})}/>
            </Grid>
          </Grid>
        </TextWraper>

        <Collapse in={legendaryCreature}>
          <TextWraper>
            <Grid container
              justifyContent="space-evenly"
              columns={3}
              sx={{mt: 4}}
            >
              <Grid item xs={1}>
                <div className="centered">
                  Mythic:
                  <IOSSwitch sx={{ml:1}} checked={mythic} onClick={()=>this.setState({mythic: !mythic})}/>
                </div>
              </Grid>
              <Grid item xs={1}>
                <div className="centered">
                  Lair:
                  <IOSSwitch sx={{ml:1}} checked={lair} onClick={()=>this.setState({lair: !lair})}/>
                </div>
              </Grid>
              <Grid item xs={1}>
                <div className="centered">
                  Regional:
                  <IOSSwitch sx={{ml:1}} checked={regional} onClick={()=>this.setState({regional: !regional})}/>
                </div>
              </Grid>
            </Grid>
          </TextWraper>
          <CenterBox>
            <DescriptionField 
              val={or(character.legendary_description, baseLegendaryDescripton)} 
              set={(e?: string) => {
                character.legendary_description = e;
                this.update();
              }}
              label="Legendary Description"
            />

            <Collapse in={mythic}>
              <DescriptionField 
                val={or(character.mythic_description, baseMythicDescription)} 
                set={(e?: string) => {
                  character.mythic_description = e;
                  this.update();
                }}
                label="Mythic Description"
              />
            </Collapse>

            <Collapse in={lair}>
              <DescriptionField 
                val={or(character.lair_description, baseLairDescription)} 
                set={(e?: string) => {
                  character.lair_description = e;
                  this.update();
                }}
                label="Lair Actions Description"
              />
              <DescriptionField 
                val={or(character.lair_description_end, baseLairDescriptionEnd)} 
                set={(e?: string) => {
                  character.lair_description_end = e;
                  this.update();
                }}
                label="Lair Actions End Note Description"
              />
            </Collapse>

            <Collapse in={regional}>
              <DescriptionField 
                val={or(character.regional_description, baseRegionalDescription)} 
                set={(e?: string) => {
                  character.lair_description = e;
                  this.update();
                }}
                label="Regional Effects Description"
              />
              <DescriptionField 
                val={or(character.regional_description_end, baseRegionalDescriptionEnd)} 
                set={(e?: string) => {
                  character.lair_description_end = e;
                  this.update();
                }}
                label="Regional Effects End Note Description"
              />
            </Collapse>
          </CenterBox>
        </Collapse>
          
        <CenterBox>
          <Card>
            <CardContent>
              <TextField label="name" fullWidth value={editingTrait.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                editingTrait.name = e.target.value;
                this.setState({})
              }}/>
            </CardContent>
            <Divider/>
            <CardContent>
              <TextField label="description" fullWidth multiline minRows={4} value={editingTrait.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                editingTrait.description = e.target.value;
                this.setState({})
              }}/>
            </CardContent>
            <Divider/>
            <CardContent>
              <TextWraper type="disabled">
                Preview
              </TextWraper>
              <Markup content={editingTrait.description}/>
            </CardContent>
            <CardActions>
              <Button onClick={() => {
                  character.traits.push({...editingTrait});
                  this.updateTrait();
                }}
              >
                Add Trait
              </Button>
              <Button onClick={() => {
                  character.actions.push({...editingTrait});
                  this.updateTrait();
                }}
              >
                Add Action
              </Button>

              <Button color="error" onClick={this.updateTrait}>
                Clear
              </Button>
            </CardActions>

            <Collapse in={legendaryCreature}>
              <CardActions>
                <Button onClick={()=> {
                    character.legendary_actions.push({...editingTrait});
                    this.updateTrait();
                  }}
                >
                  Legendary Action
                </Button>

                <Collapse in={mythic} orientation="horizontal">
                  <Button onClick={()=> {
                      character.mythic_actions.push({...editingTrait});
                      this.updateTrait();
                    }}
                    sx={{marginLeft: 1}}
                  >
                    Mythic Action
                  </Button>
                </Collapse>

                <Collapse in={lair} orientation="horizontal">
                  <Button onClick={()=> {
                      character.lair_actions.push({...editingTrait});
                      this.updateTrait();
                    }}
                  >
                    Lair Action
                  </Button>
                </Collapse>

                <Collapse in={regional} orientation="horizontal">
                  <Button onClick={()=> {
                      character.regional_actions.push({...editingTrait});
                      this.updateTrait();
                    }}
                  >
                    <Typography>
                      Regional Effect
                    </Typography>
                  </Button>
                </Collapse>
              </CardActions>
            </Collapse>
          </Card>
        </CenterBox>

        <Collapse in={character.traits.length > 0}>
          <h4 {...listTopProps}>
            <TextWraper>
            Traits:
            </TextWraper>
          </h4>
          <DraggableList id="traits-list" 
            items={character.traits}
            setItems={(val: Trait[]) => {
              character.traits = val;
              this.update();
            }}
            {...this.draggableListProps(this.removeCharacterTrait)}
          />
        </Collapse>
        
        <Collapse in={character.actions.length > 0}>
          <h4 {...listTopProps}>
            <TextWraper>
              Actions:
            </TextWraper>
          </h4>
          <DraggableList id="actions-list" 
            items={character.actions}
            setItems={(val: Trait[]) => {
              character.actions = val;
              this.update();
            }}
            {...this.draggableListProps(this.removeCharacterAction)}
          />
        </Collapse>

        <Collapse in={legendaryCreature}>
          <Collapse in={character.legendary_actions.length > 0}>
            <h4 {...listTopProps}>
              <TextWraper>
                Legendary Actions:
              </TextWraper>
            </h4>
            <DraggableList id="legendary-actions-list" 
              items={character.legendary_actions}
              setItems={(val: Trait[]) => {
                character.legendary_actions = val;
                this.update();
              }}
              {...this.draggableListProps(this.removeCharacterLegendaryAction)}
            />
          </Collapse>

          <Collapse in={mythic && character.mythic_actions.length > 0}>
            <h4 {...listTopProps}>
              <TextWraper>
                Mythic Actions:
              </TextWraper>
            </h4>
            <DraggableList id="mythic-actions-list" 
              items={character.mythic_actions}
              setItems={(val: Trait[]) => {
                character.mythic_actions = val;
                this.update();
              }}
              {...this.draggableListProps(this.removeCharacterMythicActions)}
            />
          </Collapse>

          <Collapse in={lair && character.lair_actions.length > 0}>
            <h4 {...listTopProps}>
              <TextWraper>
                Lair Actions:
              </TextWraper>
            </h4>
            <DraggableList id="lair-actions-list" 
              items={character.lair_actions}
              setItems={(val: Trait[]) => {
                character.lair_actions = val;
                this.update();
              }}
              {...this.draggableListProps(this.removeCharacterLairActions)}
            />
          </Collapse>

          <Collapse in={regional && character.regional_actions.length > 0}>
            <h4 {...listTopProps}>
              <TextWraper>
                Regional Effects:
              </TextWraper>
            </h4>
            <DraggableList id="regional-actions-list" 
              items={character.regional_actions}
              setItems={(val: Trait[]) => {
                character.regional_actions = val;
                this.update();
              }}
              {...this.draggableListProps(this.removeCharacterRegionalActions)}
            />
          </Collapse>
        </Collapse>      
      </div>
  }
  
  draggableListProps = (remove: (t: Trait) => void) => { 
    return {
      render: (val: Trait) => <Grid container sx={{pr: 5}}>
          <Grid item sx={{flexGrow: 1}}>
            <Chip label={val.name} sx={{m: 1}}/>
          </Grid>
          <Grid item>
            <IconButton onClick={
              this.props.openEditor(val)
            }>
              <Code/>
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={() => {
              this.setState({
                editingTrait: val
              })
            }}>
              <Edit/>
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton color="error" onClick={() => {
              remove(val);
              this.update();
            }}>
              <Delete/>
            </IconButton>
          </Grid>
        </Grid>,
      idProvider: (val: Trait) => val.name,
    }
  }
}

function CenterBox(props: BoxProps){
  const {children, sx, ...other} = props;
  return <Center {...other} sx={{mt: 4, ...sx}}>
    <div style={{width: "60%"}}>
      {children}
    </div>
  </Center>
}

const listTopProps = {style: {marginTop: "16px"}};

function DescriptionField(props: {
  set: (val?: string)=> void,
  val: string;
  label: string;  
}) {
  return <>
    <TextField fullWidth label={props.label} multiline minRows={4} value={props.val} onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.set(e.target.value)}/>
    <div className="centered">
      <Button onClick={() => props.set()} sx={{mt:1}}>
        Reset To Default
      </Button>
    </div>
  </>
}

export function or(a: any, b: any) {
  return a ? a : b
}

export function strSelect(arr: string[] | number[]) {
  return arr.map((val: string | number) =>
    <MenuItem key={val} value={val}>
      {val}
    </MenuItem>
  )
}

export function strSelectIdxValue(arr: string[] | number[]) {
  return arr.map((val: string | number, idx: number) =>
    <MenuItem key={val} value={idx}>
      {val}
    </MenuItem>
  )
}
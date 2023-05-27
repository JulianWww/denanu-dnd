import * as React from 'react';
import Character, {Trait, getHp, hasTempOrOther, merge} from "./Character";
import Editor, { MacroEditorData } from '../visualEditor/Editor';
import "./css/statblock.css";
import "./css/statblockpage.css";
import printDiv, { AttributeToMod, toDnDString, toPng } from "../Utils";
import { AttributeCheck } from "./Attributes";
import { Markup } from 'interweave';
import SkillSearch, { getSkillMod } from "./Skills";
import SavingThrowList from "./Utility/SavingThrows";
import RunnerSelector from "./Utility/RunnerSelection";
import { runScript } from "../visualEditor/Engine/Engine";
import { NoScriptToast } from "../visualEditor/Engine/Toasts";
import BlockEditor, { baseLairDescription, baseLairDescriptionEnd, baseLegendaryDescripton, baseMythicDescription, baseRegionalDescription, baseRegionalDescriptionEnd, or } from "./BlockEditor";
import ConditionsDisplay, {acModDisplay, attackModDisplay, skillModDisplay, CanNotMove, CanNotTakeActions, canNotSpeak, updateCharacterByConditions, HalfSpeed, hasHPMaxHalved, isDead, ConditionStackUpdator} from "./Conditions";
import ConditionListing, { toList } from './Utility/ConditionsListing';
import TakeDamageDialog from './Utility/TakeDamage';
import CustomRef from '../../Utils/CustomRef';
import RunnTypeSelector from './Utility/RunnTypeSelector';
import { Rolls } from '../visualEditor/Engine/Utils';
import { Box, Button, ButtonGroup, Collapse, Dialog } from "@mui/material";
import { SlideUp } from '../Transitions';
import Markdown from './Markdown';
import RightAlign from '../RightAlign';

const seperator = <svg height="5" width="100%" className="tapered-rule" viewBox="0 0 2 2" preserveAspectRatio="none">
  <polyline points="0,0 2,1 0,2"/>
</svg>

interface Props extends ConditionStackUpdator {
  character: Character;
  upload?: () => Promise<any>;
  setConditions?: (conditions: [string, number, string[]][]) => void;
  conditions?: [string, number, string[]][];
}

interface State {
  loading: boolean;
  mdOpen: boolean;
  edititingTrait?: Trait;
  blockEditing: boolean;
  conditions: [string, number, string[]][];
}

export default class StatsSheet extends React.Component<Props, State> {
  openDamageDialog: CustomRef<VoidFunction>;

  constructor(props: Props) {
    super(props);

    this.state = {
      mdOpen: false,
      loading: false,
      blockEditing: false,
      conditions: props.conditions ? props.conditions : [],
    }
    this.openDamageDialog = new CustomRef();
  }

  setConditions = (conditions: [string, number, string[]][]) => {
    updateCharacterByConditions(this.props.character, conditions);
    this.setState({conditions: conditions});
    if (this.props.setConditions) {
      this.props.setConditions(conditions);
    }
  }

  static buildStrNumRecord(record: [string, number][]) {
    return record.map(
      ([skill, mod]: [string, number], idx: number, arr: [string, number][]) => {
        if (idx === arr.length - 1) 
          return <span key={idx}>{skill} {toDnDString(mod)}</span>
        return <span key={idx}>{skill} {toDnDString(mod)}, </span>
      }
    )
  }

  buildSkills() {
    return StatsSheet.subBuildSkills(this.props.character)
  }

  static subBuildSkills(character: Character) {
    return Object.entries(character.skills).map(
      ([skill, mod]: [string, number], idx: number, arr: [string, number][]) => {
        const newMod = toDnDString(mod + getSkillMod(character, skill))
        if (idx === arr.length - 1) 
          return <span key={idx}>{skill} {newMod}</span>
        return <span key={idx}>{skill} {newMod}, </span>
      }
    )
  }

  buildSavingThrows(){
    return StatsSheet.buildStrNumRecord(Object.entries(this.props.character.saving_throws));
  }
  
  buildTraits() {
    return this.subBuildActions(this.props.character.traits);
  }

  runScript(traits: Trait[], idx: number) {
    return () => {
      const script = traits[idx].script;
      if (script) {
        runScript(this.props.character, this.state.conditions, script.script);
      }
      else {
        NoScriptToast();
      }
    }
  }

  static traitRender(val: Trait) {
    return <p>
      <em><strong>{val.name}. </strong></em>
      <Markup content={val.description}/>
    </p>
  }

  static renderTraits(traits: Trait[], render: (trait: Trait, idx: number, child: JSX.Element) => JSX.Element) {
    return traits.map((val: Trait, idx: number) => 
      render(val, idx, StatsSheet.traitRender(val))
    );
  }

  subBuildActions(traits: Trait[]) {
    return StatsSheet.renderTraits(traits, (trait: Trait, idx: number, child: JSX.Element)=> 
      <div key={idx} className="property-block" onContextMenu={this.openEditor(trait)} onClick={this.runScript(traits, idx)}>
        {child}
      </div>
    );
  }

  buildConditionImunities() {
    return toList(this.props.character.condition_immunities);
  }

  buildDamageImunities() {
    return toList(merge(this.props.character.damage_immunities, this.props.character.damage_immunities_tmp), ";");
  }

  buildDamageVulnerabilities() {
    return toList(this.props.character.damage_vulnerabilities);
  }

  buildDamageReistances() {
    return toList(merge(this.props.character.damage_resistances, this.props.character.damage_resistances_temp), ";");
  }

  buildActions() {
    return this.subBuildActions(this.props.character.actions);
  }

  buildLegendaryActions() {
    return [<p key="-1">{or(this.props.character.legendary_description, baseLegendaryDescripton)}</p>, ...this.subBuildActions(this.props.character.legendary_actions)]
  }

  buildMythicActions() {
    return [<p key="-1">{or(this.props.character.mythic_description, baseMythicDescription)}</p>, ...this.subBuildActions(this.props.character.mythic_actions)]
  }

  buildLairActions() {
    return [<p key="-1">{or(this.props.character.lair_description, baseLairDescription)}</p>, ...this.subBuildActions(this.props.character.lair_actions), <p key="-2">{or(this.props.character.lair_description_end, baseLairDescriptionEnd)}</p>]
  }

  buildRegionalActions() {
    return [<p key="-1">{or(this.props.character.regional_description, baseRegionalDescription)}</p>, ...this.subBuildActions(this.props.character.regional_actions), <p key="-2">{or(this.props.character.regional_description_end, baseRegionalDescriptionEnd)}</p>]
  }

  openEditor = (trait: Trait) => {
    return (e: React.BaseSyntheticEvent) => {
      this.setState({
        edititingTrait: trait,
      });
      e.preventDefault();
    }
  }

  render() {
    const {character, setConditionsStack, getConditionsStack} = this.props;
    const { conditions, mdOpen } = this.state;
    const {
      name, size, type, alignment, Armor_Class, hp, hp_gen, speed, str, dex, con, int, wis, cha, cr, xp, senses, languages
    } = character;
    const { edititingTrait, blockEditing } = this.state;

    var actions = <div className="actions">
        <div id="traits-list-right">
          <h3>Actions {attackModDisplay(conditions)}</h3>
          {this.buildActions()}
          {this.props.character.legendary_actions.length > 0 ? 
          <>
            <h3>Legendary Actions</h3>
            {this.buildLegendaryActions()}
          </>
          :
          null
          }
          {
            character.mythic_actions.length > 0 ?
            <>
              <h3>
                Mythic Actions
              </h3>
              {this.buildMythicActions()}
            </>
            :
            null
          }
          {
            character.lair_actions.length > 0 ?
            <>
              <h3>
                Lair Actions
              </h3>
              {this.buildLairActions()}
            </>
            :
            null
          }
          {
            character.regional_actions.length > 0 ?
            <>
              <h3>
                Regional Effects
              </h3>
              {this.buildRegionalActions()}
            </>
            :
            null
          }
        </div>
      </div>
    if (CanNotTakeActions(conditions)) {
      actions = <s>{actions}</s>
    }
    const halfHPmax = hasHPMaxHalved(conditions);
    const maxHp = halfHPmax ? Math.floor(hp/2) : hp
    const dead = isDead(conditions, character);
    character.customHp = Math.min(getHp(character), maxHp);

    const block = React.createRef<HTMLDivElement>();

    const print = () => printDiv(block, character.name)
    const png = () => toPng(block, character.name);
    const md = () => this.setState({mdOpen: !mdOpen});

    return <>
      <RightAlign>
        <ButtonGroup>
          <Button>End Turn</Button>
          <Button>Short rest</Button>
          <Button>Long rest</Button>
        </ButtonGroup>
      </RightAlign>
      <div id="stat-block-wrapper" ref={block}>
        <div id="stat-block" className="stat-block wide">
        <hr className="orange-border"/>
          <ConditionsDisplay imunities={character.condition_immunities} conditions={conditions} setConditions={this.setConditions} setConditionsStack={setConditionsStack} getConditionsStack={getConditionsStack}/>
          <div className="section-left">
            <div className="creature-heading">
              <table className='fixed'>
                <tbody>
                  <tr>
                    <td>
                      <h1 id="monster-name">{name}</h1>
                      <h2 id="monster-type">{size} {type}, {alignment}</h2>
                    </td>
                    <td className="death-message" hidden={!dead}>
                      <h1>Dead</h1>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {seperator}
            <div className="top-stats">
            <div className="property-line first">
              <h4>Armor Class </h4>
              <p id="armor-class">{Armor_Class}{acModDisplay(conditions)}</p>
              
            </div>
            <div className="property-line" onClick={
              () => {
                if (this.openDamageDialog.val) {this.openDamageDialog.val();}
              }
            }>
              <h4>Hit Points </h4>
              <p id="hit-points">{character.customHp} ({hp_gen}) (Max: {maxHp})</p>
            </div>
            <div className="property-line last">
              <h4>Speed </h4>
              {CanNotMove(conditions) ? 
                <p id="speed"><s>{speed}</s>&nbsp; 0ft.</p>
                : (
                HalfSpeed(conditions) ?
                <p id="speed">{speed}  Half Speed</p>
                :
                <p id="speed">{speed}</p>
                )
              }
              
            </div>
            {seperator}
            <div className="scores">
              <RunnTypeSelector className="scores-strength" run={(roll: Rolls)=> AttributeCheck("str", character, roll)}>
                <h4>STR</h4>
                <p id="strpts">{str} ({AttributeToMod(str)})</p>
              </RunnTypeSelector>
              <RunnTypeSelector className="scores-dexterity" run={(roll: Rolls)=> AttributeCheck("dex", character, Rolls.Advantage)}>
                <h4>DEX</h4>
                <p id="dexpts">{dex} ({AttributeToMod(dex)})</p>
              </RunnTypeSelector>
              <RunnTypeSelector className="scores-constitution" run={(roll: Rolls)=> AttributeCheck("con", character, Rolls.Advantage)}>
                <h4>CON</h4>
                <p id="conpts">{con} ({AttributeToMod(con)})</p>
              </RunnTypeSelector>
              <RunnTypeSelector className="scores-intelligence" run={(roll: Rolls)=> AttributeCheck("int", character, Rolls.Advantage)}>
                <h4>INT</h4>
                <p id="intpts">{int} ({AttributeToMod(int)})</p>
              </RunnTypeSelector>
              <RunnTypeSelector className="scores-wisdom" run={(roll: Rolls)=> AttributeCheck("wis", character, Rolls.Advantage)}>
                <h4>WIS</h4>
                <p id="wispts">{wis} ({AttributeToMod(wis)})</p>
              </RunnTypeSelector>
              <RunnTypeSelector className="scores-charisma" run={(roll: Rolls)=> AttributeCheck("cha", character, Rolls.Advantage)}>
                <h4>CHA</h4>
                <p id="chapts">{cha} ({AttributeToMod(cha)})</p>
              </RunnTypeSelector>
            </div> 
            {seperator}
              <div id="properties-list">
                <RunnerSelector items={SavingThrowList(character, conditions)}>
                  <div>
                    <h4>Saving Throws </h4> 
                    <p>
                      {
                        this.buildSavingThrows()
                      }
                    </p>
                  </div>
                </RunnerSelector>
                <RunnerSelector items={SkillSearch(character, conditions)}>
                  <div>
                    <h4>Skills </h4> 
                    <p>
                      {
                        this.buildSkills()
                      }
                      {skillModDisplay(conditions)}
                    </p>
                  </div>
                </RunnerSelector>
                {
                  hasTempOrOther(character.damage_resistances, character.damage_resistances_temp) ?
                  <div className="property-line">
                    <div>
                      <h4>Damage Resistances </h4> 
                      <p>{this.buildDamageReistances()}</p>
                    </div>
                  </div>
                  :
                  null
                }
                {
                  character.condition_immunities.length > 0 ? 
                  <div className="property-line">
                    <div>
                      <h4>Condition Immunities </h4> 
                      <p>{this.buildConditionImunities()}</p>
                    </div>
                  </div>
                  : null
                }
                {
                  character.damage_vulnerabilities.length > 0? 
                  <div className="property-line">
                    <div>
                      <h4>Damage Vulnerabilities </h4> 
                      <p>{this.buildDamageVulnerabilities()}</p>
                    </div>
                  </div>
                  : null
                }
                {
                  hasTempOrOther(character.damage_immunities, character.damage_immunities_tmp) ? 
                  <div className="property-line">
                    <div>
                      <h4>Damage Immunities </h4> 
                      <p>{this.buildDamageImunities()}</p>
                    </div>
                  </div>
                  : null
                }
                <div className="property-line">
                  <div>
                    <h4>Senses </h4> 
                    <p>{senses}</p>
                  </div>
                </div>
                <div className="property-line">
                  <div>
                    <h4>Languages </h4> 
                    <p>{languages}{canNotSpeak(conditions) ? <>, (Can Not Speak)</> : null}</p>
                  </div>
                </div>
                <div id="challenge-rating-line" className="property-line">
                  <h4>Challenge </h4>
                  <p id="challenge-rating">{cr} ({xp} XP)</p>
                </div>
              </div>
            </div>
            {seperator}
            <div id="properties-list">
              {
                this.buildTraits()
              }
            </div>
            
            <ConditionListing conditions={conditions}/>
          </div>
          <div className="section-right">
            {actions}
          </div>
          <hr className="orange-border bottom"/>
        </div>
      </div>
      <Box sx={{height: "35px"}}>
        <ButtonGroup sx={{float: "right"}}>
          <Button onClick={md}>
            {
              mdOpen ?
                "Hide Mark Down"
              :
                "View Mark Down"
            } 
          </Button>
          <Button onClick={png}>To Image</Button>
          <Button onClick={print}>Print</Button>
          {this.props.upload ? 
            <Button onClick={this.props.upload}>Upload</Button>
            : null
          }
          <Button onClick={()=> this.setState({blockEditing: !blockEditing})}>Edit</Button>
        </ButtonGroup>
      </Box>
      <Box className="fullWidth">
        <Markdown character={character} open={mdOpen} onClose={() => this.setState({mdOpen: false})}/>
      </Box>
      <Collapse in={blockEditing} className="fullWidth">
        <BlockEditor character={character} openEditor={this.openEditor} update={() => this.setState({})}/>
      </Collapse>
      <TakeDamageDialog character={character} open={this.openDamageDialog} setCharacter={() => this.setState({})}/>
      <Dialog open={edititingTrait !== undefined} fullScreen TransitionComponent={SlideUp}>
        <Editor script={edititingTrait?.script} description={edititingTrait?.description} save={(data: MacroEditorData) =>{
            if (edititingTrait) {
            edititingTrait.script = data;
            this.setState({edititingTrait: undefined})
          }
        }} close={() => this.setState({edititingTrait: undefined})} character={character} conditions={conditions}/>
      </Dialog>
    </>
  }
}
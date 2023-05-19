import { Card, CardContent, Collapse } from "@mui/material";
import TextWraper from "../TextWraper";
import { AttributeToMod } from "../Utils";
import { baseLairDescription, baseLairDescriptionEnd, baseLegendaryDescripton, baseMythicDescription, baseRegionalDescription, baseRegionalDescriptionEnd, or } from "./BlockEditor";
import Character, { Trait } from "./Character";
import StatsSheet from "./MonsterStatBlock";
import { JSXToList, toList } from "./Utility/ConditionsListing";

interface Props {
  character: Character;
}

interface PropsMD extends Props {
  open: boolean;
  onClose: VoidFunction;
}

export default function Markdown(props: PropsMD) {
  const { open, ...other } = props;

  return <Collapse 
    in={open}
    timeout={{
      enter: 1000,
      exit:  1000,
    }}
  >
    <Card className="fullWidth" sx={{
      mt: 2
    }}>
      <CardContent>
        <HomebreweryV3StatBlock {...other}/>
      </CardContent>
    </Card>
  </Collapse>
}

function HomebreweryV3StatBlock(props: Props) {
  const { character } = props;

  const saves = Object.entries(character.saving_throws);

  return <TextWraper>
    <h2>
      Homebrewery V3
    </h2>
    &#123;&#123;monster,frame,wide <br/>
    ## Monster <br/>
    *{character.size} {character.type}, {character.alignment}* <br/>
    ___<br/>
    **Armor Class** :: {character.Armor_Class}<br/>
    **Hit Points** :: {character.hp} ({character.hp_gen}) <br/>
    **Speed** :: {character.speed}<br/>
    ___<br/>
    |STR|DEX|CON|INT|WIS|CHA|<br/>
    |:---:|:---:|:---:|:---:|:---:|:---:|<br/>
    |{character.str}&nbsp;({AttributeToMod(character.str)})
    |{character.dex}&nbsp;({AttributeToMod(character.dex)})
    |{character.con}&nbsp;({AttributeToMod(character.con)})
    |{character.int}&nbsp;({AttributeToMod(character.int)})
    |{character.wis}&nbsp;({AttributeToMod(character.wis)})
    |{character.cha}&nbsp;({AttributeToMod(character.cha)})|<br/>
    ___<br/>
    {
      saves.length > 0 ?
      <>
        **Saving Throws** :: {StatsSheet.buildStrNumRecord(saves)}<br/>
      </>
      : 
      null
    }
    **Skills** :: {StatsSheet.subBuildSkills(character)}<br/>
    {
      character.damage_vulnerabilities.length > 0 ? 
      <>
        **Damage Vulnerabilities** :: {toList(character.damage_vulnerabilities)}<br/>
      </>
      :
      null
    }
    {
      character.damage_resistances.length > 0 ?
      <>
        **Damage Resistances** :: {toList(character.damage_resistances)}<br/>
      </>
      :
      null
    }
    {
      character.damage_immunities.length > 0 ?
      <>
        **Damage Immunities** :: {toList(character.damage_immunities)} <br/>
      </>
      :
      null
    }
    {
      character.condition_immunities.length > 0 ?
      <>
        **Condition Immunities** :: {toList(character.condition_immunities)} <br/>
      </>
      :
      null
    }
    **Senses** :: {character.senses ? character.senses : "-"}<br/>
    **Languages** :: {character.languages}<br/>
    **Challenge** :: {character.cr}&nbsp;({character.xp} XP)<br/>
    ___<br/>
    {
      character.traits.map(renderTrait)
    }
    {
      character.actions.length > 0 ? 
        <>
          ### Actions<br/>
          {
            actionList(character.actions)
          }
        </>
      :
      null
    }
    {
      character.legendary_actions.length > 0 ? 
      <>
        ### Legendary Actions<br/>
        {
          or(character.legendary_description, baseLegendaryDescripton)
        }
        <br/>:<br/>
        {
          actionList(character.legendary_actions)
        }
      </>
      :
      null
    }
    {
      character.mythic_actions.length > 0 ?
      <>
        ### Mythic Actions<br/>
        {
          or(character.mythic_description, baseMythicDescription)
        }
        <br/>:<br/>
        {
          actionList(character.mythic_actions)
        }
      </>
      :
      null
    }
    {
      character.lair_actions.length > 0 ? 
      <>
        ### Lair Actions<br/>
        {
          or(character.lair_description, baseLairDescription)
        }
        <br/>:<br/>
        {
          actionList(character.lair_actions)
        }
        :<br/>
        {
          or(character.lair_description_end, baseLairDescriptionEnd)
        }
        <br/>
      </>
      :
      null
    }
    {
      character.regional_actions.length > 0 ?
      <>
        ### Regional Effects<br/>
        {
          or(character.regional_description, baseRegionalDescription)
        }
        <br/>:<br/>
        {
          actionList(character.regional_actions)
        }
        :<br/>
        {
          or(character.regional_description_end, baseRegionalDescriptionEnd)
        }
        <br/>
      </>
      :
      null
    }
    &#125;&#125;
  </TextWraper>
}

const renderTrait = (trait: Trait) => {
  return <>
    ***{trait.name}*** {trait.description} <br/>
  </>
}

function actionList(l: Trait[]) {
  return JSXToList(
    l.map(renderTrait),
    <>
      :
      <br/>
    </>
  )
}
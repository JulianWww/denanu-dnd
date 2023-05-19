import * as React from "react";
import { ConditionData  } from "../Conditions";
import { Tooltip, ClickAwayListener, Button } from "@mui/material";
import { Icon } from "semantic-ui-react";
import { toTime } from "../data/Time";

export const conditions_descriptions: Record<string, (lvl: number) => [string[], JSX.Element | null]> = {
  "Blinded": (lvl: number) => [["Automatic failure on sight-based checks", "You have disadvantage on Attack rolls", "Attack rolls against you have advantage"], <>A blinded creature automatically fails checks that would require sight (makes sense) and has disadvantage on attack rolls, while enemy attack rolls against you have advantage.<br/><br/>Note that you can still make those attacks! Blinded doesn't suddenly mean you're useless and can't target your enemies, you can still hear the enemy as they dodge and weave, and possibly smell them depending on their hygiene. So, go ahead and make your attacks and make strategic plays, the blinded condition cripples you, but doesn't pull you out of the fight.</>],
  "Charmed": (lvl: number) => [["You cannot target the creature that charmed you with attacks or harmful effects.", "The creature that charmed you has advantage on social interactions with you (Charisma based checks)."], <>A charmed creature can't attack or target the creature that charmed them with harmful stuff, and they get advantage on their social interactions with you.<br/><br/>Note that charming isn't mind control, you're not suddenly an idiot, and you don't have to do what they say. Some people try to use charm like a mind-control ray, and it simply isn't. Charm is great for any kind of roleplay situation where you need somebody to do something for you. In combat, charm is basically a "no touch shield" that can get a caster out of a tough spot by diverting a threat away from them. Remember though, if you charm a creature, your allies aren't charming them, and the creature can wail on them to its heart's content. It's also important to note that harmful abilities frequently end the effect. </>],
  "Frightened": (lvl: number) => [["You cannot willingly move closer to the source of your fear", "You have disadvantage on Attack rolls while you can see the source of your fear", "You have disadvantage on Ability checks while you can see the source of your fear"], <>A frightened creature can't choose to go any closer to the creature that frightened them. And they have disadvantage on all your Ability Checks and Attack rolls while you can see it.<br/><br/>You get a good case of the spooks and you're not going to be much use until you shake it off. Most fear effects will give you another chance to end the condition when you end your turn out of either line of sight or a set distance from the source of your fear. So, there are some situations where you can just duck around a corner for a breather, get yourself together, then come around swinging on the next turn.<br/><br/>Also, note that the penalties don't do anything to stop you blasting away with spells that don't use an attack roll. If you're a caster and get spooked, often the best option is to hurl a fireball at it. Fear is great on a monster, and there's a reason why wise dragon, or powerful undead are given this effect. Also, in a dungeon, or similar restricted terrain, it can be useful to move creatures or "pin" them in interesting ways. Spells or magical effects (like conquest paladin aura + fear) that does this can be extremely, extremely useful in group fights. </>],
  "Grappled": (lvl: number) => [["Your speed is reduced to 0 and cannot be increased"], <>A grappled creature's speed is reduced to 0, and you can't use anything cheeky to improve it.<br/><br/>If whatever grappled you get the incapacitated (more on that later) or, for sake of argument dies , you're not grappled anymore.<br/><br/>Or, if something moves whatever was grappling you away ( thunderwave , shove attacks and similar) you'll also get freed.<br/><br/>A ton of systems and editions make grappling extremely complicated, 5e does a really good job of simplifying all that but there is a "technique" to grappling that's basically obligatory and not terribly obvious.<br/><br/>Grappling in 5e doesn't have a built-in pinning mechanic (unless you grab the grappler feat) but you can still "pin" pretty effectively anyway. It's all about the Shove Attack, while you're grappling another creature, you can still replace one of your attacks to try and shove your opponent prone (and thus gain all the advantages of fighting a prone enemy). And since their movement is reduced to 0 by the grapple, they can't get up until the grapple ends. In this way, a grappled creature has multiple effects, restrained, most likely prone, and grappled.<br/><br/>This goes the other way as well, if you find yourself grappled, often the best answer is to try and shove the grappler away. If you manage to shove, they get pushed back, which automatically breaks the grapple. And since a shove only uses one of your attacks, you'll still get to smash away with the rest if the shove doesn't land. The grappling rule and all the details can be found in our grappling article here. </>],
  "Incapacitated": (lvl: number) => [["You cannot take actions, bonus actions, or reactions"], <>An incapacitated creature can't take actions (that includes bonus action), or reactions.<br/><br/>If you're incapacitated, you're NOT having a good time. You're largely useless, you can't cast spells, etc, BUT you can still move and try to get out of whatever terrible situation you've found yourself in. However, practically all of the effects that incapacitate you also stop you from moving, so keep on the lookout and just double check when you're incapacitated if you can actually run away.</>],
  "Invisible": (lvl: number) => [["You cannot be seen except by special means", "You count as heavily obscured for the purposes of hiding", "You make Attack rolls at advantage", "Attack rolls made against you have disadvantage"], <>Being an invisible creature cool, because is nobody can see you! For hiding, you count as heavily obscured. Attacks against you have disadvantage, while your attacks have advantage.<br/><br/>Invisibility is the one that gets confused the most, mainly due to what "heavily obscured" actually means and confusion about how "hiding" works in 5e.<br/><br/>If you're invisible, you can always choose to take the Hide Action to start hiding. Normally if somebody can see you hiding isn't an option. With invisibility, you can try and hide while standing right in front of them.<br/><br/>What "heavily obscured" does, is it treats your would-be observers as if they had the blinded condition when they try to spot you.<br/><br/>So, when we put that all together, here's what being invisible actually does:<br/><br/>If you're sneaking past people: You can attempt to sneak past people while in their direct line of sight, which normally fails pretty darn quickly. Fundamentally, being invisible is not really any different for sneaking than if you just had convenient cover that blocked line of sight to the guards.<br/><br/>If you're in combat: You can use the hide action to try and hide while in direct line of sight, which is normally impossible. All your attacks get advantage, and attacks against you have disadvantage. Note that your enemies can STILL ATTACK you even if you're invisible, they just do so at disadvantage. If you're goal is to lose them, you'll need to use the hide action and hope that they can't roll a high enough Wisdom (Perception) check to spot you again.</>],
  "Paralyzed": (lvl: number) => [["You’re incapacitated (see incapacitated)", "You cannot move", "You cannot speak", "You automatically fail Strength and Dexterity saving throws", "Attack rolls against you have advantage", "Attacks against you automatically result in critical hits if the attacker is within 5 feet of you."], <>A paralyzed creature is incapacitated (so you can't take any actions) and you can't move or speak. You automatically fail Strength and Dexterity saving throws, attack rolls against you have advantage and they are an AUTOMATIC CRITICAL HIT if the attacker is within 5 feet of you.<br/><br/>Paralyzed is a lot worse than stunned but not quite as bad as petrified. Think of paralyzed as not only "skip a turn" but you're also extremely vulnerable during it. Once you're paralyzed there's really nothing you can do but hope you don't get all your hit points beat out of you while you're down. This is why any magic item that prevents this condition is great. A ring of free action can be worth it's weight in platinum. </>],
  "Petrified": (lvl: number) => [["You physically turn to stone, and your weight is multiplied by 10", "You’re incapacitated (see incapacitated)", "You cannot move", "You cannot speak", "You automatically fail Strength and Dexterity saving throws", "Attack rolls against you have advantage", "You do not age while petrified", "You have resistance to all damage", "You are immune to poisons and diseases"], <>A petrified creature is turned to stone, it's weight gets multiplied by 10 and it essentially isn't alive for a while. If it's you, you're incapacitated (so you can't take actions), you can't move or talk, and you're not even aware of your surroundings. Attacks against you have advantage, and you automatically fail any Strength or Dexterity saves.<br/><br/>You do get a couple perks from being a statue though, you have resistance to all damage and you're immune to poisons and diseases.<br/><br/>Getting petrified usually means you're out of action for the rest of a combat, or potentially quite a bit longer if you're low level as the rest of the party spends a mini adventure to find a cure for you. You've become a solid inanimate substance Getting petrified is ROUGH, but the abilities that inflict it usually give you multiple chances to save out of it.</>],
  "Poisoned": (lvl: number) => [["You have disadvantage on Attack rolls", "You have disadvantage on Ability checks"], <>You've got disadvantage on your Attack rolls and your Ability checks.<br/><br/>Poisoning is pretty simple, you've caught some nasty funk and now you're terrible at everything for a while. Many martial classes get extra resistances or even immunities to this, and if you're a caster you can just focus on spells that use saving throws instead of attacks and bypass the problem entirely.</>],
  "Prone": (lvl: number) => [["Your movement requires 1 additional foot of movement speed for each foot of movement (essentially half speed)", "You can spend half of your movement speed to stand up and end this condition", "Creatures within 5 feet of you have advantage on their Attack rolls against you", "Creatures more than 5 feet from you have disadvantage on their Attack rolls against you"], <>Your only movement option is crawling (half speed) but you can end the condition by spending half of your movement to stand up. While you're prone attacks against you have advantage if they're standing right next to you, and they have disadvantage if they're shooting from range.<br/><br/>The prone condition is pretty straightforward, you don't want to be prone. If you're prone just pay the movement tax at the start of your turn and stand up.<br/><br/>If you're getting sniped though, it might be a good idea to drop prone and make yourself more difficult to shoot.</>],
  "Restrained": (lvl: number) => [["Your speed is reduced to 0 and cannot be increased", "You have disadvantage on Attack rolls", "Attack rolls against you have advantage", "You have disadvantage on Dexterity saving throws"], <>Your movement is dropped to 0 and can't get cheekily improved, any creature's attack rolls against you have advantage, your attacks have disadvantage, and you've got disadvantage on any Dexterity saving throw.<br/><br/>The restrained 5e condition is a sort of twin that often comes alongside incapacitated, where the restrained condition stops you from moving and incapacitated stops you from doing anything else. If you find yourself a "restrained creature" but not incapacitated, you've essentially got all your actions available to you to try and get out of your restraints. Quite a few spells will get you out, as will a handy hidden knife or just a good Strength (Athletics) check for ropes, limb restraints (common with bounty hunters) or a good Dexterity (Sleight of Hand) check for locks. Other Frequently this condition occurs when you have a grappled creature. Check the grappled condition, and grapple check above for more details. There is some question whether or not a thunderwave spell would remove your restraints, but frankly, based on the way we read it, most likely it'll be up to your Dungeon Master.</>],
  "Stunned": (lvl: number) => [["You’re incapacitated (see incapacitated)", "You cannot move", "You cannot speak", "You automatically fail Strength and Dexterity saving throws", "Attack rolls against you have advantage"],  <>You're incapacitated (can't take actions), can't move, and can't say anything more than cartoony gibberish. You automatically fail Strength and Dexterity saves, and Attack rolls against you have advantage.<br/><br/>Out of the 3 "miss a turn" abilities, stunned is the one that hurts the least. Stunned is usually only for a turn, and it's fundamentally just "you skip your next turn" most of the time. Be wary of getting piled on though, as one of the nastiest tactics is to stun and then gang up on the stunned character once they can't defend themselves.</>],
  "Unconscious": (lvl: number) => [["You’re incapacitated (see incapacitated)", "You cannot move", "You cannot speak", "You automatically fail Strength and Dexterity saving throws", "Attack rolls against you have advantage", "Attacks against you automatically result in critical hits if the attacker is within 5 feet of you.", "You are unaware of your surroundings", "You fall prone (see prone)", "You drop any items you were holding"], <>An unconscious creature is incapacitated, as well as (can't take actions), can't move or speak, and you're unaware of your surroundings. You fall prone, and if you were holding something you drop it. You automatically fail Strength and Dexterity saves, Attack rolls against you have advantage, and they AUTOMATICALLY CRIT if they're standing right next to you.<br/><br/>Unless the sleep spell is getting thrown around, most of the time unconsciousness is going to come up when somebody gets dropped to 0. If you're on death saving throws, you've got other things to worry about, but unconsciousness in general is going to get you killed if you can't get woken up.</>],
  "Exhausted": (lvl: number) => {
    var list: string[] = [];
    switch(lvl) {
      case 1: list = ["Disadvantage on Ability Checks"]; break;
      case 2: list = ["Disadvantage on Ability Checks", "Speed halved"]; break;
      case 3: list = ["Disadvantage on Ability Checks, Attack rolls and Saving Throws", "Speed halved"]; break;
      case 4: list = ["Disadvantage on Ability Checks, Attack rolls and Saving Throws", "Speed and Hp maximum halved"]; break;
      case 5: list = ["Disadvantage on Ability Checks, Attack rolls and Saving Throws", "Hp maximum halved", "Speed 0"]; break;
      default: list = ["Death", "Disadvantage on Ability Checks, Attack rolls and Saving Throws", "Hp maximum halved", "Speed 0"]; break;
    }
    return [list, null]
  }
}


interface Props {
  condition: number;
  name: string;
  conditionsStacks: ConditionData[];
  remove: (cond: string, idx: number) => void;
}

interface State {
  details_open: boolean;
  hover: boolean;
}

function ConditionDetails(props: Props) {
  const {condition, name, conditionsStacks} = props;
  const [list, desc] = conditions_descriptions[name](condition);
  return <div className="cond-description-wraper">
      <h3>{name}</h3>
      <ul className="cond-description-list">
        {
          list.map((val: string) => <li>{val}</li>)
        }
      </ul>
      {desc}
      <h5>Last until</h5>
      <table className="fixed">
        <tbody>
          {conditionsStacks.map((val: ConditionData, idx: number) => {
            return <tr>
              <td>
                {val.level} Level
              </td>
              <td>
                Expires after: {toTime(val.duration, val.duration_type)}
              </td>
              <td style={{textAlign: "right"}}>
                <div onClick={() => props.remove(name, idx)}>
                  <Icon name="remove"/>
                </div>
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
}

export default class ConditionDataDisplay extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      details_open: false,
      hover: false
    }
  }

  render(){
    const {condition, name} = this.props;
    const { details_open, hover } = this.state;

    const child = <div className="dnd-condIcon-inner" onClick={() => {
      this.setState({details_open: true});
    }}>
        <img src={"/dndimages/conditions/" + name + ".png"}/>
        {condition > 1 ?
          <div className="level">
            {condition}
          </div>
          : null
        }
      </div>
    
    const tooltip = details_open ? 
      <Tooltip title={<ConditionDetails {...this.props}/>} arrow open={true} disableFocusListener disableHoverListener disableTouchListener>{child}</Tooltip>
      :
      <Tooltip title={name} open={hover} arrow>{child}</Tooltip>

    return <ClickAwayListener open={details_open} onClickAway={() => this.setState({details_open: false})}>
      <div className="dnd-condIcon" onMouseOver={()=>this.setState({hover: true})} onMouseLeave={()=>this.setState({hover: false})}>
        {tooltip}
      </div>
    </ClickAwayListener>;
  }
}
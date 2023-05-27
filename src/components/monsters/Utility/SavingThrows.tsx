import { Rolls, getRollType, rollTypedDice } from "../../visualEditor/Engine/Utils";
import { attributes, getAttribute } from "../Attributes";
import Character from '../Character';
import { SaveToast, SaveToastAutoFail } from "../../visualEditor/Engine/Toasts";
import {toMod} from "./Utils";
import {CanSucceedSaves, hasSaveDisadvantage} from "../Conditions";
import RunnTypeSelector, {RunApi} from "./RunnTypeSelector";
import CustomRef from "../../../Utils/CustomRef";

interface Props {
  attribute: string,
  r: CustomRef<RunApi>;
  character: Character,
  conditions: [string, number, string[]][]
}

function SavingThrowSearchListElement(props: Props) {
  const {attribute, character, conditions, r} = props;
  return <RunnTypeSelector r={r} run={(roll: Rolls) => {
      if (CanSucceedSaves(conditions, attribute)) {
        var mod = toMod(getAttribute(character, attribute))
        if (character.saving_throws[attribute]) {
          mod = character.saving_throws[attribute]
        }
        console.log(roll)
        SaveToast(attribute, rollTypedDice(20, 1, mod, roll), mod);
      }
      else {
        SaveToastAutoFail(attribute);
      }
    }}
    rollType={getRollType(false, hasSaveDisadvantage(conditions, attribute))}
  >
    {attribute}
  </RunnTypeSelector>
}

const SavingThrowList = (character: Character, conditions: [string, number, string[]][]) => Object.keys(attributes).map(
  (val: string) => {
    const ref = new CustomRef<RunApi>();
    const e = <SavingThrowSearchListElement attribute={val} character={character} conditions={conditions} r={ref}/>;
    return [e, ref] as [JSX.Element, CustomRef<RunApi>]
  }
)

export default SavingThrowList;
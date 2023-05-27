import { hasCondition } from "../Conditions";

interface Props {
  conditions: [string, number, string[]][]
}

export function toList(arr?: string[], seperator?: string) {
  if (arr === undefined) {
    return null;
  }
  return arr.map((val: string, idx: number, arr: string[]) => {
    if (idx === arr.length-1) {
      return val
    }
    return val + (seperator ? seperator + " " : ", ");
  })
}

export function JSXToList(arr: JSX.Element[], seperator?: JSX.Element) {
  return arr.map((val: JSX.Element, idx: number, arr: JSX.Element[]) => {
    if (idx === arr.length-1) {
      return <span key={idx}>{val}</span>
    }
    return <span key={idx}>{val}{seperator ? seperator : ", "}</span>;
  })
}

export default function ConditionListing(props: Props) {
  const {conditions} = props;
  const effects: JSX.Element[] = [];

  if (hasCondition(conditions, [["Blinded", 1]])) {
    effects.push(<span>Fails all sight based checks</span>);
  }

  var cond = hasCondition(conditions, [["Charmed", 1]]);
  if (cond) {
    effects.push(<span>can <b>not</b> harm and have social check advantage: {toList(cond[2])}</span>);
  }

  cond = hasCondition(conditions, [["Frightened", 1]]);
  if (cond) {
    effects.push(<span>can <b>not</b> move closer to: {toList(cond[2])}</span>);
  }

  cond = hasCondition(conditions, [["Invisible", 1]]);
  if (cond) {
    effects.push(<span>You cannot be seen except by special means</span>);
    effects.push(<span>You count as heavily obscured for the purposes of hiding</span>);
  }

  cond = hasCondition(conditions, [["Paralyzed", 1]]);
  if (cond) {
    effects.push(<span>Attacks Aginst this target are Automatically crits if the attacker is within 5ft.</span>);
  }

  cond = hasCondition(conditions, [["Petrified", 1]]);
  if (cond) {
    effects.push(<span>Is Made out of stone and Mass is multiplied by 10</span>);
    effects.push(<span>Does not age due to Petrification</span>)
    effects.push(<span>Imunte to Diseases</span>)
  }

  cond = hasCondition(conditions, [["Prone", 1]]);
  if (cond) {
    effects.push(<span><strong><b>Get Up </b></strong>You can spend Half your Movement Speed to stand up and end the Prone Condition</span>);
  }

  cond = hasCondition(conditions, [["Unconscious", 1]]);
  if (cond) {
    effects.push(<span>Is unaware of its seroundings</span>);
    effects.push(<span>Is Prone and drops all Items</span>)
  }

  if (effects.length > 0) {
    return <div className="actions">
      <h3>Condition Modifications</h3>
      <div id="properties-list">
        {effects.map((val: JSX.Element) => 
          <div className="property-line">
            {val}
          </div>
        )}
      </div>
    </div>
  }
  return null;
}
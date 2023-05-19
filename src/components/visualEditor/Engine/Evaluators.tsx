import { Engine } from "./Engine";
import { ScriptNode } from "./Builder";
import { range } from "../Nodes/Utils";

function operationsEvaluation<T>(operation: (a: T, b: T) => T, defaultProvider: (idx: number) => T) {
  return (node: ScriptNode, engine: Engine) => {
    const inputs = (node.internalData?.inputs | 2) as number;
    var val = engine.getVariable<T>(node, "1", defaultProvider(0));
    for (const idx of range(2, inputs)) {
      const val2 = engine.getVariable<T>(node, idx.toString(), defaultProvider(1));
      val = operation(val, val2);
    }
    return val;
  }
}

function comparisonEvaluation<T>(operation: (a: T, b: T) => boolean, defaultProvider: (idx: number) => T) {
  return (node: ScriptNode, engine: Engine) => {
    var val = engine.getVariable<T>(node, "1", defaultProvider(0));
    var other = engine.getVariable<T>(node, "2", defaultProvider(1));
    return operation(val, other);
  }
}

function constantEvaluation<T>(d: T) {
  return (node: ScriptNode, engine: Engine) => {
    return node.internalData === undefined || node.internalData.value === undefined ? d : node.internalData.value;
  };
}

const evaluators: Record<string, (node: ScriptNode, engine: Engine)=>any> = {
  add:          operationsEvaluation((a: number, b: number) => a+b, (_: number) => 0),
  subtract:     operationsEvaluation((a: number, b: number) => a-b, (_: number) => 0),
  mul:          operationsEvaluation((a: number, b: number) => a*b, (_: number) => 1),
  divide:       operationsEvaluation((a: number, b: number) => a/b, (_: number) => 1),
  power:        operationsEvaluation((a: number, b: number) => a**b, (idx: number) => idx === 0 ? Math.E : 1),
  root:         operationsEvaluation((a: number, b: number) => a**(1/b), (idx: number) => idx === 0 ? 1 : 2),
  log:          operationsEvaluation((a: number, b: number) => Math.log(a) / Math.log(b), (_: number) => Math.E),
  and:          operationsEvaluation((a: boolean, b: boolean) => a && b, (idx: number) => true),
  or:           operationsEvaluation((a: boolean, b: boolean) => a || b, (idx: number) => false),
  xor:          operationsEvaluation((a: boolean, b: boolean) => a ? !b : b, (idx: number) => false),
  not:          (node: ScriptNode, engine: Engine) => {return !engine.getVariable<boolean>(node, "1", false);},
  concatenate:  operationsEvaluation((a: string, b: string) => a + b, (idx: number) => ""),
  greater:      comparisonEvaluation((a: number, b: number) => a > b, (idx: number)=> 0),
  equals:       comparisonEvaluation((a?: number, b?:number) => a === b, (idx: number) => undefined),

  number:       constantEvaluation(0),
  boolean:      constantEvaluation(false),
  string:       constantEvaluation(""),
}


export default evaluators;
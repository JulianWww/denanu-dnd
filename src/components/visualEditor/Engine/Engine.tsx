import { Script, ScriptNode, nodeValueData } from "./Builder";
import { printAlert, AttackRoll, DamageToast, TargetSaveToast } from "./Toasts";
import { rollDice, rollAdvantageDisadvantageDice } from "./Utils";
import evaluators from "./Evaluators";
import Character from "../../monsters/Character";
import {hasAttackDisadvantage, hasAttackAdvantage} from "../../monsters/Conditions";


export const nodeRunners: Record<string, (node: ScriptNode, engine: Engine) => void> = {
  init:  (node: ScriptNode, engine: Engine) => {
    engine.exec(node, "main")
  },
  print: (node: ScriptNode, engine: Engine) => {
    const txt  = engine.getVariable<any>(node, "txt", node.internalData?.txt);
    if (txt !== undefined) {
      printAlert(txt.toString());
    }
    engine.exec(node, "main")
  },
  attack: (node: ScriptNode, engine: Engine) => {
    const crit = () => {
      engine.setVariable(node, "crit", true);
      engine.exec(node, "crit");
    }
    const hit  = () => {
      engine.setVariable(node, "crit", false);
      engine.exec(node, "main");
    }

    const mod   = engine.getVariable<number>(node, "mod", node.internalData?.mod as number);
    AttackRoll(rollAdvantageDisadvantageDice(20, 1, mod, hasAttackAdvantage(engine.conditions), hasAttackDisadvantage(engine.conditions)), crit, hit);
    
  },
  applyDamage: (node: ScriptNode, engine: Engine) => {
    const crit  = engine.getVariable<boolean>(node, "crit", false);
    const half  = engine.getVariable<boolean>(node, "half", false);
    const faces = engine.getVariable<number>(node, "faces", node.internalData?.faces as number);
    const dice  = engine.getVariable<number>(node, "dice", node.internalData?.dice as number);
    const mod   = engine.getVariable<number>(node, "mod", node.internalData?.mod as number);
    const type  = engine.getVariable<string>(node, "type", node.internalData?.type as string);

    var damage = rollDice(faces, crit ? dice * 2 : dice, mod);
    if (half) {
      console.log("half")
      damage = Math.floor(damage / 2);
    }
    DamageToast(damage, type);
    engine.setVariable(node, "damage", damage);
    engine.exec(node, "main");
  },
  stdattack: (node: ScriptNode, engine: Engine) => {
    const faces     = engine.getVariable<number>(node, "faces", node.internalData?.faces || 6 as number);
    const dice      = engine.getVariable<number>(node, "dice", node.internalData?.dice || 1 as number);
    const mod       = engine.getVariable<number>(node, "mod", node.internalData?.mod || 1 as number);
    const type      = engine.getVariable<string>(node, "type", node.internalData?.type as string);
    const attackmod = engine.getVariable<number>(node, "attackmod", node.internalData?.attackmod || 0 as number);

    function rollDamage(crit: boolean) {
      const damage = rollDice(faces, crit ? dice * 2 : dice, mod);
      DamageToast(damage, type);
    }

    const crit = () => {
      rollDamage(true);
      engine.exec(node, "main");
    }
    const hit  = () => {
      rollDamage(false);
      engine.exec(node, "main");
    }

    AttackRoll(rollAdvantageDisadvantageDice(20, 1, attackmod, hasAttackAdvantage(engine.conditions), hasAttackDisadvantage(engine.conditions)), crit, hit);
    
  },
  savingthrowtarget: (node: ScriptNode, engine: Engine) => {
    const dc     = engine.getVariable<number>(node, "dc", node.internalData?.dc || 10 as number);
    const type   = engine.getVariable<string>(node, "type", node.internalData?.type || "any" as string);

    const success = () => {
      engine.setVariable(node, "success", true);
      engine.exec(node, "succed");
    }
    const fail  = () => {
      engine.setVariable(node, "success", false);
      engine.exec(node, "fail");
    }
    TargetSaveToast(dc, type, success, fail);
  },
  rolldice: (node: ScriptNode, engine: Engine) => {
    const faces = engine.getVariable<number>(node, "faces", node.internalData?.faces | 6 as number);
    const dice  = engine.getVariable<number>(node, "dice", node.internalData?.dice | 1 as number);
    const mod   = engine.getVariable<number>(node, "mod", node.internalData?.mod | 0 as number);

    const val = rollDice(faces, dice, mod);
    console.log(val, faces, dice, mod, "val");
    engine.setVariable(node, "roll", val);
    engine.exec(node, "main")
  }
}

export class Engine {
  script?: Script;
  variables: Record<string, any> = {};
  character: Character;
  conditions: [string, number, string[]][];

  constructor(character: Character, conditions: [string, number, string[]][]) {
    this.character = character;
    this.conditions = conditions;
  }

  run(script: Script) {
    this.variables = {};
    this.script = script;
    console.clear();
    console.log(script);
    const root = this.getNode(script, script.start);
    this.runNode(root);
  }

  getNode = (script: Script, id: string) => {
    return script.nodes[id];
  }

  runNode = (node: ScriptNode) => {
    const runner = nodeRunners[node.type];
    runner(node, this);
  }

  exec = (node: ScriptNode, next: string) => {
    if (this.script) {
      const nextId = node.output[next];
      if (nextId) {
        const n = this.getNode(this.script, nextId.nodeId);
        this.runNode(n);
      }
    }
  }

  setVariable = (node: ScriptNode, name: string, value: any) => {
    this.variables[node.id + "-" + name] = value;
  }

  getVariable<T>(node: ScriptNode, name: string, val: T) {
    const key = node.input[name];
    if (key) {
      var value: T | undefined = (this.variables[key.nodeId + "-" + key.propertyId] as T);
      if (value !== undefined) {
        return value;
      }
      value = this.getVariableExecutionNode(node, key);
      if (value !== undefined) {
        return value;
      }
    }
    return val;
  }

  getVariableExecutionNode<T>(node: ScriptNode, key: nodeValueData) {
    if (this.script) {
      const n = this.getNode(this.script, key.nodeId);
      return evaluators[n.type](n, this) as T;
    }
  }
}

export function runScript(character: Character, conditions: [string, number, string[]][], script?: Script) {
  if (script) {
    const engine  = new Engine(character, conditions);
    engine.run(script);
  }
}
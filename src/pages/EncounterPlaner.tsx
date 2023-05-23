import * as React from "react";
import { Container } from "@mui/material";
import {IToken} from "../Login/UseToken";
import { Element } from "../components/SearchableList";
import MonsterSearchListElement, { loadMonsters } from "../components/monsters/MonsterSearchListElement";
import { MonsterIndex } from "./SelectMonserStatBlock";
import PartyData from "../components/encounters/PartyData";
import EncounterPlanerInterface from "../components/encounters/EncounterInterface";
import Inline from "../components/InlineDisplay";
import Encounter, { addMonster, EncounterDefault } from "../components/encounters/Encounter";
import SearchableMonsterList from "../components/MonserSearchableList";

interface Props extends IToken {
  encounter?: Encounter;
  fileName?: string;
  update?: (e: Encounter) => void;
}

interface State {
  monsters: Element[];
  encounter: Encounter;
}

export default function EncounterPlaner(props: Props) {
  return <Container>
    <EncounterPlanerModule {...props}/>
  </Container>
}

export class EncounterPlanerModule extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      monsters: [],
      encounter: props.encounter ? props.encounter : EncounterDefault(),
    }
  }

  updateFunc() {
    if (this.props.update) 
      this.props.update(this.state.encounter);
    else
      this.setState({});
  }

  addMonster = (monster: MonsterIndex) => {
    addMonster(this.state.encounter, monster);
    this.updateFunc();
  }

  componentDidMount(): void {
    this.load();
  }

  async load() {
    this.setState({monsters: await loadMonsters((val: MonsterIndex) => <MonsterSearchListElement {...val} onClick={()=> this.addMonster(val)}/>, this.props.token)})
  }
  
  render() {
    const { monsters, encounter } = this.state;

    return <>
      <ControllSection encounter={encounter} {...this.props}/>
      <SearchableMonsterList fluid elements={monsters} sx={{mt: 1}}/>
    </>
  }
}

interface ControllProps extends IToken{
  encounter: Encounter;
  fileName?: string;
}

export function ControllSection(props: ControllProps) {
  const { encounter } = props;

  const [_dummy, _update] = React.useState(0);

  const updateFunc = () => {
    _update(_dummy + 1);
  }

  return <Inline>
    <Inline.Item>
      <PartyData encounter={encounter} update={updateFunc}/>
    </Inline.Item>
    <Inline.Item sx={{ flexGrow: 1 }}>
      <EncounterPlanerInterface {...props} update={updateFunc}/>
    </Inline.Item>
  </Inline>
}
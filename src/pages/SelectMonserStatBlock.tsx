import * as React from 'react';
import {IToken, Token} from "../Login/UseToken";
import { Container, } from '@mui/material';
import { MonsterForwardingListElement, loadMonsters } from "../components/monsters/MonsterSearchListElement";
import {Element} from "../components/SearchableList";
import { Index, toUrl } from "../Login/ServerApi";
import Character, { default_Character } from '../components/monsters/Character';
import SearchableMonsterList from '../components/MonserSearchableList';
import { NewCustomItemCreator } from '../components/Utils';

interface Props {
  token?: Token;
  setToken: any;
}

export interface MonsterIndex extends Index {
  alignment: string,
	cr: number,
	name: string,
	size: string,
	type: string,
}

export function getMonsterIndex(char: Character) {
  return {
    alignment: char.alignment,
    cr: char.cr,
    name: char.name,
    size: char.size,
    type: char.type,
  }
}

interface State {
  monsters: Element[];
}

export default class StatBlockSelector extends React.Component<Props, State>{
  loading: boolean

  constructor(props: Props) {
    super(props)

    this.state = {
      monsters: [],
    }
    this.loading = false;
  }

  componentDidMount(): void {
    if (!this.loading)
      this.loadMonsters();
  }

  loadMonsters = async () => {
    this.setState({monsters: (await loadMonsters((val: MonsterIndex) => {
      return <MonsterForwardingListElement {...val} target={toUrl(val.idx)}/>
    }, this.props.token)
      )});
  }


  render() {
    return (
      <Container>
        <NewMonsterCreator {...this.props}/>
        <SearchableMonsterList fluid elements={this.state.monsters}/>

      </Container>
    );
  }
}

function NewMonsterCreator(props: IToken) {
  return <NewCustomItemCreator {...props} group="mobs" value={default_Character} idx={getMonsterIndex(default_Character)}/>
}
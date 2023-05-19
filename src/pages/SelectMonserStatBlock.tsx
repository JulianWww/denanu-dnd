import * as React from 'react';
import {IToken, Token} from "../Login/UseToken";
import { Container, Button, CircularProgress, Box } from '@mui/material';
import { MonsterForwardingListElement, loadMonsters } from "../components/monsters/MonsterSearchListElement";
import {Element} from "../components/SearchableList";
import { Index, randomFileName, writePrivateData } from "../Login/ServerApi";
import Character, { default_Character } from '../components/monsters/Character';
import { useNavigate } from 'react-router-dom';
import SearchableMonsterList from '../components/MonserSearchableList';
import RightAlign from '../components/RightAlign';
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
	type: string
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
  loading: boolean;
  monsters: Element[];
}

export default class StatBlockSelector extends React.Component<Props, State>{
  loading: boolean

  constructor(props: Props) {
    super(props)

    this.state = {
      loading: true,
      monsters: [],
    }
    this.loading = false;
  }

  componentDidMount(): void {
    if (this.state.loading && !this.loading)
      this.loadMonsters();
  }

  loadMonsters = async () => {
    this.setState({loading: false, monsters: (await loadMonsters((val: MonsterIndex) => <MonsterForwardingListElement {...val} target={val.file}/>, this.props.token))});
  }


  render() {
    return (
      <Container>
        {this.state.loading ? 
          <CircularProgress/> :
          <>
            <NewMonsterCreator {...this.props}/>
            <SearchableMonsterList fluid elements={this.state.monsters}/>
          </>
        }
      </Container>
    );
  }
}

function NewMonsterCreator(props: IToken) {
  return <NewCustomItemCreator {...props} group="mobs" value={default_Character} idx={getMonsterIndex(default_Character)}/>
}
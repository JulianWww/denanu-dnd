import * as React from 'react';
import MonsterStatBlock from "../components/monsters/MonsterStatBlock"
import {Loader, Dimmer} from "semantic-ui-react";
import {Token} from "../Login/UseToken";
import Character, { cleanCharacter } from "../components/monsters/Character";
import { useParams, Params } from 'react-router-dom';
import { getJson, backendUrl, readPrivateData, writePrivateData, loadCharacter } from "../Login/ServerApi";
import { Container, Theme, ThemeProvider, useTheme } from '@mui/material';
import { darkTheme } from '../App';
import { getMonsterIndex } from './SelectMonserStatBlock';
import MainMenu from '../components/MainMenu';

interface Props {
  token?: Token;
  setToken: any;
}

interface State {
  character?: Character;
}

class CharacterSheet extends React.PureComponent<Props & {params: Readonly<Params<string>>, theme: Theme;}, State> {
  loading: boolean;

  constructor(props: Props & {params: Readonly<Params<string>>, theme: Theme;}) {
    super(props);

    this.state = {};

    this.loading = false;
  }

  componentDidMount(): void {
    if (!this.state.character && !this.loading) {
      this.loading = true;
      this.loadStatBlock();
    }
  }

  async loadStatBlock() {
    const {token, params} = this.props;
    const {group, source, name} = params;
    const character = await loadCharacter(group, source, name, token);
    this.setState({character: character});
  }

  uploadCharacter = async () => {
    const {group, source, name} = this.props.params;
    const {token} = this.props;
    if (token && group && source && name && this.state.character) {
      writePrivateData(token, "mobs", source, name, cleanCharacter({...this.state.character}), getMonsterIndex(this.state.character), group);
    }
  }

  render() {
    // <Editor></Editor>
    return (<Container>
        {
          this.state.character !== undefined ? 
            <MonsterStatBlock {...this.props} character={this.state.character} upload={this.uploadCharacter}/>
          :
          <Loader/>
        }
      </Container>
    );
  }
} 

export default function StatBlock(props: Props) {
  return <CharacterSheet {...props} params={useParams()} theme={useTheme()}/>
}
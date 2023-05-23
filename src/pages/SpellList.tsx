import * as React from 'react';
import { IToken } from "../Login/UseToken";
import { Container, Collapse, Grid } from '@mui/material';
import { Element } from "../components/SearchableList";
import { LocationData } from "../Login/ServerApi";
import Character from '../components/monsters/Character';
import { SpellIndex, calcSpellIdx, defaultSpell } from '../components/spells/Spell';
import { SpellClickElement, loadSpells } from '../components/spells/SpellSearchListElement';
import SpellSearchableList from '../components/SpellSearchList';
import SpellRenderer from '../components/spells/SpellRenderer';
import { NewCustomItemCreator } from '../components/Utils';

export interface SpellElement extends Element, SpellIndex {
}

interface Props extends IToken {
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
  spells: Element[];
  spellLocation: LocationData;
  spellOpen: boolean;
}

export default class SpellList extends React.Component<Props, State>{
  loading: boolean

  constructor(props: Props) {
    super(props)

    this.state = {
      loading: true,
      spells: [],
      spellLocation: {
        group: "public",
        source: "spells",
        name: "0",
      },
      spellOpen: true,
    }
    this.loading = false;
  }

  componentDidMount(): void {
    if (this.state.loading && !this.loading)
      this.loadMonsters();
  }

  openSpellList = (val: LocationData) => {
    this.setState({
      spellLocation: val,
      spellOpen: true,
    });
  }

  loadMonsters = async () => {
    this.setState({loading: false, spells: (await loadSpells((val: SpellIndex) => <SpellClickElement {...val} onClick={()=> this.openSpellList(val.idx)}/>, this.props.token))});
  }


  render() {
    // <NewMonsterCreator token={this.props.token}/>
    const { spells, spellLocation, spellOpen } = this.state;

    return (
      <Container sx={{maxWidth: "3000px"}}>
        <NewSpellCreator {...this.props}/>
        <Grid container columns={2}>
          <Grid item xs={1}>
            <SpellSearchableList fluid elements={spells}/>
          </Grid>
          <Grid item xs={1}>
            <Collapse in={spellOpen}>
              <SpellRenderer {...this.props} location={spellLocation} open={true}/>
            </Collapse>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

function NewSpellCreator(props: IToken) {
  return <NewCustomItemCreator {...props} group="spells" value={defaultSpell()} idx={calcSpellIdx(defaultSpell())}/>
}
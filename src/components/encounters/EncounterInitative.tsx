import * as React from "react";
import { Card, CardContent, Divider, Grid, List, ListItem, ButtonGroup, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField } from "@mui/material";
import Encounter, { EncounterMonster } from "./Encounter";
import Character, { default_Character } from "../monsters/Character";
import { loadCharacter, parallel, randomNumber, writePrivateData } from "../../Login/ServerApi";
import { MonsterIndex, getMonsterIndex } from "../../pages/SelectMonserStatBlock";
import { IToken } from "../../Login/UseToken";
import { rollDice } from "../visualEditor/Engine/Utils";
import { toMod } from "../monsters/Utility/Utils";
import { range } from "../visualEditor/Nodes/Utils";
import StatsSheet from "../monsters/MonsterStatBlock";
import CustomRef from "../../Utils/CustomRef";
import { ConditionData } from "../monsters/Conditions";
import NumberInput from "../visualEditor/Nodes/Utility/NumberInput";
import { sortedIndex } from "../Utils";
import PlayerSheet, { PlayerData } from "../player/PlayerSheet";


interface Props extends IToken{
  encounter: Encounter
}

interface State {
  initativeOffset: number;
  addingPlayer: boolean;

  newPlayerName?: string;
  newPlayerInitative?: number;
}


interface MonsterData {
  mob?: MonsterIndex;
  player?: PlayerData;
  idx: number;
  init: number;
  conditionsRef: CustomRef<{record: Record<string, ConditionData[]>, idx: number}>;
}

const emptyInitativeList = <Card elevation={10}>
  <CardContent className="NoMonstersWrapper">
    <span style={{marginRight: "1em"}}>!</span>
    The Initaitve list is Empty
  </CardContent>
</Card>

function monsterComparator(a: MonsterData, b: MonsterData) {
  return b.init - a.init;
}

export default class EncounterInitiative extends React.Component<Props, State> {
  baselineMonsterData: Record<string, Character>;
  inititativeList: MonsterData[];

  constructor(props: Props) {
    super(props);

    this.state = {
      initativeOffset: 0,
      addingPlayer: false,
    }

    this.baselineMonsterData = {};
    this.inititativeList = [];

    this.loadMonsterData();
  }

  openAddPlayerDialog = () => {
    this.setState({
      addingPlayer: true,
      newPlayerInitative: undefined,
      newPlayerName: undefined,
    })
  }

  closeAddPlayerDialog = () => {
    this.setState({
      addingPlayer: false,
    })
  }

  addPlayer = () => {
    const { newPlayerInitative, newPlayerName, initativeOffset } = this.state;
    if (newPlayerInitative && newPlayerName) {
      const val = {
        idx: -1,
        init: newPlayerInitative,
        player: {
          name: newPlayerName,
          file: "https://www.dndbeyond.com/sheet-pdfs/Denanu_89861273.pdf",
        },
        conditionsRef: {
          val: {
            record: {},
            idx: randomNumber(),
          }
        }
      };

      const idx = sortedIndex(this.inititativeList, val, monsterComparator);
      this.inititativeList.splice(idx, 0, val);

      if (idx <= initativeOffset && initativeOffset !== 0) {
        this.setState({initativeOffset: initativeOffset + 1});
      }

      this.closeAddPlayerDialog();
    }
  }

  async loadOrKeepMonsterData(idx: MonsterIndex, data: Record<string, Character>) {
    if (idx.file in data) {
      return data[idx.file]
    }
    const [group, source, name] = this.getLocationData(idx.file);
    return await loadCharacter(group, source, name, this.props.token);
  }

  getLocationData(file: string) {
    return file.split("/");
  }

  async loadMonsterData() {
    await parallel<Character>(Object.entries(this.props.encounter.monsters).map((val: [string, EncounterMonster]) => {
        return [val[0], this.loadOrKeepMonsterData(val[1].mob, this.baselineMonsterData)];
      }),
      (key: string, char: Character) => {
        this.baselineMonsterData[key] = char;
      }
    );

    this.rollInitatives();
    this.buildInitiativeList();
  }

  rollInitatives() {
    for (const [, type] of Object.entries(this.props.encounter.monsters)) {
      const { count, mob } = type;
      if (!type.initatives) type.initatives = []
      if (type.initatives) {
        if (type.initatives.length === count) {continue;}
        if (type.initatives.length > count) {type.initatives = type.initatives.slice(0, count)}
        while (type.initatives.length < count) {
          const mod = toMod(this.baselineMonsterData[mob.file].dex);
          type.initatives.push(
            rollDice(1, 20, mod) + mod/100
          )
        }
      }
    }
  }

  buildInitiativeList() {
    var key = {val: 0}
    this.inititativeList = Object.entries(this.props.encounter.monsters).map(([_, val]: [string, EncounterMonster])=> {
      if (val.initatives) {
        return val.initatives.map((init: number, idx: number) => {
          key.val += 1;
          return {
            mob: val.mob,
            idx: idx,
            init: init,
            conditionsRef: {
              val: {
                record: {},
                idx: key.val,
              }
            }
          };
        })
      }
      return []
    }).flat().sort(monsterComparator);

    this.setState({});
  }

  addToInitativeList() {

  }

  getInitativePerson(i: number) {
    var idx = (i + this.state.initativeOffset)%this.inititativeList.length;
    return this.inititativeList[idx];
  }

  initaitveListElement = (idx: number) => {
    const mob = this.getInitativePerson(idx);
    return <Grid container columns={3} className="fullWidth" textAlign={"center"}>
      <Grid item xs={2}>
        {mob.mob ?
          mob.mob?.name + " (" + mob.idx + ")"
          :
          mob.player?.name
        } 
      </Grid>
      <Grid item xs={1}>
        {mob.init}
      </Grid>
    </Grid>
  }

  next = () => this.setState({initativeOffset: (this.state.initativeOffset + 1)%this.inititativeList.length});

  render() {
    const mob = this.inititativeList.length > 0 ? this.getInitativePerson(0) : undefined;
    const character = mob?.mob ? this.baselineMonsterData[mob.mob.file] : undefined;

    const uploadCharacter = async () => {
      const {token} = this.props;
      const mob = this.getInitativePerson(0)
      if (token && character && mob.mob) {
        const [group, source, name] = this.getLocationData(mob.mob.file);
        writePrivateData(token, "mobs", source, name, character, getMonsterIndex(character), group);
      }
    }

    const { addingPlayer } = this.state;

    return <Grid container spacing={2} columns={4} className="growable">
      <Grid item xs={1}>
        <Card variant="outlined">
          <CardContent>
            <h3>
              Initative List
            </h3>
            <ButtonGroup>
              <Button onClick={this.openAddPlayerDialog}>Add</Button>
              <Button onClick={this.next}>Next</Button>
            </ButtonGroup>
          </CardContent>
          <Divider/>
          <CardContent>
            <Card className="fullWidth" elevation={8} sx={{p:1}}>
              {this.inititativeList.length > 0 ? this.initaitveListElement(0) : emptyInitativeList}
            </Card>
          </CardContent>
          <Divider/>
          <CardContent>
            <List>
              {this.inititativeList.length > 1 ?
                range(1, this.inititativeList.length-1).map((idx: number) => {
                  return <ListItem>
                    <Card className="fullWidth" sx={{p: 1}}>
                      {this.initaitveListElement(idx)}
                    </Card>
                  </ListItem>
                })
                :null
              }
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={3} >
        {mob ?
          mob.mob ? 
            <StatsSheet character={character ? character : default_Character} conditionsRef={mob?.conditionsRef} upload={uploadCharacter}/>
            :
            null
          :
          <PlayerSheet player={{
            name: "test",
            file: "https://wandhoven.ddns.net/friendlyAI.pdf",
          }}/>
        }
      </Grid>
      <Dialog open={addingPlayer}>
        <DialogTitle>
          Add Player
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a player to the encounter.
          </DialogContentText>
          <div>
            <TextField label="name" variant="standard" onChange={(e: React.ChangeEvent<HTMLInputElement>)=> this.setState({newPlayerName: e.currentTarget.value})}/>
          </div>
          <NumberInput label="initative" setNumber={(init: number)=>this.setState({newPlayerInitative: init})}/>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={this.addPlayer}>Add</Button>
          <Button variant="outlined" onClick={this.closeAddPlayerDialog} color="error">Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  }
}
import * as React from "react";
import { Card, CardContent, Divider, Grid, List, ListItem, ButtonGroup, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Collapse, CardActions } from "@mui/material";
import Encounter, { EncounterMonster } from "./Encounter";
import Character, { default_Character } from "../monsters/Character";
import { IndexLocationData, loadCharacter, parallel, toUrl, writePrivateData } from "../../Login/ServerApi";
import { MonsterIndex, getMonsterIndex } from "../../pages/SelectMonserStatBlock";
import { IToken } from "../../Login/UseToken";
import { rollDice } from "../visualEditor/Engine/Utils";
import { toMod } from "../monsters/Utility/Utils";
import { range } from "../visualEditor/Nodes/Utils";
import StatsSheet from "../monsters/MonsterStatBlock";
import { ConditionData } from "../monsters/Conditions";
import NumberInput from "../visualEditor/Nodes/Utility/NumberInput";
import PlayerSheet, { PlayerData, makeDefaultPlayerData } from "../player/PlayerSheet";
import { CampainIndex, loadCamapin } from "../campain/Campain";
import CloseButton from "../CloseButton";
import { UUID, getuuid } from "../Uuid";


interface Props extends IToken{
  encounter: Encounter
}

interface State {
  initativeOffset: number;
  inititativeList: ((MonsterData & Initative) | (PlayerData & Initative))[];
  initInitative: boolean;

  players?: (PlayerData & Initative)[];
}

interface Initative {
  init: number;
}

interface MonsterData extends UUID {
  mob?: Character & IndexLocationData;
  player?: PlayerData;
  idx: number;
  conditionStack: Record<string, ConditionData[]>;
}

const emptyInitativeList = <Card>
  <CardContent className="NoMonstersWrapper">
    <span style={{marginRight: "1em"}}>!</span>
    The Initaitve list is Empty
  </CardContent>
</Card>

function monsterComparator(a: Initative, b: Initative) {
  return b.init - a.init;
}


export default class EncounterInitiative extends React.Component<Props, State> {
  baselineMonsterData: Record<string, Character>;
  monsterList: ((MonsterData & Initative)) [];
  

  constructor(props: Props) {
    super(props);

    this.state = {
      initativeOffset: 0,
      inititativeList: [],
      initInitative: false,
    }

    this.baselineMonsterData = {};
    this.monsterList = [];

    this.loadMonsterData();
    if (props.encounter.campain)
      loadCamapin(props.encounter.campain, props.token, (val: CampainIndex) => {
        const players = val.players.map((val: PlayerData) => {return {...val, init: 0}});
        this.setState({players: players});
        this.subBuildInitativeList(players);
      });
  }


  async loadOrKeepMonsterData(idx: MonsterIndex, data: Record<string, Character>) {
    if (idx.file in data) {
      return data[idx.file]
    }
    const {group, source, name} = idx.idx;
    return await loadCharacter(group, source, name, this.props.token);
  }

  async loadMonsterData() {
    await parallel<Character>(Object.entries(this.props.encounter.monsters).map((val: [string, EncounterMonster]) => {
        return [val[0], this.loadOrKeepMonsterData(val[1].mob, this.baselineMonsterData)];
      }),
      (key: string, char: Character) => {
        this.baselineMonsterData[key] = char;
      }
    );

    this.buildMonsterList();
  }

  buildMonsterList() {
    this.setState({inititativeList: 
      this.monsterList = Object.entries(this.props.encounter.monsters).map(([_, val]: [string, EncounterMonster])=> {
        const char = this.baselineMonsterData[toUrl(val.mob.idx)];
        const mod = toMod(char.dex);
        
        return range(0, val.count).map((init: number, idx: number) => {
          return {
            mob: {...char, idx: val.mob.idx},
            idx: idx,
            init: rollDice(20, 1, mod) + mod/100,
            key: getuuid(),
            conditionStack: {},
          } as (MonsterData & Initative);
        })
      }).flat().sort(monsterComparator)
    });
  }

  buildInitativeList() {
    this.subBuildInitativeList(this.state.players);
  }

  subBuildInitativeList(players?: (PlayerData & Initative)[] | undefined) {
    if (players) {
      const initList = [...this.monsterList, ...players].sort(monsterComparator);
      this.setState({ inititativeList: initList});
    }
  }

  getInitativePerson(i: number) {
    var idx = (i + this.state.initativeOffset)%this.state.inititativeList.length;
    return this.state.inititativeList[idx];
  }

  initaitveListElement = (idx: number) : [JSX.Element, React.Key | undefined] => {
    const mob = this.getInitativePerson(idx);

    const monster = mob as MonsterData;
    const player = mob as PlayerData;

    return [<Grid container columns={3} className="fullWidth" textAlign={"center"} key={mob.key}>
      <Grid item xs={2}>
        {monster?.mob ?
          monster.mob?.name + " (" + monster.idx + ")"
          :
          player?.name
        } 
      </Grid>
      <Grid item xs={1}>
        {mob.init}
      </Grid>
    </Grid>, mob.key]
  }

  next = () => this.setState({initativeOffset: (this.state.initativeOffset + 1)%this.state.inititativeList.length});

  render() {
    const { players, inititativeList, initInitative } = this.state;
    const mob = inititativeList.length > 0 ? this.getInitativePerson(0) : undefined;

    const monster = mob as MonsterData;
    const player = mob as PlayerData;

    const character = monster?.mob;

    const uploadCharacter = async () => {
      if (monster) {
        const {token} = this.props;
        if (token && character && monster.mob) {
          const { group, source, name } = monster.mob.idx;
          writePrivateData(token, "mobs", source, name, character, getMonsterIndex(character), group);
        }
      }
    }

    return <Grid container spacing={2} columns={4} className="growable">
      <Grid item xs={1}>
        <Card variant="outlined">
          <CardContent>
            <h3>
              Initative List
            </h3>
            <ButtonGroup>
              <Button onClick={this.next}>Next</Button>
            </ButtonGroup>
          </CardContent>
          <Divider/>
          <CardContent>
            <Card className="fullWidth" sx={{p:1}}>
              {inititativeList.length > 0 ? this.initaitveListElement(0)[0] : emptyInitativeList}
            </Card>
          </CardContent>
          <Divider/>
          <CardContent>
            <List>
              {inititativeList.length > 1 ?
                range(1, inititativeList.length-1).map((idx: number) => {
                  const [element, key] = this.initaitveListElement(idx);
                  return <ListItem key={key}>
                    <Card className="fullWidth" sx={{p: 1}}>
                      {element}
                    </Card>
                  </ListItem>
                })
                :null
              }
            </List>
          </CardContent>
          <Collapse in={players !== undefined}>
            <Divider/>
            <CardActions className="fullWidth">
                <ButtonGroup>
                  <Button onClick={() => this.setState({initInitative: true})}>
                    Init Players
                  </Button>
                </ButtonGroup>
            </CardActions>
          </Collapse>
        </Card>
      </Grid>
      <Grid item xs={3} >
        {monster?.mob ?
          <StatsSheet character={character ? character : default_Character} upload={uploadCharacter} getConditionsStack={()=>monster.conditionStack} setConditionsStack={(stack: Record<string, ConditionData[]>) => {
            monster.conditionStack = stack
            
          }}
            key={monster.key}
          />
        :
          <PlayerSheet player={{
            name: player?.name,
            key: "",
            file: player?.file,
          }}/>
        }
      </Grid>
      <Dialog open={initInitative}>
        <DialogTitle>
          <CloseButton onClick={()=>this.setState({initInitative: false})}>
            Init Player Initative
          </CloseButton>
        </DialogTitle>
        <Divider/>
        <DialogContent>
          {
            players ? 
              players.map((val: PlayerData & Initative) => {
                return <Grid container columns={3} key={val.key}>
                  <Grid item xs={2}>
                    {val.file ? 
                     val.name
                    :
                      <TextField value={val.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        val.name = e.target.value;
                        this.setState({});
                      }}
                        size="small"
                      />                    
                    }
                  </Grid>
                  <Grid item xs={1}>
                    <NumberInput val={val.init} setNumber={(init: number) => {
                      val.init = init;
                      this.buildInitativeList();
                    }}/>
                  </Grid>
                </Grid>
              })
            :
            null
          }
        </DialogContent>
        <Divider/>
        <DialogActions>
          <ButtonGroup>
            <Button onClick={()=> {
              const { players } = this.state;

              this.setState({
                players: [...(players ? players : []), {...makeDefaultPlayerData(), init: 0}]
              })
            }}>
              Add
            </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
    </Grid>
  }
}
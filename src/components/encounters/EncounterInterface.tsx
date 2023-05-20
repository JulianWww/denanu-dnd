import * as React from "react";
import { ButtonGroup, Card, CardContent, Divider, Button, Grid, Chip, Stack, useTheme, IconButton, Dialog, DialogTitle, DialogActions, TextField, DialogContent, List, ListItem, Collapse } from "@mui/material";
import Encounter, { EncounterMonster, getEncounterIndex } from "./Encounter";
import { IXP, ajustXp, calcBaseEncounterXp, calcMobXp, estimateDifficulty } from "./xpCalculation";
import { PaletteMode } from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import NumberInput from "../visualEditor/Nodes/Utility/NumberInput";
import { randomFileName, writePrivateData } from "../../Login/ServerApi";
import { IToken, Token } from "../../Login/UseToken";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import CampainSelector from "../campain/CamapaingSelector";

interface Props extends IToken {
  encounter: Encounter;
  update: VoidFunction;
  fileName?: string;
}

const noMonsters = <Card elevation={10}>
  <CardContent className="NoMonstersWrapper">
    <span style={{marginRight: "1em"}}>!</span>
    Add Monsers form the Database.
  </CardContent>
</Card>


export default function EncounterPlanerInterface(props: Props) {
  const [name, setName] = React.useState(props.encounter.name);
  const [campain, setCampain] = React.useState(props.encounter.campain);
  const [nameDialogOpen, setNameDialogOpen] = React.useState(false);

  const {encounter, update, token} = props;
  const mobs = Object.entries(encounter.monsters);

  const theme = useTheme().palette.mode;
  const nav = useNavigate();

  const xp = calcBaseEncounterXp(mobs);
  const ajustedXp = ajustXp(xp, mobs);
  const difficulty = estimateDifficulty(ajustedXp, encounter.xpThreshhold);
  const difficultyClass = theme + " difficulty-" + difficulty

  const upload = (nav: NavigateFunction, shouldNav: boolean) => {
    if (props.token && name) {
      const filename = props.fileName ? props.fileName : randomFileName();
      const file = writePrivateData(props.token, "encounters", props.token.username, filename, {...encounter, name, campain}, getEncounterIndex(name, campain));
      if (shouldNav) {
        nav("/encounters/" + file);
      }
      setName(undefined);
      return true;
    }
    return false;
  }


  return <Card variant="outlined" className="fullWidth fullHeight" >
      <CardContent>
        <h3>Encounter</h3>
      </CardContent>
      <Divider/>
            <Collapse in={mobs.length > 0}>
              <TransitionGroup>
                {mobs.map((mob => {
                  const ref = React.createRef<HTMLDivElement>();

                  return <CSSTransition key={mob[0]} timeout={500} classNames="item" nodeRef={ref}>
                      <div ref={ref}>
                        <CardContent className="fullWidth">
                          {renderMob(mob, encounter, encounter.xpThreshhold, theme, update)}
                        </CardContent>
                        <Divider/>
                      </div>
                    </CSSTransition>
                }))}
              </TransitionGroup>
              <CardContent>
                <Grid container columns={3} className="fullWidth" textAlign={"center"}>
                  <Grid item xs>
                    Difficulty
                  </Grid>
                  <Grid item xs>
                    Total Xp
                  </Grid>
                  <Grid item xs>
                    Ajusted Xp
                  </Grid>
                </Grid>
              </CardContent>
              <Divider/>
              <CardContent>
                <Grid container columns={3} className="fullWidth" textAlign={"center"}>
                  <Grid item xs>
                    <Chip className={difficultyClass} label={difficulty}/>
                  </Grid>
                  <Grid item xs>
                    {xp}
                  </Grid>
                  <Grid item xs>
                    {ajustedXp}
                  </Grid>
                </Grid>
              </CardContent>
            </Collapse>
            <Collapse in={mobs.length===0}>
              <CardContent>
                {noMonsters}
              </CardContent>
            </Collapse>
      
      <Divider/>
      <CardContent>
        <ButtonGroup className="right">
          {token ?
            <Button onClick={() => {
              if (name && name !== "") upload(nav, false);
              else setNameDialogOpen(true);
            }}>Save</Button>
            :
            null
          }
          <Button color="error" onClick={() => {
            encounter.monsters = {};
            update();
          }}>Reset</Button>
        </ButtonGroup>
      </CardContent>
      <Dialog open={nameDialogOpen}>
        <DialogTitle>
          Save Encounter
        </DialogTitle>
        <DialogContent>
          <DialogActions>
            <TextField label="name" value={name} variant="standard" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}/>
          </DialogActions>
          <DialogActions>
            <CampainSelector {...props} value={campain} onValueStringChange={(e: string | null) => {
              setCampain(e ? e: undefined);
            }}/>
          </DialogActions>
          <DialogActions>
            <ButtonGroup disableElevation variant="contained" fullWidth>
              <Button color="error" onClick={()=>setNameDialogOpen(false)}>Cancel</Button>
              <Button onClick={()=> {
                  if (upload(nav, true)) {
                    setNameDialogOpen(false)
                  }
                  }}
                >
                  Save
                </Button>
            </ButtonGroup>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Card>
}

function renderMob(data: [string, EncounterMonster], encounter: Encounter, maxxp: IXP, theme: PaletteMode, update: VoidFunction) {
  const [key, mob] = data;
  const {count} = mob;
  const {name, cr} = mob.mob;
  const xp = calcMobXp(cr);

  const remove = () => {
    delete encounter.monsters[key];
    update();
  }

  return<Grid container columns={16}>
    <Grid item sx={{flexGrow: 1}}>
      <h5>{name}</h5>
      <Stack direction="row" spacing={1}>
        <Chip className={theme + " difficulty-" + estimateDifficulty(xp, maxxp)} label={cr + " CR"}/>
        <Chip label={xp + " XP"}/>
      </Stack>
    </Grid>
    <Grid item sx={{float: "right"}}>
      <NumberInput className="thinNumber" label="Count" val={count} setNumber={(num: number)=> {mob.count = num; if(num < 1) {remove()}; update()}}/>
      <IconButton color="error" aria-label="upload picture" component="label" onClick={remove}>
        <Delete/>
      </IconButton>
    </Grid>
  </Grid>
}
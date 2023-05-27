import * as React from "react";
import NumberInput from "../visualEditor/Nodes/Utility/NumberInput";
import { IconButton, Card, CardContent, Button, Divider } from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import { calculateXpThreshhold } from "./xpCalculation";
import Inline from "../InlineDisplay";
import Encounter from "./Encounter";
import addUUID, { getuuid } from "../Uuid";

interface Props {
  encounter: Encounter;
  update: VoidFunction;
}

export interface Party {
  size: number;
  lvl: number;
  key: string;
}


export default function PartyData(props: Props) {
  const {parties} = props.encounter;
  const xp = calculateXpThreshhold(parties, props.encounter, props.update);

  return <Card className="fitContent fullHeight" variant="outlined">
    <Inline className="party-player">
      <Inline.Item>
        <Card className="heightFlex" variant="outlined">
          <CardContent>
            <h3>Party</h3>
          </CardContent>
          <Divider/>
          <CardContent>
            {
              parties.map((party: Party, idx: number) => {
                addUUID(party);
                return <div key={party.key}>
                  <NumberInput label="Count" val={party.size} className="party-selector" setNumber={(num: number) => {parties[idx].size = num; props.update()}}/>
                  <NumberInput label="level" val={party.lvl}  className="party-selector" setNumber={(num: number) => {parties[idx].lvl = num; props.update()}}/>
                  <IconButton color="error" aria-label="upload picture" component="label" disabled={parties.length < 2} onClick={
                    () => {
                      //console.log(partis.filter((val: any, i: number)=> i !== idx));
                      props.encounter.parties = parties.filter((val: any, i: number)=> i !== idx);
                      console.log("bye");
                      props.update();
                    }
                  }>
                    <Delete/>
                  </IconButton>
                </div>
              })
            }
          </CardContent>
          <CardContent>
            <Button onClick={() => {
              parties.push({size: 4, lvl: 1, key: getuuid()});
              console.log("hi");
              props.update();
            }}>
              ADD GROUP
            </Button>
          </CardContent>
        </Card>
      </Inline.Item>
      <Divider/>
      <Inline.Item sx={{minWidth: "150px"}}>
        <Card className="heightFlex" variant="outlined">
          {DifficultyXp("Difficulty", "EXP")}
          <Divider/>
          {DifficultyXp("Easy", xp.easy)}
          <Divider/>
          {DifficultyXp("Medium", xp.medium)}
          <Divider/>
          {DifficultyXp("Hard", xp.hard)}
          <Divider/>
          {DifficultyXp("Deadly", xp.deadly)}
        </Card>
      </Inline.Item>
    </Inline>
  </Card>
}

function DifficultyXp(a: any, b: any) {
  return <CardContent className="tight">
    <div style={{width: "70px", display: "inline-block"}}>{a}</div>
    <div style={{float: "right", display: "inline-block"}}>{b}</div>
  </CardContent>
}
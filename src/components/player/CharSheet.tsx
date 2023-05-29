import { Container, Grid, TextField } from "@mui/material";
import { ChangeEvent, Component, ReactNode } from "react";
import PlayerCharacter, { defaultPlayerCharacter } from "./PlayerCharacter";
import { alignments, strSelect } from "../monsters/BlockEditor";
import IOSSwitch from "../monsters/Utility/IOSSwitch";
import TextWraper from "../TextWraper";
import NumberInput from "../visualEditor/Nodes/Utility/NumberInput";

interface Props {

}

interface State {
  sheet: PlayerCharacter;
}

export default class PlayerCharacterSheet extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      sheet: defaultPlayerCharacter(),
    }
  }

  update() {
    this.setState({});
  }

  updatePlayerData(assign: (val: string)=>void) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      assign(e.target.value);
      this.update();
    }
  }

  updatePlayerDataNumber(assign: (val: number)=>void) {
    return (val: number) => {
      assign(val);
      this.update();
    }
  }

  render(): ReactNode {
    const { sheet } = this.state;
    const { player, name, campaign, race, cls, deity, alignment, caster, level, experience } = sheet;
    
    return <Container>
      <Grid container columns={6} spacing={1}>
        <Grid item xs={2}>
          <TextField label="Name" fullWidth value={name} onChange={this.updatePlayerData((val: string) => sheet.name = val)}  autoComplete="name"/>
        </Grid>
        <Grid item xs={2}>
          <TextField label="Player" fullWidth value={player} onChange={this.updatePlayerData((val: string) => sheet.player = val)}  autoComplete="player"/>
        </Grid>
        <Grid item xs={2}>
          <TextField label="Campaign" fullWidth value={campaign} onChange={this.updatePlayerData((val: string) => sheet.campaign = val)} autoComplete="campain"/>
        </Grid>

        <Grid item xs={2}>
          <TextField label="Class" fullWidth value={cls} onChange={this.updatePlayerData((val: string) => sheet.cls = val)}  autoComplete="class"/>
        </Grid>
        <Grid item xs={2}>
          <TextField label="Race" fullWidth value={race} onChange={this.updatePlayerData((val: string) => sheet.race = val)} autoComplete="race"/>
        </Grid>
        <Grid item xs={1}>
          <TextField label="Deity" fullWidth value={deity} onChange={this.updatePlayerData((val: string) => sheet.deity = val)} autoComplete="deity"/>
        </Grid>
        <Grid item xs={1}>
          <TextField label="Alignment" fullWidth value={alignment} onChange={this.updatePlayerData((val: string) => sheet.alignment = val)} select>
            {strSelect(alignments)}
          </TextField>
        </Grid>
        <Grid item xs={1} sx={{mt:3}}>
          <IOSSwitch sx={{mr:1}} onChange={this.updatePlayerData(()=> sheet.caster = !caster)} checked={caster}/> Caster
        </Grid>
        <Grid item xs={1}>
          <NumberInput label="Level" setNumber={this.updatePlayerDataNumber((val: number) => sheet.level = val)} val={level} fullWidth/>
        </Grid>
        <Grid item xs={1}>
          <NumberInput label="Experience" setNumber={this.updatePlayerDataNumber((val: number) => sheet.experience = val)} val={experience} fullWidth/>
        </Grid>
      </Grid>
    </Container>; 
  }
}
import { Collapse, FormGroup, Grid, TextField } from "@mui/material";
import TextWraper from "../TextWraper";
import Spell from "./Spell";
import { ChangeEvent } from "react";
import { strSelect, strSelectIdxValue } from "../monsters/BlockEditor";
import { range } from "../visualEditor/Nodes/Utils";
import { actions } from "../monsters/data/Actions";
import IOSSwitch from "../monsters/Utility/IOSSwitch";
import { spellDurations } from "../monsters/data/Time";
import NumberInput from "../visualEditor/Nodes/Utility/NumberInput";
import magicSchools from "./data/magicSchools";
import MultiSelectString, { MultiSelect, MultiSelectRecord } from "../MultiSelect";
import { attributes } from "../monsters/Attributes";
import { damage_inputs } from "../monsters/Utility/Damage";

interface Props {
  spell: Spell;
  update: VoidFunction;
}

export default function SpellEditor(props: Props) {
  const { spell, update } = props;

  return <TextWraper>
    <div className="row">
      <TextField fullWidth label="name" value={spell.name} onChange={(e: ChangeEvent<HTMLInputElement>) => {
        spell.name = e.target.value;
        update();
      }}/>
    </div>
    <Grid container columns={4} spacing={1} sx={{mt:1}}>
      <Grid item xs={1}>
        <TextField fullWidth label="level" value={spell.level} select onChange={(e: ChangeEvent<HTMLInputElement>) => {
          spell.level = Number(e.target.value);
          update();
        }}>
          {strSelect(range(0,9))}
        </TextField>
      </Grid>
      <Grid item xs={1}>
        <TextField fullWidth label="casting Time" value={spell.castingTime} select onChange={(e: ChangeEvent<HTMLInputElement>) => {
          spell.castingTime = e.target.value;
          update();
        }}>
          {strSelect(actions)}
        </TextField>
      </Grid>
      <Grid item xs={1}>
        <TextField label="range" fullWidth value={spell.range} onChange={(e: ChangeEvent<HTMLInputElement>) => {
          spell.range = e.target.value;
          update();
        }}/>
      </Grid>
      <Grid item xs={1}>
        <Grid container columns={3}>
          <Grid item xs={1}>
            Verbal
          </Grid>
          <Grid item xs={1}>
            Material
          </Grid>
          <Grid item xs={1}>
            Somatic
          </Grid>
          <Grid item xs={1}>
            <IOSSwitch checked={spell.components.verbal} onClick={() => {
              spell.components.verbal = !spell.components.verbal;
              update();
            }}/>
          </Grid>
          <Grid item xs={1}>
            <IOSSwitch checked={spell.components.material} onClick={() => {
              spell.components.material = !spell.components.material;
              update();
            }}/>
          </Grid>
          <Grid item xs={1}>
            <IOSSwitch checked={spell.components.somatic} onClick={() => {
              spell.components.somatic = !spell.components.somatic;
              update();
            }}/>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={1}>
        <Collapse in={spell.duration_type == 2}>
          <NumberInput value={spell.duration} setNumber={(num: number) => {
            spell.duration = num;
            update();
          }}/>
        </Collapse>
        <TextField label="duration" fullWidth value={spell.duration_type} select onChange={(e: ChangeEvent<HTMLInputElement>) => {
          spell.duration_type = Number(e.target.value);
          update();
        }}>
          {strSelectIdxValue(spellDurations)}
        </TextField>
      </Grid>
      <Grid item xs={1}>
        <TextField label="School" fullWidth value={spell.school.toLocaleLowerCase()} select onChange={(e: ChangeEvent<HTMLInputElement>) => {
          spell.school = e.target.value;
          update();
        }}>
          {strSelect(magicSchools)}
        </TextField>
      </Grid>
      <Grid item xs={1}>
        <MultiSelectString
          value={spell.savingThrows} 
          options={Object.entries(attributes).map(([a, b]: [string, string]) => b.toLocaleLowerCase())} 
          onChange={(val: string[]) => {
            spell.savingThrows = val;
            update()
          }}
          label="Saves"
        />
      </Grid>
      <Grid item xs={1}>
        <MultiSelectString
          value={spell.damageTypes} 
          options={Object.keys(damage_inputs)} 
          onChange={(val: string[]) => {
            spell.damageTypes = val;
            update()
          }}
          label="Saves"
        />
      </Grid>
    </Grid>

    <TextField fullWidth sx={{mt: 2}} minRows={4} multiline label="description" defaultValue={spell.description} onChange={(e: ChangeEvent<HTMLInputElement>) => {
      spell.description = e.target.value;
      update();
    }}/>

    <TextField fullWidth sx={{mt: 1}}  multiline label="at Higher Levels" defaultValue={spell.atHigherLevels} onChange={(e: ChangeEvent<HTMLInputElement>) => {
      spell.atHigherLevels = e.target.value;
      update();
    }}/>

  </TextWraper>
}
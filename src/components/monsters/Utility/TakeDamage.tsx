import * as React from "react";
import Character from "../Character";
import { Dialog, DialogContent, DialogTitle, Switch, TextField, MenuItem, DialogActions, FormControlLabel } from "@mui/material";
import { pink } from '@mui/material/colors';
import { applyDamageModifications, damage_inputs } from "./Damage";
import NumberInput from "../../visualEditor/Nodes/Utility/NumberInput";
import { Button, Menu } from "semantic-ui-react";
import IOSSwitch from "./IOSSwitch";
import CustomRef from "../../../Utils/CustomRef";
import { changeHP } from "../Character";

interface Props {
  character: Character;
  open: CustomRef<VoidFunction>;
  setCharacter: VoidFunction;
}

const switchSX = {
  color: "#000000",
  '&.Mui-checked': {
    color: pink[600],
  },
}
export default function TakeDamageDialog(props: Props) {
  const {open, character} = props;

  const [damage_type, setDamageType] = React.useState("Generic")
  const [damage, setDamage] = React.useState(0);
  const [magical, setMagical] = React.useState(true);
  const [silver, setSilver] = React.useState(false);
  const [adamantine, setAdamantine] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const close = () => {
    setIsOpen(false);
    props.setCharacter()
  }

  const heal = () => {
    changeHP(character, damage);
    close();
  }

  const applyDamage = () => {
    changeHP(character, -applyDamageModifications(character, damage, damage_type, magical, silver, adamantine));
    close();
  }

  open.val = () => {setIsOpen(true)};

  return <Dialog open={isOpen}>
    <DialogTitle>Aply Damage</DialogTitle>
      <DialogContent>
        <NumberInput setNumber={setDamage} label="Amount" fullWidth/>
        <TextField select label="Damage type" variant="standard" defaultValue={"Generic"} fullWidth onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDamageType(e.target.value)}>
          <MenuItem value={"Generic"}>
            Generic
          </MenuItem>
          {Object.entries(damage_inputs).map((option: [string, boolean], idx: number) => (
            <MenuItem key={option[0]} value={option[0]}>
              {option[0]}
            </MenuItem>
          ))}
        </TextField>
        <DialogActions>
          <FormControlLabel control={
            <IOSSwitch checked={magical} sx={{ m: 1 }} defaultChecked onChange={(e: any, b: boolean) => setMagical(b)}/>
          }
          label="magic"/>
          <FormControlLabel control={
            <IOSSwitch checked={silver} sx={{ m: 1 }} defaultChecked onChange={(e: any, b: boolean) => setSilver(b)}/>
          }
          label="silver"/>
          <FormControlLabel control={
            <IOSSwitch checked={adamantine} sx={{ m: 1 }} defaultChecked onChange={(e: any, b: boolean) => setAdamantine(b)}/>
          }
          label="adamantine"/>
        </DialogActions>
        <DialogActions>        
          <Button.Group fluid>
            <Button color="green" onClick={heal}>Heal</Button>
            <Button.Or/>
            <Button color="youtube" onClick={applyDamage}>Damage</Button>
          </Button.Group>
        </DialogActions>
      </DialogContent>
  </Dialog>
}
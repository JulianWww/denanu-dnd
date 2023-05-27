import * as React from "react";
import { Rolls } from "../../visualEditor/Engine/Utils";
import { Menu, MenuItem } from "@mui/material";
import CustomRef from "../../../Utils/CustomRef";

export interface RunApi{
  openContext: (e: HTMLElement)=>void;
  closeContext: VoidFunction;
  run: VoidFunction;
}

interface Props extends React.HTMLProps<HTMLDivElement> {
  run: (type: Rolls) => void;
  children?: React.ReactNode;
  rollType?: Rolls;
  r?: CustomRef<RunApi>
}

export default function RunnTypeSelector(props: Props) {
  var {run, rollType, children, r, ...other} = {rollType: Rolls.Normal, ...props};

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const contextMenu = (e: HTMLElement | null) => {
    setAnchorEl(e);
  }
  if (r)
    r.val = {
      openContext: contextMenu,
      closeContext: handleClose,
      run: () => run(rollType),
    };

  const data =  <div {...other} onClick={r?undefined:()=>run(rollType)} onContextMenu={r ? undefined : (e: React.MouseEvent<HTMLDivElement>) => {contextMenu(e.currentTarget); e.preventDefault();}}>
    {children}
    <Menu key="last" open={open} onClose={handleClose} anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left"
        }}>
      <MenuItem key={1} className="roll-type Advantage"    selected={rollType === Rolls.Advantage}    onClick={(e: React.MouseEvent) => {e.stopPropagation(); run(Rolls.Advantage);    handleClose()}}>Advantage</MenuItem>
      <MenuItem key={2} className="roll-type"              selected={rollType === Rolls.Normal}       onClick={(e: React.MouseEvent) => {e.stopPropagation(); run(Rolls.Normal);       handleClose()}}>Normal</MenuItem>
      <MenuItem key={3} className="roll-type Disadvantage" selected={rollType === Rolls.Disadvantage} onClick={(e: React.MouseEvent) => {e.stopPropagation(); run(Rolls.Disadvantage); handleClose()}}>Disadvantage</MenuItem>
    </Menu>
  </div>

  return data
}
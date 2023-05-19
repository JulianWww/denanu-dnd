import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { RunApi } from "./RunnTypeSelector";
import CustomRef from "../../../Utils/CustomRef";

interface Props {
  children: React.ReactElement<any, any>;
  items: [JSX.Element, CustomRef<RunApi>][]
}

export default function RunnerSelector(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeContextMenues = () => {
    props.items.forEach((val: [JSX.Element, CustomRef<RunApi>]) => {
      if (val[1].val) {
        val[1].val.closeContext()
      }
    })
  }

  const handleClose = () => {
    closeContextMenues();
    setAnchorEl(null);
  };

  return <div className="property-line">
      <div onClick={handleClick}>
        {props.children}
      </div>
      <Menu open={open} onClose={handleClose} anchorEl={anchorEl} onClick={closeContextMenues}>
        {
          props.items.map(
            (val: [JSX.Element, CustomRef<RunApi>], idx: number, arr: [JSX.Element, CustomRef<RunApi>][]) => {
              return <MenuItem key={idx} onClick={(e: React.MouseEvent) => {
                if (val[1].val) {
                  e.stopPropagation();
                  val[1].val.run();
                }
              }} onContextMenu={
                (e: React.MouseEvent<HTMLElement>) => {
                  if (val[1].val) {
                    closeContextMenues();
                    e.preventDefault();
                    val[1].val.openContext(e.currentTarget);
                  }
                }
              }>
              {val[0]}
              </MenuItem>
            }
          )
        }
      </Menu>
    </div>
}
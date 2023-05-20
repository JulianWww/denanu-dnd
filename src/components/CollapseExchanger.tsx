import { Collapse, CollapseProps } from "@mui/material";
import { ReactNode } from "react";

interface Props extends CollapseProps {
  children: ReactNode[];
  idx: number;
}

export default function CollapseExchanger(props: Props){
  const { children, idx,  ...other } = props;

  return <>
    {children.map((e: ReactNode, i: number) =>
      <Collapse in={idx === i} {...other}>
        {e}
      </Collapse>
    )}
  </>
}
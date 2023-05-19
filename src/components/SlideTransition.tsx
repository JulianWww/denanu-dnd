import { Box } from "@mui/material";
import { ReactNode } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";

interface Props {
  children: ReactNode;
  id: string;
}

export function SlideTransition(props: Props) {
  const {children, id} = props;
  const timeout = 400;

  return (
    <Box sx={{zIndex:-10}}>
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={id}
        timeout={timeout}
        classNames="fade"
        mountOnEnter={false}
        unmountOnExit={true}
      >
        <div
          className="left"
        >
          {children}
        </div>
      </CSSTransition>
    </SwitchTransition>
    </Box>
  )
}
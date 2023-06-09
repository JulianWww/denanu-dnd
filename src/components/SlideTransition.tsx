import { Box } from "@mui/material";
import { ReactNode } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";

interface Props {
  children: ReactNode;
  id: string;
  variant?: string
}

export function SlideTransition(props: Props) {
  const {children, id, variant} = props;
  const timeout = 400;

  return (
    <Box sx={{zIndex:-10}}>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={id}
          timeout={timeout}
          classNames={variant ? variant: "fade"}
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
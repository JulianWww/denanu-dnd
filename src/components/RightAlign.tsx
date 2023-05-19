import { Box, BoxProps } from "@mui/material";
import { ReactNode } from "react";

interface Props extends BoxProps {
  children: ReactNode;
}

export default function RightAlign(props: Props) {
  const {children, sx, ...box} = props;

  return <Box {...box} sx={{
    display: "flex",
    justifyContent: "right",
    m: 1,
    ...sx
  }}>
    {children}
  </Box>
}
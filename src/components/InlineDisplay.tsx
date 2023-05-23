import { Box, BoxProps } from "@mui/material";
import * as React from "react";


export default class Inline extends React.Component<BoxProps, {}> {
  static Item(props: BoxProps) {
    const { sx, className, ...other } = props;
    const name = "inline-display-element"
    return (
      <Box
        sx={{
          borderRadius: 2,
          ...sx,
        }}
        {...other}
        className={className ? name + " " + className : name}
      />
    );
  }

  render() {
    return <Box
      {...this.props}
      sx={{
        display: 'flex',
        flexDirection: 'row',
      }}
      className={"inline-display " + this.props.className}
    >
      {this.props.children}
    </Box>
  }
}
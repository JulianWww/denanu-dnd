import React, { Component, Fragment, ReactNode } from "react";
import Box from "@mui/material/Box";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  "slide-enter": {
    flexGrow: 0,
    width: 0,
    overflow: "hidden",
    whiteSpace: "nowrap",
    transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
  },
  "slide-active-enter": {
    flexGrow: 1,
    width: "auto",
    overflow: "hidden",
    whiteSpace: "nowrap",
    transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
  },
  "slide-done-enter": {
    flexGrow: 1,
    width: "auto",
    overflow: "hidden",
    whiteSpace: "nowrap"
  },
  "slide-exit": {
    flexGrow: 1,
    width: "auto",
    transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
  },
  "slide-active-exit": {
    flexGrow: 0,
    width: 0,
    overflow: "hidden",
    whiteSpace: "nowrap",
    paddingLeft: 0,
    paddingRight: 0,
    transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
  },
  "slide-done-exit": {
    flexGrow: 0,
    width: 0,
    overflow: "hidden",
    whiteSpace: "nowrap",
    paddingLeft: 0,
    paddingRight: 0
  }
});

interface Props {
  elements: JSX.Element[];
}

export default function VariantColumnsRow({ elements }: Props){
  const classes = useStyles();

  return (
    <>
      <TransitionGroup style={{ display: "flex" }}>
        {elements.map((val: ReactNode, i: number) =>
          
              
                val
            
        )}
      </TransitionGroup>
    </>
  );
};
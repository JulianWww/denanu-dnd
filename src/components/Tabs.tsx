import * as React from "react";
import { Box, BoxProps, Tab, Tabs } from "@mui/material";
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';

export interface TabsProps extends BoxProps {
  children: React.ReactNode[];
  labels: string[];
  childProps?: Record<number, React.HTMLProps<HTMLDivElement>>;
}

interface TabPanelProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
  dir?: string;
  index: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, index, ...other } = props;

  return (
    <div
      {...props}
      key={index}
    >
      {children}
    </div>
  );
}

export default function TabBar(props: TabsProps) {
  const [tab, setTab] = React.useState(0);
  const { children, labels, childProps, sx, ...other} = props;

  const theme = useTheme();

  return <>
    <Box sx={{ borderBottom: 1, marginBottom: 2, borderColor: 'divider', ...sx }} {...other}>
      <Tabs value={tab} onChange={(event: React.SyntheticEvent, tab: number) => setTab(tab)} aria-label="basic tabs example">
        {
          labels.map((val: string, idx: number) => <Tab key={idx} label={val}/>)
        }
      </Tabs>
    </Box>
    <SwipeableViews
      index={tab}
      onChangeIndex={(idx: number) => setTab(idx)}
      axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
      className="swipablew-view-growable"
    >
      {[
        children.map((child: React.ReactNode, idx: number) =>
          <TabPanel index={idx} {...(childProps ? childProps[idx] : {})}>
            {child}
          </TabPanel>
        )
      ]}
    </SwipeableViews>
  </>
}
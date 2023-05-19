import SwipeableViews, { SwipeableViewsProps } from "react-swipeable-views";
import { TabPanel } from "./Tabs";


interface Props {
  open: boolean,
  children: [React.ReactNode, React.ReactNode];
  style?: React.CSSProperties;
}

export default function ComponentSwap(props: Props) {
  const { open, children, style } = props;
  return <SwipeableViews
    index={Number(open)}
    axis={"x"}
    style={{width: "fit-content", ...style}}
  >
    {[
      children.map((child: React.ReactNode, idx: number) =>
        <TabPanel index={idx}>
          {child}
        </TabPanel>
      )
    ]}
  </SwipeableViews>
}
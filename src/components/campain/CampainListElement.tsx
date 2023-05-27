import { CampainIndex } from "./Campain";
import { Button, Card, CardContent, useTheme } from "@mui/material";
import useCampains from "./useCampain";

interface Props extends CampainIndex {
  onClick: (e: React.MouseEvent<HTMLElement>, c: CampainIndex) => void;
}

export default function CampainListElement(props: Props) {
  const [campain, setCampain ] = useCampains();
  const selected = props.name === campain
  const theme = useTheme();

  return <Button fullWidth variant="text">
    <Card className="fullWidth" onClick={(e: React.MouseEvent<HTMLElement>) => {setCampain(props.name); props.onClick(e, props); e.stopPropagation()}} sx={ selected ? {
      borderColor: theme.palette.grey[700]
    }
    :
    null}>
      <CardContent className="searchlist-element">
        {props.name}
      </CardContent>
    </Card>
  </Button>
}
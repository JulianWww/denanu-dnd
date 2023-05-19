import { CampainIndex } from "./Campain";
import { Button, Card, CardContent } from "@mui/material";

interface Props extends CampainIndex {
  onClick: (e: React.MouseEvent<HTMLElement>, c: CampainIndex) => void;
}

export default function CampainListElement(props: Props) {
  return <Button fullWidth variant="text">
    <Card className="fullWidth" onClick={(e: React.MouseEvent<HTMLElement>) => {props.onClick(e, props); e.stopPropagation()}}>
      <CardContent className="searchlist-element">
        {props.name}
      </CardContent>
    </Card>
  </Button>
}
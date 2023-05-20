import { Button, Card } from "@mui/material";
import { EncounterIndex } from "./Encounter";
import { CardContent } from "semantic-ui-react";
import { useNavigate } from 'react-router-dom';
import { toUrl } from "../../Login/ServerApi";

interface Props extends EncounterIndex {
}

export default function EncounterListElement(props: Props) {
  const nav = useNavigate();

  return <Button fullWidth variant="text">
    <Card className="fullWidth" onClick={()=>nav(toUrl(props.idx))}>
      <CardContent className="searchlist-element">
        {props.name}
      </CardContent>
    </Card>
  </Button>
}
import { Button, Card } from "@mui/material";
import { EncounterIndex } from "./Encounter";
import { CardContent } from "semantic-ui-react";
import { useNavigate } from 'react-router-dom';

interface Props extends EncounterIndex {
}

export default function EncounterListElement(props: Props) {
  const nav = useNavigate();

  return <Button fullWidth variant="text">
    <Card className="fullWidth" onClick={()=>nav(props.file)}>
      <CardContent className="searchlist-element">
        {props.name}
      </CardContent>
    </Card>
  </Button>
}
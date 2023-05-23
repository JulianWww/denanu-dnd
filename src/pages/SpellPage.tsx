import { useParams } from "react-router-dom";
import { IToken } from "../Login/UseToken";
import SpellRenderer from "../components/spells/SpellRenderer";
import { ButtonGroup, Container } from "@mui/material";
import Loading from "../components/Loading";
import NavigateButton from "../components/NavitageButton";

interface Props extends IToken {

}

export default function SpellPage(props: Props) {
  const params = useParams();
  const {group, source, name} = params
  return (
    <Container>
      <ButtonGroup sx={{mb: 1, ml:1}}>
        <NavigateButton url="/spells">
          To List
        </NavigateButton>
      </ButtonGroup>
      {group && source && name ?
        <SpellRenderer {...props} location={{group: group, source: source, name: name}}/>
        :
        <Loading/>
      }
    </Container>
  )
}
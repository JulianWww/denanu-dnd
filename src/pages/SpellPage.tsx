import { useParams } from "react-router-dom";
import { IToken } from "../Login/UseToken";
import SpellRenderer from "../components/spells/SpellRenderer";
import { Container } from "@mui/material";
import Loading from "../components/Loading";

interface Props extends IToken {

}

export default function SpellPage(props: Props) {
  const params = useParams();
  const {group, source, name} = params

  return (
    <Container>
      {group && source && name ?
        <SpellRenderer {...props} location={{group: group, source: source, name: name}}/>
        :
        <Loading/>
      }
    </Container>
  )
}
import * as React from "react";
import { Button, ButtonGroup, Container } from "@mui/material";
import {IToken} from "../Login/UseToken";
import MainMenu from "../components/MainMenu";
import SearchableList, { Element } from "../components/SearchableList";
import { Loader } from "semantic-ui-react";
import { loadEncounters } from "../components/encounters/Utils";
import { EncounterIndex } from "../components/encounters/Encounter";
import EncounterListElement from "../components/encounters/EncounterListElement";
import EncountersSearchableList, { EncounterElement } from "../components/EncountersSearchableList";
import NavigateButton from "../components/NavitageButton";
import RightAlign from "../components/RightAlign";

interface Props extends IToken {
}

interface State {
  encounters: Element[];
  loading: boolean;
}

export default class EncounterList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      encounters: [],
      loading: true
    }
  }

  componentDidMount(): void {
    this.load();
  }

  async load() {
    this.setState({loading: false,
      encounters: (await loadEncounters(this.props.token)).map((val: EncounterIndex) => {
        console.log(val);
        return {
          item: <EncounterListElement {...val}/>,
          key: val.name,
          ...val
        } as EncounterElement
      })
    })
  }
  
  render() {
    const { token, setToken } = this.props;
    const { loading, encounters } = this.state; 

    return <Container>
      {
        loading ? <Loader/> :
        <>
          <RightAlign>
            <NavigateButton url="/encounter-planer">
              Add
            </NavigateButton>
          </RightAlign>
          <EncountersSearchableList elements={encounters} {...this.props}/>
        </>
      }
    </Container>
  }
}

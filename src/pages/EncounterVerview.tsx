import * as React from "react"
import { IToken } from "../Login/UseToken";
import { TextField, Container } from "@mui/material";
import Encounter, { getEncounterIndex } from "../components/encounters/Encounter";
import { Params, useParams } from "react-router-dom";
import { readPrivateData, writePrivateData } from "../Login/ServerApi";
import { EncounterPlanerModule } from "./EncounterPlaner";
import { Loader } from "semantic-ui-react";
import CustomRef from "../Utils/CustomRef";
import TabBar from "../components/Tabs";
import TextWraper from "../components/TextWraper";
import EncounterInitiative from "../components/encounters/EncounterInitative";
import ComponentSwap from "../components/ComponentSwap";
import CampainSelector from "../components/campain/CamapaingSelector";

interface Props extends IToken {
}

interface State {
  encounter?: Encounter;
  editingTitle: boolean;
  editingCampain: boolean;
}

class EncounterVerviewCLS extends React.Component<Props & {params: Readonly<Params<string>>}, State> {
  tab: CustomRef<number>;

  constructor(props: Props & {params: Readonly<Params<string>>}) {
    super(props);

    this.state = {
      editingTitle: false,
      editingCampain: false,
    }

    this.tab = new CustomRef<number>();
  }

  componentDidMount(): void {
    this.load();
  }

  async load() {
    const {token, params} = this.props;
    const {group, source, name} = params;
    if (source && name) {
      if (group === "private" && token) {
        const encounter = (await readPrivateData(token, "encounters", name)) as Encounter;
        this.setState({encounter: encounter})
      }
    }
  }

  upload = () => {
    const {token} = this.props;
    const { encounter } = this.state;
    const filename = this.props.params.name;
    if (token && filename && encounter?.name) {
      writePrivateData(token, "encounters", token.username, filename, encounter, getEncounterIndex(encounter.name, encounter.campain));
    }
  }

  render() {
    const { encounter, editingTitle, editingCampain } = this.state;
    return <Container sx={{height: "100%"}}>
      {
        encounter ?
        <>
          <TextWraper>
            <ComponentSwap open={editingTitle}>
              <h2 onClick={()=>this.setState({editingTitle: true})}>{encounter.name}</h2>
              <TextField variant="standard" value={encounter.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                encounter.name = e.target.value;
                this.forceUpdate();
              }}
                onBlur={(e: React.FocusEvent) => {
                  this.setState({editingTitle: false});
                  this.upload();
                }}
              />
            </ComponentSwap>
          </TextWraper>
          <TextWraper>
            <ComponentSwap open={editingCampain || encounter.campain === undefined} style={{minWidth: "400px"}}>
              <h3 onClick={()=>this.setState({editingCampain: true})} style={{marginTop: "20px"}}>{encounter.campain}</h3>
              <CampainSelector {...this.props} onValueStringChange={(a: string | null) => {
                encounter.campain = a ? a : undefined;
              }} fullWidth onBlur={()=>{
                this.setState({editingCampain: false});
                this.upload();
                }}/>
            </ComponentSwap>
            
          </TextWraper>
          <TabBar labels={["Encounter Builder", "Initative"]} childProps={{1: {className: "growable"}}}>
            <EncounterPlanerModule {...this.props} encounter={encounter} fileName={this.props.params.name} update={(e: Encounter) => this.setState({encounter: e})}/>
            <EncounterInitiative {...this.props} encounter={encounter}/>
          </TabBar>
        </>
        : <Loader/>
      }
    </Container>
  }
}

export default function StatBlock(props: Props) {
  return <EncounterVerviewCLS {...props} params={useParams()}/>
}
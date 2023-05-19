import * as React from "react";
import { AppBar, Button, ButtonGroup, Card, CardActions, Container, Dialog, DialogContent, IconButton, TextField, Toolbar } from "@mui/material";
import {IToken} from "../Login/UseToken";
import MainMenu from "../components/MainMenu";
import CampainList from "../components/campain/CampainList";
import { CampainIndex } from "../components/campain/Campain";
import { Divider } from "semantic-ui-react";
import TabBar from "../components/Tabs";
import AddPlayer from "../components/player/AddPlayer";
import { writePrivateData } from "../Login/ServerApi";
import ViewPlayers from "../components/player/ViewPlayers";
import PlayerEditor from "../components/player/PlayerEditer";
import { Delete } from "@mui/icons-material";

interface Props extends IToken {
}

interface State {
  open: boolean;
  campain: CampainIndex;
  campainIndex: number;

  editingPlayer: number;
}

export default class Campains extends React.Component<Props, State> {
  upload: (c: CampainIndex | null, idx: number) => void;
  constructor(props: Props) {
    super(props);

    this.state = {
      open: false,
      campain: {
        name: "",
        file: "",
        players: [],
      },
      campainIndex: 0,
      editingPlayer: -1,
    }

    this.upload = (c: CampainIndex | null, idx: number) => {}
  }

  editPlayer = (idx: number) => {
    this.setState({
      editingPlayer: idx,
    })
  }

  closePlayerEditor = (c?: CampainIndex) => {
    const { editingPlayer } = this.state;
    const campain = c ? c : this.state.campain;

    this.upload(campain, editingPlayer);
    this.setState({
      editingPlayer: -1
    })
  }

  closeMenu = () => {
    this.setState({open: false});
  }

  update = () => {
    this.setState({});
  }

  deleteCampaign = () => {
    this.upload(null, this.state.editingPlayer);
    this.setState({
      editingPlayer: -1,
      open: false,
    })
  }

  render() {
    const {open, campain, editingPlayer} = this.state;

    return <Container>
      <CampainList {...this.props} onClick={(e: React.MouseEvent<HTMLElement>, campain: CampainIndex, upload: (c?: CampainIndex | null, idx?: number) => void, idx: number) => {
        this.setState({open: true, campain: campain, campainIndex: idx});
        this.upload = upload;
      }
      }/>

      <Dialog open={open}>
        <DialogContent>
          <h3>Edit: {campain?.name}
            <IconButton sx={{float: "right"}} color="error" onClick={this.deleteCampaign}>
              <Delete/>
            </IconButton>
          </h3>
        </DialogContent>
        <TabBar sx={{marginTop: -1}} labels={["Add Player", "View Players"]} childProps={{
        }}>
          <AddPlayer campain={campain} close={this.closeMenu} update={this.update}/>
          <ViewPlayers campain={campain} close={this.closeMenu} editPlayer={this.editPlayer}/>
        </TabBar>
      </Dialog>

      <PlayerEditor open={true} campain={campain} idx={editingPlayer} update={this.update} close={this.closePlayerEditor}/>
    </Container>
  }
}
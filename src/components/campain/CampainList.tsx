import * as React from "react";
import { IToken } from "../../Login/UseToken";
import { CampainIndex, loadCamapins } from "./Campain";
import CampainListElement from "./CampainListElement";
import SearchableList, { Element } from "../SearchableList";
import { Button, Card, CardActions, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { writePrivateData } from "../../Login/ServerApi";
import Loading from "../Loading";

interface Props extends IToken {
  onClick?: (e: React.MouseEvent<HTMLElement>, id: CampainIndex, upload: (c?: CampainIndex | null, idx?: number) => void, idx: number) => void;
}

interface State {
  campains?: Element[];
  addCampainsOpen: boolean;

  newCampainName?: string;
}

export default class CampainList<T={}> extends React.Component<Props & T, State> {
  campainList: CampainIndex[]

  constructor(props: Props & T) {
    super(props);

    this.state = {
      addCampainsOpen: false,
    }

    this.campainList = [];
  }

  componentDidMount(): void {
    this.load();
  }

  async load() {
    this.campainList = await loadCamapins(this.props.token);
    this.setState({
      campains: this.campainList.map(this.buildCampain)
    });
  }

  buildCampain = (val: CampainIndex, idx: number) => {
    return {
      item: <CampainListElement {...val} onClick={(e: React.MouseEvent<HTMLElement>, id: CampainIndex) => this.props.onClick ? this.props.onClick(e, id, this.upload, idx) : null}/>,
      key: val.name,
    } as Element
  }

  addCampain = () => {
    const { campains, newCampainName } = this.state;
    if (campains && newCampainName) {
      this.campainList.push({
        name: newCampainName,
        file: newCampainName,
        players: []
      })

      this.sendUpload();

      this.setState({
        addCampainsOpen: false,
        campains: this.campainList.map(this.buildCampain),
      })
    }
  }

  upload = (c?: CampainIndex | null, idx?: number) => {
    if (c !== undefined && idx) {
      if (c === null) {
        this.campainList = this.campainList.splice(idx, 1);
      }
      else {
        this.campainList[idx] = c;
      }
    }
    this.sendUpload();
  }

  sendUpload = () => {
    const { token } = this.props;
    if (token) {
      writePrivateData(token, "other", token.username, "campains", this.campainList);
    }
  }

  openCampainAdd = () => {
    this.setState({
      newCampainName: undefined,
      addCampainsOpen: true,
    })
  }

  render() {
    const { campains, addCampainsOpen } = this.state;
    return <Card variant="outlined">
      <CardHeader title="Campains"/>

      <CardActions sx={{justifyContent: "right"}}>
        <Button variant="outlined" onClick={this.openCampainAdd}>
          Add Campain
        </Button>
      </CardActions>
      <CardContent>
        {
          campains ? <SearchableList elements={campains}/> : <Loading/>
        }
      </CardContent>

      <Dialog open={addCampainsOpen}>
        <DialogTitle>
          Add Compain
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a new Campain
          </DialogContentText>
          <TextField label="name" variant="standard" onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({newCampainName: e.target.value})}/>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={this.addCampain}>
            Add
          </Button>
          <Button color="error" variant="outlined" onClick={()=> this.setState({addCampainsOpen: false})}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  }
}
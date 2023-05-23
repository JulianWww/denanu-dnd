import * as React from "react";
import Spell from "./Spell";
import { Params } from "react-router-dom";
import { LocationData, loadSpell, locationDataEquals, toUrl } from "../../Login/ServerApi";
import { IToken } from "../../Login/UseToken";
import Loading from "../Loading";
import TextWraper from "../TextWraper";
import "./css/style.css";
import { Button, ButtonGroup, Card, CardContent, Chip, Collapse, Divider, Typography, TypographyProps } from "@mui/material";
import { Center, ordinal_suffix_of } from "../Utils";
import { toList } from "../monsters/Utility/ConditionsListing";
import { Grid } from "semantic-ui-react";
import { Markup } from "interweave";
import { SlideTransition } from "../SlideTransition";
import SpellEditor from "./SpellEditor";
import RightAlign from "../RightAlign";
import NavigateButton from "../NavitageButton";
import { renderTime } from "../monsters/data/Time";


interface Props extends IToken{
  location: LocationData;
  open?: boolean;
}

interface State {
  spell?: Spell;
  location: LocationData;
  editing: boolean;
}

export default class SpellRenderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      location: props.location,
      editing: false,
    }
  }

  componentDidMount(): void {
    this.load();
  }

  async load() {
    const {token, location} = this.props;
    const {group, source, name} = location;

    const spell = await loadSpell(group, source, name, token);
    
    this.setState({
      spell: spell,
      location: location
    })
  }

  render() {
    const { spell, editing } = this.state;
    const { open } = this.props;


    if (!locationDataEquals(this.state.location, this.props.location)) {
      this.load();
    }

    const components = [];
    if (spell) {
      const { material, verbal, somatic } = spell.components;
      if (verbal) components.push("V");
      if (somatic) components.push("S");
      if (material) components.push("M");
    }

    return (
      <SlideTransition id={toUrl(this.props.location)}>
      <Card sx={{ml:0.5}}>
        <CardContent>
          <TextWraper>
            <h2 className="spellHeader">{spell?.name}</h2>
          </TextWraper>
        </CardContent>
        <Divider/>
        <CardContent>
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                <Subheader>Level</Subheader>
                {ordinal_suffix_of(spell?.level)}
              </Grid.Column>
              <Grid.Column width={4}>
                <Subheader>Casting Time</Subheader>
                {spell?.castingTime}
              </Grid.Column>
              <Grid.Column width={4}>
                <Subheader>Range</Subheader>
                {spell?.range}
              </Grid.Column>
              <Grid.Column width={4}>
                <Subheader>Components</Subheader>
                {toList(components)}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={4}>
                <Subheader>Duration</Subheader>
                {renderTime(spell)}
              </Grid.Column>
              <Grid.Column width={4}>
                <Subheader>School</Subheader>
                {spell?.school}
              </Grid.Column>
              <Grid.Column width={4}>
                <Subheader>Save</Subheader>
                {toList(spell?.savingThrows)}
              </Grid.Column>
              <Grid.Column width={4}>
                <Subheader>Damge Type</Subheader>
                {toList(spell?.damageTypes)}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </CardContent>
        <Divider/>
        <CardContent>
          <Markup content={spell?.description}/>
          {
            spell?.atHigherLevels !== "" ?
            <>
              <TextWraper>
                <h4 className="spellHeader">At Higher Levels</h4>
              </TextWraper>
              <Markup content={spell?.atHigherLevels}/>
            </>
            : null
          }
          <Typography sx={{
            mt:2,
            color: "gray",
            textAlign: "center",
            fontSize: "0.8em"
          }}>
            {spell?.sourcePage}
          </Typography>
          <Center>
            {
              spell?.availableClasses.map((cls: string) => <ClassChip key={cls} name={cls}/>)
            }
          </Center>
        </CardContent>
      </Card>
      <RightAlign>
        <ButtonGroup>
          {
            open ?
            <NavigateButton url={toUrl(this.props.location)}>Open</NavigateButton>
            :
            <Button onClick={()=>this.setState({editing: !editing})}>Edit</Button>
          }
        </ButtonGroup>
      </RightAlign>
      <Collapse in={editing && spell !== undefined}>
        {
          spell ?
          <SpellEditor spell={spell} update={()=>this.setState({})}/>
          :
          null
        }
      </Collapse>
      </SlideTransition>
    )
  }
}

interface ClassChipProps {
  name: string;
}

function ClassChip(props: ClassChipProps) {
  const { name } = props;

  return <Chip 
    label={name}
    key={name}
    sx={{m:0.5}}
    avatar={<img className="classNameIcon" src={process.env.PUBLIC_URL + "/assets/classes/" + name.toLowerCase() + ".png"}/>}
  />
}

function Subheader(props: TypographyProps) {
  return <Typography variant="subtitle2" {...props}></Typography>
}

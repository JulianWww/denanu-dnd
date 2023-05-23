import { Box, Button, ButtonGroup } from "@mui/material";
import SearchableList, {Element, SearchableListProps} from "./SearchableList";
import NumberInput from "./visualEditor/Nodes/Utility/NumberInput";
import MultiSelectString from "./MultiSelect";
import { SpellElement } from "../pages/SpellList";
import magicSchools from "./spells/data/magicSchools";
import { arrayCast, unique } from "./Utils";

interface Props {
}


export default class SpellSearchableList extends SearchableList<Props> { 
  min_lvl: number; 
  max_lvl: number;
  schools: string[];
  ritual?: boolean;
  concentration?: boolean;
  selectedSources: string[];

  sources: string[];

  constructor(props: SearchableListProps & Props) {
    super(props);

    this.min_lvl = 0;
    this.max_lvl = 9;
    this.schools = [];
    this.selectedSources = [];

    this.sources = unique(arrayCast<SpellElement, Element>(props.elements).map((val: SpellElement) => val.source))
  }

  update = () => this.setState({});

  filterList() {
    var filtered = this.props.elements.map((val: Element) => val as SpellElement);

    filtered = filtered.filter((val: SpellElement) => 
      val.lvl >= this.min_lvl && val.lvl <= this.max_lvl
    );

    if (this.schools?.length > 0) {
      filtered = filtered.filter((val: SpellElement) => 
        this.schools.indexOf(val.school.toLowerCase()) > -1
      );
    }

    if (this.ritual !== undefined) {
      filtered = filtered.filter((val: SpellElement) =>
        val.ritual === this.ritual
      );
    }

    if (this.concentration !== undefined) {
      filtered = filtered.filter((val: SpellElement) =>
        val.concentration === this.concentration
      );
    }

    if (this.selectedSources?.length > 0) {
      filtered = filtered.filter((val: SpellElement) =>
        this.selectedSources.indexOf(val.source) > -1
      )
    }

    this.filtered = filtered    
    super._fillter();
  }

  static tripleCycleText(val?: boolean){
    if (val === undefined) return "Any";
    if (val) {
      return "Yes";
    }
    return "No";
  }

  static trippleCycleNext(val?: boolean) {
    if (val === undefined) return true;
    if (val) {
      return false;
    }
    return undefined;
  }

  customElements() {
    return <>
      <Box className="row" sx={{mt: 2}}>
        <NumberInput setNumber={(min: number)=> {
            this.max_lvl = Math.max(this.max_lvl, min);
            this.min_lvl = min;
            this.update();
          }} 
          label="Min Level"
          val={this.min_lvl}
        />
        <NumberInput setNumber={(max: number) => {
            this.min_lvl = Math.min(this.min_lvl, max);
            this.max_lvl = max;
            this.update();
          }}
          label="Max Level"
          val={this.max_lvl}
        />
      </Box>
      <div className="row">
        <MultiSelectString
          value={this.schools} 
          options={magicSchools} 
          onChange={(val: string[]) => {
            this.schools = val;
            this.update()
          }}
          label="Schools"
        />
        <ButtonGroup>
          <Button onClick={() =>{
            this.ritual = SpellSearchableList.trippleCycleNext(this.ritual);
            this.update();
          }}>
            Rituals: { SpellSearchableList.tripleCycleText(this.ritual) }
          </Button>
          <Button onClick={() =>{
            this.concentration = SpellSearchableList.trippleCycleNext(this.concentration);
            this.update();
          }}>
            Concentration: { SpellSearchableList.tripleCycleText(this.concentration) }
        </Button>
        </ButtonGroup>
      </div>
      <div className="row">
        <MultiSelectString
          options={this.sources}
          label="Sources"
          onChange={(val: string[]) => {
            this.selectedSources = val;
            this.update();
          }}
          value={this.selectedSources}
        />
      </div>
    </>;
  }
}
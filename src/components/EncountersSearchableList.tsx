import SearchableList, {Element, SearchableListProps} from "./SearchableList";
import { EncounterIndex } from "./encounters/Encounter";
import CampainSelector from "./campain/CamapaingSelector";
import { IToken } from "../Login/UseToken";
import { getDefaultCampainList } from "./campain/useCampain";

export interface EncounterElement extends Element, EncounterIndex {
}

interface Props extends IToken {

}

export default class EncountersSearchableList extends SearchableList<Props> { 
  campain?: string | null;

  constructor(props: SearchableListProps & Props) {
    super(props);

    
    this.campain = getDefaultCampainList();
  }

  update = () => this.setState({});

  filterList() {
    var filtered = this.props.elements.map((val: Element) => val as EncounterElement);
    if (this.campain) {
      filtered = filtered.filter((val: EncounterElement) => {
          return val.campain === this.campain;
        }
      );
    }

    this.filtered = filtered
    
    super._fillter();
  }

  customElements() {
    return <div className="row">
      <CampainSelector token={this.props.token} setToken={this.props.setToken} onValueStringChange={(val: string | null) => {
          this.campain = val;
          this.update();
        }}
        value={this.campain}
        error={false}
      />
    </div>
  }
}
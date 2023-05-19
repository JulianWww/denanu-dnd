import * as React from "react";
import {levenshteinEditDistance} from 'levenshtein-edit-distance';
import ListItem from '@mui/material/ListItem';
import { Card, TextField } from "@mui/material";
import { FixedSizeList, ListChildComponentProps } from 'react-window';

export interface Element{
  key: string;
  item: JSX.Element;
  distance?: number
}

export interface SearchableListProps{
  fluid?: boolean;
  elements: Element[];
  height?: number;
  itemSize?: number;
}

interface State {
  searchValue: string;
}

export default class SearchableList<P={}> extends React.Component<SearchableListProps & P, State> {
  filtered: Element[];

  constructor(props: SearchableListProps & P) {
    super(props);

    this.state = {
      searchValue: ""
    }

    this.filtered = [];
    this.filterList();
  }

  maxDistance() {
    return 1 + this.state.searchValue.length / 3
  }

  filterList() {
    this.filtered = this.props.elements;
    this._fillter();
  }

  _fillter() {
    this.filtered = this.filtered.filter((val: Element ) => {
      val.distance = levenshteinEditDistance(val.key.substring(0, this.state.searchValue.length).toLowerCase(), this.state.searchValue.toLocaleLowerCase());
      return val.distance < this.maxDistance();
    })

    this.filtered.sort((a: Element, b: Element) => {
      if (a.distance && b.distance)
        return a.distance-b.distance;
      
      return 0
    })
  }

  static renderRow(list: SearchableList) {return (props: ListChildComponentProps) => {
    const { index, style } = props;
    const element = list.filtered[index];
  
    return (
      <ListItem style={style} key={element.key} component="div">
        {element.item}
      </ListItem>
    );
  }}

  customElements() : React.ReactNode{
    return null
  }

  render(){
    this.filterList();

    const { elements, fluid, ...listProps } = this.props;
    return (
      <Card variant="outlined">
        <div className="searchListOutline">
         <TextField fullWidth label="Search"
            placeholder='Search...'
            variant="standard"
            onChange={(e) => {
              this.setState({searchValue: e.target.value})
            }}
          />
          {this.customElements()}
          <Card className="fluid seachListList" variant="outlined">
            <div className="searchListOutline inner">
              <FixedList list={this} {...listProps}/>
            </div>
          </Card>
        </div>
      </Card>
    );
  }
}

interface ListProps<P> {
  list: SearchableList<P>;
  height?: number;
  itemSize?: number;
}
function FixedList<P>(props: ListProps<P>) {
  const { list } = props;
  const [height, setHeight] = React.useState<number>(window.innerHeight);

  React.useEffect(() => {

    function handleResize() {
      setHeight(window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => 
      window.removeEventListener('resize', handleResize)
  })

  return <FixedSizeList
    height={props.height ? props.height : height}
    width="100%"
    itemSize={props.itemSize ? props.itemSize : 60}
    itemCount={list.filtered.length}
    overscanCount={5}
  >
    {SearchableList.renderRow(list)}
  </FixedSizeList>
}
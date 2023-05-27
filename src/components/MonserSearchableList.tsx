import SearchableList, {Element, SearchableListProps} from "./SearchableList";
import { MenuItem, TextField } from "@mui/material";
import { CRs, alignments, sizes, types } from "./monsters/BlockEditor";
import { MonsterIndex } from "../pages/SelectMonserStatBlock";
import { ReactNode } from "react";
import MultiSelectString from "./MultiSelect";
import numericQuantity from "numeric-quantity";

export interface MonserElement extends Element, MonsterIndex {}

export default class SearchableMonsterList extends SearchableList {
  sizes: string[];
  type: string[];
  alignment: string[];
  minCr: number;
  maxCr: number;
  selectedSource: string[];

  sources: string[];

  constructor(props: SearchableListProps) {
    super(props);

    this.sizes = [];
    this.type = [];
    this.alignment = [];
    this.minCr = 0;
    this.maxCr = 30;
    this.selectedSource = [];

    this.sources = Array.from(new Set(props.elements.map((val: Element) => (val as MonserElement).idx.displayName).filter((val?: string) => val) as string[]));
  }

  update = () => this.setState({});

  filterList() {
    var filtered = this.props.elements.map((val: Element) => val as MonserElement);

    if (this.selectedSource?.length > 0) {
      filtered = filtered.filter((val: MonsterIndex) => {
        return val.idx.displayName && this.selectedSource.indexOf(val.idx.displayName) > -1
      })
    }

    if (this.sizes?.length > 0) {
      filtered = filtered.filter((val: MonserElement) => {
          return this.sizes.indexOf(val.size.toLocaleLowerCase()) > -1
        }
      );
    }

    if (this.type?.length > 0) {
      filtered = filtered.filter((val: MonserElement) => {
          return this.type.indexOf(val.type.toLocaleLowerCase()) > -1
        }
      );
    }

    if (this.alignment?.length > 0) {
      filtered = filtered.filter((val: MonserElement) => {
          return this.alignment.indexOf(val.alignment.toLocaleLowerCase()) > -1
        }
      );
    }

    filtered = filtered.filter((val: MonserElement) => {
      return this.minCr <= val.cr && val.cr <= this.maxCr;
    });

    this.filtered = filtered
    
    super._fillter();
  }

  customElements(): ReactNode {
    
    return <>
    <div className="row">
      <TextField select fullWidth label="Min Cr" value={this.minCr} variant="standard" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {this.minCr = numericQuantity(e.target.value); this.maxCr = Math.max(this.minCr, this.maxCr); this.update()}}>
        {CRs.map((option: string) => (
          <MenuItem value={numericQuantity(option)} key={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <TextField select fullWidth label="Max Cr" value={this.maxCr} variant="standard" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {this.maxCr = numericQuantity(e.target.value); this.minCr = Math.min(this.minCr, this.maxCr); this.update()}}>
        {CRs.map((option: string) => (
          <MenuItem value={numericQuantity(option)} key={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <MultiSelectString
        options={sizes}
        value={this.sizes}
        onChange={(val: string[]) => {this.sizes = val; this.update()}}
        label="Size"
      />
    </div>
    <div className="row">
      <MultiSelectString
        options={types}
        value={this.type}
        onChange={(val: string[]) => {this.type = val; this.update()}}
        label="Type"
      />
      <MultiSelectString
        options={alignments}
        value={this.alignment}
        onChange={(val: string[]) => {this.alignment = val; this.update()}}
        label="Alignment"
      />
      <MultiSelectString
        options={this.sources}
        value={this.selectedSource}
        onChange={(val: string[]) => {this.selectedSource = val; this.update()}}
        label="Source"
      />
    </div>
    <div className="list-length-indicator">
      found: {this.filtered.length}
    </div>
  </>
  }
}
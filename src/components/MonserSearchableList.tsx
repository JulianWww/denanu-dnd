import SearchableList, {Element, SearchableListProps} from "./SearchableList";
import { Box, Card, Chip, FormControl, InputLabel, MenuItem, Checkbox, Select, SelectChangeEvent, TextField } from "@mui/material";
import { FixedSizeList } from 'react-window';
import {levenshteinEditDistance} from 'levenshtein-edit-distance';
import { CRs, alignments, sizes, types } from "./monsters/BlockEditor";
import { MonsterIndex } from "../pages/SelectMonserStatBlock";
import { renderSelected } from "./Utils";
import { ReactNode } from "react";

export interface MonserElement extends Element, MonsterIndex {
}

export default class SearchableMonsterList extends SearchableList {
  sizes: string[];
  type: string[];
  alignment: string[];
  minCr: number;
  maxCr: number

  constructor(props: SearchableListProps) {
    super(props);

    this.sizes = [];
    this.type = [];
    this.alignment = [];
    this.minCr = 0;
    this.maxCr = 30;
  }

  update = () => this.setState({});

  filterList() {
    var filtered = this.props.elements.map((val: Element) => val as MonserElement);

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
    console.log("Hi")
    return <>
    <div className="row">
      <TextField select label="Min Cr" value={this.minCr} variant="standard" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {this.minCr = eval(e.target.value); this.maxCr = Math.max(this.minCr, this.maxCr); this.update()}}>
        {CRs.map((option: string) => (
          <MenuItem value={eval(option)} key={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <TextField select label="Max Cr" value={this.maxCr} variant="standard" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {this.maxCr = eval(e.target.value); this.minCr = Math.min(this.minCr, this.maxCr); this.update()}}>
        {CRs.map((option: string) => (
          <MenuItem value={eval(option)} key={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <FormControl variant="standard">
        <InputLabel>Size</InputLabel>
        <Select multiple value={this.sizes} variant="standard" renderValue={renderSelected}
          onChange={(event: SelectChangeEvent<string[]>) => { var val = event.target.value; if (typeof val === "string") {val = [val]}; this.sizes = val; this.update();}}
        >
          {sizes.map((option: string) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={this.sizes.indexOf(option) > -1} />
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
    <div className="row">
      <FormControl variant="standard">
        <InputLabel>Type</InputLabel>
        <Select multiple value={this.type} variant="standard" renderValue={renderSelected}
          onChange={(event: SelectChangeEvent<string[]>) => { var val = event.target.value; if (typeof val === "string") {val = [val]}; this.type = val; this.update();}}
        >
          {types.map((option: string) => (
            <MenuItem value={option} key={option}>
              <Checkbox checked={this.type.indexOf(option) > -1} />
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="standard">
        <InputLabel>Alignment</InputLabel>
        <Select multiple value={this.alignment} variant="standard" renderValue={renderSelected}
          onChange={(event: SelectChangeEvent<string[]>) => { var val = event.target.value; if (typeof val === "string") {val = [val]}; this.alignment = val; this.update();}}
        >
          {alignments.map((option: string) => (
            <MenuItem value={option} key={option}>
              <Checkbox checked={this.alignment.indexOf(option) > -1} />
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
    <div className="list-length-indicator">
      found: {this.filtered.length}
    </div>
  </>
  }
}
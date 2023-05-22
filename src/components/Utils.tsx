import { Box, BoxProps, Button, Chip } from "@mui/material";
import { RefObject } from "react";
import { IToken } from "../Login/UseToken";
import { useNavigate } from "react-router-dom";
import RightAlign from "./RightAlign";
import { randomFileName, writePrivateData } from "../Login/ServerApi";

const domtoimage = require('dom-to-image-more');

const Dice = require('dice-notation-js');

export function AttributeToMod(ablity: number) {
  return toDnDString(Math.floor((ablity - 10)/2));
}

export function toDnDString(val: number) {
  if (!val) {
    return "";
  }
  if (val > 0) {
    return "+" + val.toString();
  }
  return val.toString();
}

export function evaluteDiceMacro(str: string) {
  try {
    console.log(str);
    console.log(Dice(str))
    return Dice(str);
  } catch (e) {
    return NaN
  }
}

export function renderSelected(selected: string[]) {
  return  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
    {selected.map((value) => (
      <Chip key={value} label={value} />
    ))}
  </Box>
}


export function add(a: number, b: number) {return a+b}

export function sortedIndex<T>(array: T[], value: T, comp: (a: T, b: T) => number) {
  var low = 0,
      high = array.length;

  while (low < high) {
      var mid = (low + high) >>> 1;
      if (comp(array[mid], value) < 0) low = mid + 1;
      else high = mid;
  }
  return low;
}

export default function printDiv(ref: RefObject<HTMLElement>, name: string) {
  const mywindow = window.open(name, "PRINT");

  if (ref.current && mywindow) {
    // at src document
    const rules = Array.from(document.styleSheets)
    .map((sheet: CSSStyleSheet) => 
      Array.from(sheet.cssRules).map(rule => rule.cssText)
    )
    .reduce((sum: string[], sheet: string[]) => {
      // errors in CORS at some sheets (e.g. qiita)
      // like: "Uncaught DOMException: Failed to read the 'cssRules' property from 'CSSStyleSheet': Cannot access rules"
      try {
        return [...sum, ...sheet];
      } catch(e) {
        // console.log('errored', e);
        return sum;
      }
    }, []);

    mywindow.document.write('<html><head></head><body >');
    mywindow.document.write(ref.current.innerHTML);
    mywindow.document.write('</body></html>');

    // at dst document
    const head = mywindow.document.querySelector('head') as HTMLHeadElement;
    const newSheet = head.appendChild(document.createElement('style')).sheet as CSSStyleSheet;
    rules.forEach((rule: string, idx: number) => {
      try {
        newSheet.insertRule(rule, idx)
      }
      catch(e) {

      }
    });
    

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
  }
  return false;
}

export function toPng(ref: RefObject<HTMLElement>, name: string) {
  domtoimage.toJpeg(ref.current, { quality: 0.95 })
    .then(function (dataUrl: string) {
        var link = document.createElement('a');
        link.download = name + '.jpeg';
        link.href = dataUrl;
        link.click();
    });
}


export function ordinal_suffix_of(i?: number) {
  if (i === undefined) {return null}
  var j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
      return i + "st";
  }
  if (j == 2 && k != 12) {
      return i + "nd";
  }
  if (j == 3 && k != 13) {
      return i + "rd";
  }
  return i + "th";
}

export function Center(props: BoxProps) {
  const {sx, ...other} = props;
  return <Box {...other} sx={{justifyContent: "center", display: "flex", ...sx}}/>
}

export interface NewCustomItemCreatorProps extends IToken {
  group: string,
  value: any,
  idx: Record<string, any>;
}

export function NewCustomItemCreator(props: NewCustomItemCreatorProps) {
  const { token, group, value, idx } = props;

  const nav = useNavigate();
  if (token) {
    return (
      <RightAlign>
        <Button onClick={() => nav("/encounter-planer")} sx={{mr: 1}}>
          Build Encounter
        </Button>
        <Button 
          onClick={() => {
            if(token) {
              const filename = randomFileName();
              writePrivateData(token, group, token.username, filename, value, idx);
              nav("private/" + token.username + "/" + filename)
            }
          }}
        >
          Add
        </Button>
      </RightAlign>
    )
  }
  return null;
}

export function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export function arrayCast<T extends F, F>(arr: F[]) {
  return arr.map((val: F) => {
    return val as T
  })
}
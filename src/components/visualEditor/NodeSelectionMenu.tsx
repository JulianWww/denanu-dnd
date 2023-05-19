import { XYPosition } from "reactflow";
import SearchableList, {Element} from "../SearchableList"
import Editor, {nodeTypes} from "./Editor"
import {
  useReactFlow,
} from 'reactflow';
import { Button, ClickAwayListener, Collapse } from "@mui/material";
import { useState } from "react";

interface Props {
  visible: boolean;
  pos: XYPosition;
  editor: Editor;
}


interface NodeElement extends Element {

}


export default function NodeSelectionMenu(props: Props) {
  const {visible, pos, editor} = props;

  const [initPos, setInitPos] = useState(pos);
  const [isVisible, setIsVisible] = useState(false);


  const { project } = useReactFlow();
  
  const addNode = (type: string) => {
    const {editor, pos} = props;
    const {x, y} = pos;
    const { top, left } = editor.flow.current.getBoundingClientRect();
    const id = editor.getId().toString();
    
    const newNode = {
      id: id,
      
      // we are removing the half of the node width (75) to center the new node
      position: project({ x: x - left - 75, y: y - top }),
      data: {
        set: editor.setNodeState(id),
        get: editor.getNodeState(id),
        editor: editor
      },
      type: type
    };

    editor.addNode(newNode);
    editor.closeContextMenu();
  }

  const genElements = () => {
    var elements = new Array<NodeElement>();
    for (const key in nodeTypes) {
      if (key != "init") {
        const callback = () => {
          addNode(key)
        }

        elements.push(
          {
            key: key,
            item: <Button fullWidth onClick={callback}>
              {key}
            </Button>
          }
        );
      }
    }
    return elements;
  }

  if (!isVisible) {
    if (pos.x !== initPos.x && pos.y !== initPos.y) {
      setInitPos(pos);
    }
  }

  if (visible !== isVisible) {
    setIsVisible(visible);
  }

  // transform: "translateY(" + (pos.y - initPos.y) + "px) translateX(" + (pos.x - initPos.x) + "px)", 
  
  return (
    <ClickAwayListener onClickAway={() => editor.closeContextMenu()}>
      <div className="node-selection-menu moveAnimation" style={{transform: "translateY(" + (pos.y - initPos.y) + "px) translateX(" + (pos.x - initPos.x) + "px)", left: initPos.x, top: initPos.y}}>
        <Collapse in={visible}>
          <SearchableList elements={genElements()} height={400} itemSize={40}/>
        </Collapse>
      </div>
    </ClickAwayListener>
  )
}
import { useTheme } from "@mui/material";
import { StrictMode } from "react";
import {
  DragDropContext,
  Droppable,
  DroppableProps,
  Draggable,
  DropResult
} from 'react-beautiful-dnd';
import { useEffect, useState } from "react";

const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);  if (!enabled) {
    return null;
  }  return <Droppable {...props}>{children}</Droppable>;
};



interface ListProps<T> {
  id: string;
  items: T[];
  setItems: (vals: T[]) => void;
  render: (val: T)=>JSX.Element;
  idProvider: (val: T)=>string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function DraggableList<T>(props: ListProps<T>) {
  const { setItems, id, idProvider, items, render } = props;

  const end = ({ destination, source }: DropResult) => {
    if (!destination) return;

    const newItems = reorder(items, source.index, destination.index);
    setItems(newItems);
  };

  const theme = useTheme();

  return <StrictMode>
    <DragDropContext onDragEnd={end}>
      <StrictModeDroppable droppableId="droppable">
        {
          (provider, snapshot) => (
            <div 
              {...provider.droppableProps}
              ref={provider.innerRef}
            >
              {
                items.map((item: T, idx: number)=> {
                  const id = idProvider(item);

                  return <Draggable key={id} draggableId={id} index={idx}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          background: snapshot.isDragging ? theme.palette.action.hover: "#ffffff00"
                        }}
                      >
                        {render(item)}
                      </div>
                    )}
                  </Draggable>
                })
              }
              {provider.placeholder}
            </div>
          )
        }
      </StrictModeDroppable>
    </DragDropContext>
  </StrictMode>
}

import { useState } from "react";
import {
  useDraggable,
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

// Draggable component
function Draggable({ id, position }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  const style = {
    transform: isDragging
      ? CSS.Translate.toString({
          x: position.x + (transform?.x || 0),
          y: position.y + (transform?.y || 0),
        })
      : `translate3d(${position.x}px, ${position.y}px, 0)`,
    touchAction: "none",
  };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {id}
    </button>
  );
}

// App component
function DragAndDrop() {
  const [positions, setPositions] = useState({
    "drag-handle-1": { x: 0, y: 0 },
    "drag-handle-2": { x: 0, y: 0 },
  });

  const handleDragEnd = (event) => {
    const { active, delta } = event;
    setPositions((prevPositions) => {
      const newPosition = {
        x: prevPositions[active.id].x + delta.x,
        y: prevPositions[active.id].y + delta.y,
      };
      return {
        ...prevPositions,
        [active.id]: newPosition,
      };
    });
  };

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  );

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="App">
        <h3>Test Drag And Drop</h3>
        <Draggable id="drag-handle-1" position={positions["drag-handle-1"]} />
        <Draggable id="drag-handle-2" position={positions["drag-handle-2"]} />
      </div>
    </DndContext>
  );
}

export default DragAndDrop;

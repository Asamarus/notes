import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableProvidedDragHandleProps,
} from 'react-beautiful-dnd';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function lockAxis(style) {
  if (style?.transform) {
    const axisLockY = `translate(0px, ${style.transform.split(',').pop()}`;
    return {
      ...style,
      transform: axisLockY,
    };
  }
  return style;
}

export interface SortableListProps {
  /** List items */
  items: any[];
  /** On sort end */
  onSortEnd: (ids: any[]) => void;
  /** Render item */
  renderItem: (id: any, dragHandleProps: DraggableProvidedDragHandleProps) => React.ReactNode;
}

function SortableList({ items, onSortEnd, renderItem }: SortableListProps) {
  const portalRef = useRef(null);

  useEffect(() => {
    const portalDiv = document.createElement('div');
    document.body.appendChild(portalDiv);
    portalRef.current = portalDiv;

    return () => {
      document.body.removeChild(portalDiv);
    };
  }, []);

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) => {
        // dropped outside the list
        if (!destination) {
          return;
        }

        const newItems = reorder(items, source.index, destination.index) as number[];
        onSortEnd(newItems);
      }}>
      <Droppable droppableId="dnd-list">
        {(droppableProvided) => (
          <div {...droppableProvided.droppableProps} ref={droppableProvided.innerRef}>
            {items.map((id, index) => (
              <Draggable key={id} index={index} draggableId={`${id}`}>
                {(draggableProvided, draggableSnapshot) => {
                  const itemNode = (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      //{...draggableProvided.dragHandleProps}
                      style={lockAxis(draggableProvided.draggableProps.style)}>
                      {renderItem(id, draggableProvided.dragHandleProps)}
                    </div>
                  );

                  if (draggableSnapshot.isDragging) {
                    return createPortal(itemNode, portalRef.current);
                  }

                  return itemNode;
                }}
              </Draggable>
              //
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default SortableList;

import { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';

interface OrderItem {
  id: string;
  content: string;
}

interface OrderInteractionProps {
  id: string;
  prompt: string;
  items: OrderItem[];
  orientation?: 'vertical' | 'horizontal';
  mode?: 'edit' | 'preview' | 'response';
  onChange?: (orderedIds: string[]) => void;
  correctOrder?: string[];
}

export default function OrderInteraction({
  id,
  prompt,
  items,
  orientation = 'vertical',
  mode = 'preview',
  onChange,
  correctOrder = [],
}: OrderInteractionProps) {
  const [orderedItems, setOrderedItems] = useState<OrderItem[]>(items);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || mode === 'preview') return;

    const newItems = Array.from(orderedItems);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setOrderedItems(newItems);
    onChange?.(newItems.map((item) => item.id));
  };

  return (
    <div className="qti-order-interaction">
      <div className="mb-4">
        <p className="text-base text-gray-900">{prompt}</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId={`order-${id}`}
          direction={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
        >
          {(provided: DroppableProvided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`${
                orientation === 'horizontal'
                  ? 'flex space-x-4 overflow-x-auto'
                  : 'space-y-2'
              }`}
            >
              {orderedItems.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                  isDragDisabled={mode === 'preview'}
                >
                  {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-4 rounded-md border ${
                        snapshot.isDragging
                          ? 'border-primary-500 bg-primary-50 shadow-lg'
                          : 'border-gray-300 bg-white'
                      } ${
                        mode === 'preview'
                          ? 'cursor-default'
                          : 'cursor-move hover:border-gray-400'
                      } ${orientation === 'horizontal' ? 'flex-shrink-0' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500">{index + 1}.</span>
                        <span className="text-sm text-gray-900">
                          {item.content}
                        </span>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {mode === 'edit' && correctOrder.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Correct Order
          </h4>
          <div className="space-y-2">
            {correctOrder.map((itemId, index) => (
              <div
                key={itemId}
                className="flex items-center space-x-3 text-sm text-gray-600"
              >
                <span>{index + 1}.</span>
                <span>
                  {items.find((item) => item.id === itemId)?.content}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'preview' && (
        <div className="mt-4 text-sm text-gray-500">
          Drag items to arrange them in the correct order
        </div>
      )}
    </div>
  );
} 

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface OrderItem {
  id: string;
  content: string;
}

interface OrderInteractionProps {
  prompt: string;
  items: OrderItem[];
  correctOrder?: string[];
  mode?: 'edit' | 'preview' | 'response';
  onChange?: (orderedIds: string[]) => void;
}

export default function OrderInteraction({
  prompt,
  items,
  correctOrder = [],
  mode = 'preview',
  onChange,
}: OrderInteractionProps): React.ReactElement {
  const [orderedItems, setOrderedItems] = useState<OrderItem[]>(items);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || mode === 'preview') return;

    const newItems = Array.from(orderedItems);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setOrderedItems(newItems);
    onChange?.(newItems.map(item => item.id));
  };

  const checkOrder = () => {
    setShowFeedback(true);
  };

  const isCorrectPosition = (index: number, itemId: string) => {
    if (!showFeedback || !correctOrder) return undefined;
    return correctOrder[index] === itemId;
  };

  return (
    <div className="qti-order-interaction">
      <div className="mb-4">
        <p className="text-base text-gray-900">{prompt}</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="order-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {orderedItems.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                  isDragDisabled={mode === 'preview'}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-4 rounded-lg border ${
                        snapshot.isDragging
                          ? 'bg-gray-50 border-gray-300'
                          : isCorrectPosition(index, item.id) === true
                          ? 'bg-green-50 border-green-500'
                          : isCorrectPosition(index, item.id) === false
                          ? 'bg-red-50 border-red-500'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 mr-3">
                          <span className="text-sm font-medium text-gray-600">
                            {index + 1}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">
                          {item.content}
                        </span>
                        {isCorrectPosition(index, item.id) === true && (
                          <svg
                            className="ml-auto h-5 w-5 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        {isCorrectPosition(index, item.id) === false && (
                          <svg
                            className="ml-auto h-5 w-5 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
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

      {mode === 'response' && correctOrder && (
        <div className="mt-4">
          <button
            type="button"
            onClick={checkOrder}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Check Order
          </button>
        </div>
      )}

      {showFeedback && correctOrder && (
        <div className="mt-4">
          {orderedItems.every(
            (item, index) => item.id === correctOrder[index]
          ) ? (
            <p className="text-sm text-green-600">
              Correct! The items are in the right order.
            </p>
          ) : (
            <p className="text-sm text-red-600">
              Not quite right. Try rearranging the items.
            </p>
          )}
        </div>
      )}
    </div>
  );
} 

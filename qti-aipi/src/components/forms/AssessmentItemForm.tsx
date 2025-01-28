import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addItem, updateItem } from '../../store/slices/questionBankSlice';
import type { AssessmentItem } from '../../types/qti';

interface AssessmentItemFormProps {
  item?: AssessmentItem;
  onSave?: () => void;
  onCancel?: () => void;
}

type InteractionType = 'choice' | 'textEntry' | 'match' | 'order' | 'extendedText';

export default function AssessmentItemForm({
  item,
  onSave,
  onCancel,
}: AssessmentItemFormProps) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(item?.title || '');
  const [interactionType, setInteractionType] = useState<InteractionType>(
    (item?.metadata.interactionType as InteractionType) || 'choice'
  );
  const [prompt, setPrompt] = useState('');

  // Choice Interaction State
  const [choices, setChoices] = useState<Array<{ id: string; content: string; isCorrect: boolean }>>(
    []
  );

  // Text Entry State
  const [correctResponses, setCorrectResponses] = useState<string[]>([]);

  // Match Interaction State
  const [sourceItems, setSourceItems] = useState<Array<{ id: string; content: string }>>([]);
  const [targetItems, setTargetItems] = useState<Array<{ id: string; content: string }>>([]);
  const [correctPairs, setCorrectPairs] = useState<Array<{ sourceId: string; targetId: string }>>([]);

  // Order Interaction State
  const [orderItems, setOrderItems] = useState<Array<{ id: string; content: string }>>([]);
  const [correctOrder, setCorrectOrder] = useState<string[]>([]);

  // Extended Text State
  const [maxLength, setMaxLength] = useState<number | undefined>(undefined);
  const [minLength, setMinLength] = useState<number>(0);
  const [format, setFormat] = useState<'plain' | 'preformatted' | 'xhtml'>('plain');
  const [sampleResponse, setSampleResponse] = useState('');
  const [rubric, setRubric] = useState<Array<{ score: number; description: string }>>([]);

  const handleAddChoice = () => {
    setChoices([...choices, { id: uuidv4(), content: '', isCorrect: false }]);
  };

  const handleChoiceChange = (id: string, field: 'content' | 'isCorrect', value: string | boolean) => {
    setChoices(
      choices.map((choice) =>
        choice.id === id ? { ...choice, [field]: value } : choice
      )
    );
  };

  const handleRemoveChoice = (id: string) => {
    setChoices(choices.filter((choice) => choice.id !== id));
  };

  const handleAddSourceItem = () => {
    setSourceItems([...sourceItems, { id: uuidv4(), content: '' }]);
  };

  const handleAddTargetItem = () => {
    setTargetItems([...targetItems, { id: uuidv4(), content: '' }]);
  };

  const handleAddOrderItem = () => {
    setOrderItems([...orderItems, { id: uuidv4(), content: '' }]);
  };

  const handleAddRubricCriterion = () => {
    setRubric([...rubric, { score: 0, description: '' }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const getInteractionData = () => {
      switch (interactionType) {
        case 'choice':
          return { choices };
        case 'textEntry':
          return { correctResponses };
        case 'match':
          return { sourceItems, targetItems, correctPairs };
        case 'order':
          return { items: orderItems, correctOrder };
        case 'extendedText':
          return {
            maxLength,
            minLength,
            format,
            sampleResponse,
            rubric,
          };
        default:
          return {};
      }
    };

    const itemData: AssessmentItem = {
      id: item?.id || uuidv4(),
      title,
      qtiVersion: '3.0',
      itemBody: {
        elements: [],
        interactions: [
          {
            type: interactionType,
            prompt,
            ...getInteractionData(),
          },
        ],
      },
      responseDeclarations: [],
      outcomeDeclarations: [],
      templateDeclarations: [],
      metadata: {
        itemTemplate: false,
        timeDependent: false,
        composite: false,
        interactionType,
        feedbackType: 'none',
        solutionAvailable: true,
        scoringMode: 'automatic',
        toolName: 'QTI Editor',
        toolVersion: '1.0',
        toolVendor: 'Custom',
      },
    };

    if (item) {
      dispatch(updateItem(itemData));
    } else {
      dispatch(addItem(itemData));
    }

    onSave?.();
  };

  const renderInteractionFields = () => {
    switch (interactionType) {
      case 'choice':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Choices</h3>
              <button
                type="button"
                onClick={handleAddChoice}
                className="btn-primary"
              >
                Add Choice
              </button>
            </div>
            <div className="space-y-4">
              {choices.map((choice) => (
                <div key={choice.id} className="flex items-start space-x-4">
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={choice.content}
                      onChange={(e) =>
                        handleChoiceChange(choice.id, 'content', e.target.value)
                      }
                      className="input-field"
                      placeholder="Enter choice text"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={choice.isCorrect}
                        onChange={(e) =>
                          handleChoiceChange(choice.id, 'isCorrect', e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Correct</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveChoice(choice.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'textEntry':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correct Responses
            </label>
            <div className="mt-2 space-y-2">
              <input
                type="text"
                value={correctResponses.join(', ')}
                onChange={(e) => setCorrectResponses(e.target.value.split(', ').filter(Boolean))}
                className="input-field"
                placeholder="Enter correct responses, separated by commas"
              />
            </div>
          </div>
        );

      case 'match':
        return (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Source Items</h3>
                <button
                  type="button"
                  onClick={handleAddSourceItem}
                  className="btn-primary"
                >
                  Add Source Item
                </button>
              </div>
              <div className="space-y-4">
                {sourceItems.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={item.content}
                      onChange={(e) => {
                        const newItems = [...sourceItems];
                        newItems[index].content = e.target.value;
                        setSourceItems(newItems);
                      }}
                      className="input-field"
                      placeholder="Enter source item text"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSourceItems(sourceItems.filter((_, i) => i !== index));
                        setCorrectPairs(
                          correctPairs.filter((pair) => pair.sourceId !== item.id)
                        );
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Target Items</h3>
                <button
                  type="button"
                  onClick={handleAddTargetItem}
                  className="btn-primary"
                >
                  Add Target Item
                </button>
              </div>
              <div className="space-y-4">
                {targetItems.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={item.content}
                      onChange={(e) => {
                        const newItems = [...targetItems];
                        newItems[index].content = e.target.value;
                        setTargetItems(newItems);
                      }}
                      className="input-field"
                      placeholder="Enter target item text"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setTargetItems(targetItems.filter((_, i) => i !== index));
                        setCorrectPairs(
                          correctPairs.filter((pair) => pair.targetId !== item.id)
                        );
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Correct Pairs
              </h3>
              <div className="space-y-4">
                {sourceItems.map((source) => (
                  <div key={source.id} className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">{source.content}</span>
                    <span>→</span>
                    <select
                      value={
                        correctPairs.find((pair) => pair.sourceId === source.id)
                          ?.targetId || ''
                      }
                      onChange={(e) => {
                        const newPairs = correctPairs.filter(
                          (pair) => pair.sourceId !== source.id
                        );
                        if (e.target.value) {
                          newPairs.push({
                            sourceId: source.id,
                            targetId: e.target.value,
                          });
                        }
                        setCorrectPairs(newPairs);
                      }}
                      className="input-field"
                    >
                      <option value="">Select target item</option>
                      {targetItems.map((target) => (
                        <option key={target.id} value={target.id}>
                          {target.content}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'order':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
              <button
                type="button"
                onClick={handleAddOrderItem}
                className="btn-primary"
              >
                Add Item
              </button>
            </div>
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <span className="text-gray-500">{index + 1}.</span>
                  <input
                    type="text"
                    value={item.content}
                    onChange={(e) => {
                      const newItems = [...orderItems];
                      newItems[index].content = e.target.value;
                      setOrderItems(newItems);
                    }}
                    className="input-field"
                    placeholder="Enter item text"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setOrderItems(orderItems.filter((_, i) => i !== index));
                      setCorrectOrder(correctOrder.filter((id) => id !== item.id));
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Correct Order
              </h3>
              <div className="space-y-2">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <input
                      type="number"
                      min="1"
                      max={orderItems.length}
                      value={correctOrder.indexOf(item.id) + 1 || ''}
                      onChange={(e) => {
                        const position = parseInt(e.target.value) - 1;
                        if (position >= 0 && position < orderItems.length) {
                          const newOrder = correctOrder.filter(
                            (id) => id !== item.id
                          );
                          newOrder.splice(position, 0, item.id);
                          setCorrectOrder(newOrder);
                        }
                      }}
                      className="w-20 input-field"
                    />
                    <span className="text-sm text-gray-700">{item.content}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'extendedText':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum Length (characters)
                </label>
                <input
                  type="number"
                  min="0"
                  value={minLength}
                  onChange={(e) => setMinLength(parseInt(e.target.value) || 0)}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maximum Length (characters)
                </label>
                <input
                  type="number"
                  min={minLength}
                  value={maxLength || ''}
                  onChange={(e) =>
                    setMaxLength(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  className="input-field mt-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Format
              </label>
              <select
                value={format}
                onChange={(e) =>
                  setFormat(e.target.value as 'plain' | 'preformatted' | 'xhtml')
                }
                className="input-field mt-1"
              >
                <option value="plain">Plain Text</option>
                <option value="preformatted">Preformatted</option>
                <option value="xhtml">Rich Text (XHTML)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sample Response
              </label>
              <textarea
                value={sampleResponse}
                onChange={(e) => setSampleResponse(e.target.value)}
                rows={4}
                className="input-field mt-1"
                placeholder="Enter a sample response..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Scoring Rubric
                </h3>
                <button
                  type="button"
                  onClick={handleAddRubricCriterion}
                  className="btn-primary"
                >
                  Add Criterion
                </button>
              </div>
              <div className="space-y-4">
                {rubric.map((criterion, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-24">
                      <input
                        type="number"
                        min="0"
                        value={criterion.score}
                        onChange={(e) => {
                          const newRubric = [...rubric];
                          newRubric[index].score = parseInt(e.target.value) || 0;
                          setRubric(newRubric);
                        }}
                        className="input-field"
                        placeholder="Points"
                      />
                    </div>
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={criterion.description}
                        onChange={(e) => {
                          const newRubric = [...rubric];
                          newRubric[index].description = e.target.value;
                          setRubric(newRubric);
                        }}
                        className="input-field"
                        placeholder="Criterion description"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setRubric(rubric.filter((_, i) => i !== index));
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field mt-1"
          required
        />
      </div>

      <div>
        <label htmlFor="interactionType" className="block text-sm font-medium text-gray-700">
          Interaction Type
        </label>
        <select
          id="interactionType"
          value={interactionType}
          onChange={(e) => setInteractionType(e.target.value as InteractionType)}
          className="input-field mt-1"
        >
          <option value="choice">Multiple Choice</option>
          <option value="textEntry">Text Entry</option>
          <option value="match">Match</option>
          <option value="order">Order</option>
          <option value="extendedText">Extended Text</option>
        </select>
      </div>

      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
          Question Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="input-field mt-1"
          rows={3}
          required
        />
      </div>

      {renderInteractionFields()}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {item ? 'Update' : 'Create'} Item
        </button>
      </div>
    </form>
  );
} 
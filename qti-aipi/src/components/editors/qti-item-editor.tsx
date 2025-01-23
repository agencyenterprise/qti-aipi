import { memo } from 'react';
import { QTIAssessmentItem, QTIQuestion, QuestionType, QTIHotspot, SimpleChoice } from '../../types';
import { CommonAttributesEditor } from './qti-common-attributes-editor';
import {
  ChoiceInteraction,
  TextEntryInteraction,
  ExtendedTextInteraction,
  OrderInteraction,
  MatchInteraction,
  InlineChoiceInteraction,
  GapMatchInteraction,
  HotspotInteraction,
  GraphicGapMatchInteraction,
  SliderInteraction,
  DrawingInteraction,
  UploadInteraction,
  GraphicOrderInteraction,
  GraphicAssociateInteraction,
  CustomInteraction,
  SelectPointInteraction,
  AssociateInteraction,
  EndAttemptInteraction,
  PositionObjectInteraction
} from '../question-types';

interface ItemEditorProps {
  item: QTIAssessmentItem;
  onUpdate: (updates: Partial<QTIAssessmentItem>) => void;
  onDelete: () => void;
}

interface QuestionFeedback {
  correct?: string;
  incorrect?: string;
}

const questionTypes: Array<{ value: QuestionType; label: string }> = [
  { value: 'choiceInteraction', label: 'Multiple Choice' },
  { value: 'textEntryInteraction', label: 'Text Entry' },
  { value: 'extendedTextInteraction', label: 'Extended Text' },
  { value: 'orderInteraction', label: 'Order' },
  { value: 'matchInteraction', label: 'Match' },
  { value: 'inlineChoiceInteraction', label: 'Inline Choice' },
  { value: 'gapMatchInteraction', label: 'Gap Match' },
  { value: 'hotspotInteraction', label: 'Hotspot' },
  { value: 'graphicGapMatchInteraction', label: 'Graphic Gap Match' },
  { value: 'sliderInteraction', label: 'Slider' },
  { value: 'drawingInteraction', label: 'Drawing' },
  { value: 'uploadInteraction', label: 'File Upload' },
  { value: 'associateInteraction', label: 'Associate' },
  { value: 'customInteraction', label: 'Custom' },
  { value: 'endAttemptInteraction', label: 'End Attempt' },
  { value: 'graphicAssociateInteraction', label: 'Graphic Associate' },
  { value: 'graphicOrderInteraction', label: 'Graphic Order' },
  { value: 'positionObjectInteraction', label: 'Position Object' },
  { value: 'selectPointInteraction', label: 'Select Point' }
];

export const ItemEditor = memo(({
  item,
  onUpdate,
  onDelete
}: ItemEditorProps) => {
  const updateQuestion = (qIndex: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | SimpleChoice[] | QTIHotspot[] | QuestionFeedback | { type: 'image' | 'text'; value: string; width?: number; height?: number; }[] | undefined) => {
    const updatedQuestions = [...item.questions];
    updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], [field]: value };
    onUpdate({ questions: updatedQuestions });
  };

  const updateChoice = (qIndex: number, cIndex: number, value: string) => {
    const updatedQuestions = [...item.questions];
    const choices = [...(updatedQuestions[qIndex].choices || [])];
    choices[cIndex] = { ...choices[cIndex], value };
    updatedQuestions[qIndex].choices = choices;
    onUpdate({ questions: updatedQuestions });
  };

  const addChoice = (e: React.MouseEvent, qIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedQuestions = [...item.questions];
    const choices = [...(updatedQuestions[qIndex].choices || [])];
    const newIdentifier = `choice_${choices.length + 1}`;
    choices.push({ identifier: newIdentifier, value: '', fixed: false });
    updatedQuestions[qIndex].choices = choices;
    onUpdate({ questions: updatedQuestions });
  };

  const addQuestion = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newQuestion: QTIQuestion = {
      identifier: `Q${item.questions.length + 1}`,
      type: 'choiceInteraction',
      prompt: '',
      required: false,
      choices: [],
      correctResponse: [],
      feedback: { correct: '', incorrect: '' }
    };
    onUpdate({ questions: [...item.questions, newQuestion] });
  };

  const updateOrderItem = (qIndex: number, itemIndex: number, value: string) => {
    const updatedQuestions = [...item.questions];
    const orderItems = [...(updatedQuestions[qIndex].orderItems || [])];
    orderItems[itemIndex] = value;
    updatedQuestions[qIndex].orderItems = orderItems;
    onUpdate({ questions: updatedQuestions });
  };

  const addOrderItem = (qIndex: number) => {
    const updatedQuestions = [...item.questions];
    const orderItems = [...(updatedQuestions[qIndex].orderItems || [])];
    orderItems.push('');
    updatedQuestions[qIndex].orderItems = orderItems;
    onUpdate({ questions: updatedQuestions });
  };

  const updateMatchItem = (qIndex: number, type: 'source' | 'target', itemIndex: number, value: string) => {
    const updatedQuestions = [...item.questions];
    const question = updatedQuestions[qIndex];
    const matchItems = question.matchItems || { source: [], target: [] };
    const items = type === 'source' ? matchItems.source : matchItems.target;
    items[itemIndex] = { ...items[itemIndex], value };
    updatedQuestions[qIndex].matchItems = matchItems;
    onUpdate({ questions: updatedQuestions });
  };

  const addMatchItem = (qIndex: number, type: 'source' | 'target') => {
    const updatedQuestions = [...item.questions];
    const question = updatedQuestions[qIndex];
    const matchItems = question.matchItems || { source: [], target: [] };
    const items = type === 'source' ? matchItems.source : matchItems.target;
    const newIdentifier = `match_${items.length + 1}`;
    items.push({ identifier: newIdentifier, value: '' });
    updatedQuestions[qIndex].matchItems = matchItems;
    onUpdate({ questions: updatedQuestions });
  };

  const updateGapText = (qIndex: number, gapIndex: number, value: string) => {
    const updatedQuestions = [...item.questions];
    const gapTexts = [...(updatedQuestions[qIndex].gapTexts || [])];
    gapTexts[gapIndex] = { ...gapTexts[gapIndex], value };
    updatedQuestions[qIndex].gapTexts = gapTexts;
    onUpdate({ questions: updatedQuestions });
  };

  const addGapText = (qIndex: number) => {
    const updatedQuestions = [...item.questions];
    const gapTexts = [...(updatedQuestions[qIndex].gapTexts || [])];
    const newIdentifier = `gap_${gapTexts.length + 1}`;
    gapTexts.push({ identifier: newIdentifier, value: '' });
    updatedQuestions[qIndex].gapTexts = gapTexts;
    onUpdate({ questions: updatedQuestions });
  };

  const updateHotspot = (qIndex: number, hotspotIndex: number, updates: Partial<QTIHotspot>) => {
    const updatedQuestions = [...item.questions];
    const hotspots = [...(updatedQuestions[qIndex].hotspots || [])];
    hotspots[hotspotIndex] = { ...hotspots[hotspotIndex], ...updates };
    updatedQuestions[qIndex].hotspots = hotspots;
    onUpdate({ questions: updatedQuestions });
  };

  const addHotspot = (qIndex: number) => {
    const updatedQuestions = [...item.questions];
    const hotspots = [...(updatedQuestions[qIndex].hotspots || [])];
    const newIdentifier = `hotspot_${hotspots.length + 1}`;
    hotspots.push({
      identifier: newIdentifier,
      shape: 'rect',
      coords: '0,0,100,100'
    });
    updatedQuestions[qIndex].hotspots = hotspots;
    onUpdate({ questions: updatedQuestions });
  };

  const renderQuestionEditor = (question: QTIQuestion, qIndex: number) => {
    const state = {
      assessment: { questions: item.questions },
      isSubmitting: false
    };

    const dispatch = (action: { type: string; payload?: { questions?: QTIQuestion[] } }) => {
      if (action.type === 'UPDATE_ASSESSMENT' && action.payload?.questions) {
        onUpdate({ questions: action.payload.questions });
      }
    };

    switch (question.type) {
      case 'choiceInteraction':
        return (
          <ChoiceInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            updateChoice={updateChoice}
            addChoice={addChoice}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'textEntryInteraction':
        return (
          <TextEntryInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'extendedTextInteraction':
        return (
          <ExtendedTextInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'orderInteraction':
        return (
          <OrderInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            updateOrderItem={updateOrderItem}
            addOrderItem={addOrderItem}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'matchInteraction':
        return (
          <MatchInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            updateMatchItem={updateMatchItem}
            addMatchItem={addMatchItem}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'inlineChoiceInteraction':
        return (
          <InlineChoiceInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'gapMatchInteraction':
        return (
          <GapMatchInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            updateGapText={updateGapText}
            addGapText={addGapText}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'hotspotInteraction':
        return (
          <HotspotInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            updateHotspot={updateHotspot}
            addHotspot={addHotspot}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'graphicGapMatchInteraction':
        return (
          <GraphicGapMatchInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            updateHotspot={updateHotspot}
            addHotspot={addHotspot}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'sliderInteraction':
        return (
          <SliderInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'drawingInteraction':
        return (
          <DrawingInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'uploadInteraction':
        return (
          <UploadInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'graphicOrderInteraction':
        return (
          <GraphicOrderInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            updateHotspot={updateHotspot}
            addHotspot={addHotspot}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'graphicAssociateInteraction':
        return (
          <GraphicAssociateInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            updateHotspot={updateHotspot}
            addHotspot={addHotspot}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'customInteraction':
        return (
          <CustomInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'selectPointInteraction':
        return (
          <SelectPointInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'associateInteraction':
        return (
          <AssociateInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            updateAssociableChoice={(questionIndex: number, choiceIndex: number, value: string) => {
              const updatedQuestions = [...item.questions];
              const choices = [...(updatedQuestions[questionIndex].associableChoices || [])];
              choices[choiceIndex] = { ...choices[choiceIndex], value };
              updatedQuestions[questionIndex].associableChoices = choices;
              onUpdate({ questions: updatedQuestions });
            }}
            addAssociableChoice={() => {
              const updatedQuestions = [...item.questions];
              const choices = [...(updatedQuestions[qIndex].associableChoices || [])];
              const newIdentifier = `associable_${choices.length + 1}`;
              choices.push({ identifier: newIdentifier, value: '' });
              updatedQuestions[qIndex].associableChoices = choices;
              onUpdate({ questions: updatedQuestions });
            }}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'endAttemptInteraction':
        return (
          <EndAttemptInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            state={state}
            dispatch={dispatch}
          />
        );
      case 'positionObjectInteraction':
        return (
          <PositionObjectInteraction
            question={question}
            qIndex={qIndex}
            updateQuestion={updateQuestion}
            state={state}
            dispatch={dispatch}
          />
        );
      default:
        return (
          <div className="text-yellow-600">
            Editor for {question.type} is not yet implemented
          </div>
        );
    }
  };

  return (
    <div className="border p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-black">Item: {item.title || item.identifier}</h4>
        <button
          type="button"
          onClick={onDelete}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Delete Item
        </button>
      </div>

      <CommonAttributesEditor
        attributes={item}
        onChange={(updates) => onUpdate(updates)}
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-black">Adaptive</label>
          <input
            type="checkbox"
            checked={item.adaptive || false}
            onChange={(e) => onUpdate({ adaptive: e.target.checked })}
            className="ml-2"
          />
        </div>
        <div>
          <label className="text-black">Time Dependent</label>
          <input
            type="checkbox"
            checked={item.timeDependent || false}
            onChange={(e) => onUpdate({ timeDependent: e.target.checked })}
            className="ml-2"
          />
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Pre-conditions</h3>
        <textarea
          value={item.preConditions?.join('\n') || ''}
          onChange={(e) => onUpdate({ preConditions: e.target.value.split('\n') })}
          className="w-full p-1 border mt-1 text-black"
          rows={3}
          placeholder="Enter one pre-condition per line"
        />
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Response Processing</h3>
        <textarea
          value={item.responseProcessing || ''}
          onChange={(e) => onUpdate({ responseProcessing: e.target.value })}
          className="w-full p-1 border mt-1 text-black"
          rows={3}
          placeholder="Enter response processing rules"
        />
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Questions</h3>
        {item.questions.map((question, index) => (
          <div key={question.identifier} className="border p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-bold">Question {index + 1}</h5>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const updatedQuestions = [...item.questions];
                  updatedQuestions.splice(index, 1);
                  onUpdate({ questions: updatedQuestions });
                }}
                className="text-red-500 hover:text-red-600"
              >
                Remove Question
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-black">Identifier</label>
                <input
                  type="text"
                  value={question.identifier}
                  onChange={(e) => updateQuestion(index, 'identifier', e.target.value)}
                  className="w-full p-1 border mt-1 text-black"
                  placeholder="Enter question identifier"
                />
              </div>
              <div>
                <label className="text-black">Type</label>
                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(index, 'type', e.target.value as QuestionType)}
                  className="w-full p-1 border mt-1 text-black"
                >
                  {questionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>


            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-black">Required</label>
                <input
                  type="checkbox"
                  checked={question.required || false}
                  onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                  className="ml-2"
                />
              </div>
            </div>

            {renderQuestionEditor(question, index)}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-black">Correct Feedback</label>
                <textarea
                  value={question.feedback?.correct || ''}
                  onChange={(e) => updateQuestion(index, 'feedback', { ...question.feedback, correct: e.target.value })}
                  className="w-full p-1 border mt-1 text-black"
                  rows={2}
                  placeholder="Enter feedback for correct answers"
                />
              </div>
              <div>
                <label className="text-black">Incorrect Feedback</label>
                <textarea
                  value={question.feedback?.incorrect || ''}
                  onChange={(e) => updateQuestion(index, 'feedback', { ...question.feedback, incorrect: e.target.value })}
                  className="w-full p-1 border mt-1 text-black"
                  rows={2}
                  placeholder="Enter feedback for incorrect answers"
                />
              </div>
            </div>
          </div>
        ))}

        <div 
          onClick={(e) => {
            e.preventDefault();
            addQuestion(e);
          }} 
          className="text-blue-600 cursor-pointer"
        >
          + Add Question
        </div>
      </div>
    </div>
  );
});

ItemEditor.displayName = 'ItemEditor'; 
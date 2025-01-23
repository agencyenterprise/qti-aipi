'use client';

import { useCallback, memo, useRef, useReducer } from 'react';
import {
  QTIAssessmentItem,
  QTISection,
  QTITestPart,
  QTIQuestion,
  QTIChoice,
  QTIHotspot,
  CommonAttributes,
  ItemSessionControl,
  TimeLimits,
  QuestionType,
  DrawingTool,
  QTIAssessmentTest
} from '../types';

interface ExtendedQTIAssessmentItem extends QTIAssessmentTest {
  itemSessionControl?: ItemSessionControl;
  timeLimits?: TimeLimits;
}

interface QTIEditorProps {
  initialData: ExtendedQTIAssessmentItem;
  onSave: (data: ExtendedQTIAssessmentItem) => void;
}

interface State {
  assessment: ExtendedQTIAssessmentItem;
  isSubmitting: boolean;
}

interface Action {
  type: 'UPDATE_ASSESSMENT' | 'START_SUBMISSION' | 'END_SUBMISSION';
  payload?: Partial<ExtendedQTIAssessmentItem>;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UPDATE_ASSESSMENT':
      return {
        ...state,
        assessment: { ...state.assessment, ...action.payload },
      };
    case 'START_SUBMISSION':
      return { ...state, isSubmitting: true };
    case 'END_SUBMISSION':
      return { ...state, isSubmitting: false };
    default:
      return state;
  }
}

// Move CommonAttributesEditor outside of QTIEditor
const CommonAttributesEditor = memo(({
  attributes,
  onChange
}: {
  attributes: CommonAttributes,
  onChange: (updates: Partial<CommonAttributes>) => void
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    const formData = new FormData(formRef.current);
    const updates: Partial<CommonAttributes> = {
      identifier: formData.get('identifier') as string || '',
      title: formData.get('title') as string || '',
      timeDependent: formData.get('timeDependent') === 'on',
      label: formData.get('label') as string || '',
      lang: formData.get('lang') as string || '',
      base: formData.get('base') as string || ''
    };
    onChange(updates);
  }, [onChange]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label className="text-black">Identifier</label>
        <input
          type="text"
          name="identifier"
          defaultValue={attributes.identifier || ''}
          className="w-full p-1 border mt-1 text-black"
        />
      </div>
      <div>
        <label className="text-black">Title</label>
        <input
          type="text"
          name="title"
          defaultValue={attributes.title || ''}
          className="w-full p-1 border mt-1 text-black"
        />
      </div>
      <div>
        <label className="text-black">Time Dependent</label>
        <input
          type="checkbox"
          name="timeDependent"
          defaultChecked={attributes.timeDependent || false}
          className="ml-2"
        />
      </div>
      <div>
        <label className="text-black">Label</label>
        <input
          type="text"
          name="label"
          defaultValue={attributes.label || ''}
          className="w-full p-1 border mt-1 text-black"
        />
      </div>
      <div>
        <label className="text-black">Language</label>
        <input
          type="text"
          name="lang"
          defaultValue={attributes.lang || ''}
          className="w-full p-1 border mt-1 text-black"
        />
      </div>
      <div>
        <label className="text-black">Base URI</label>
        <input
          type="text"
          name="base"
          defaultValue={attributes.base || ''}
          className="w-full p-1 border mt-1 text-black"
        />
      </div>
    </form>
  );
});

CommonAttributesEditor.displayName = 'CommonAttributesEditor';

const ItemSessionControlEditor = memo(({
  control,
  onChange
}: {
  control?: ItemSessionControl,
  onChange: (updates: ItemSessionControl) => void
}) => {
  const handleMaxAttemptsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...control, maxAttempts: Number(e.target.value) });
  }, [control, onChange]);

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label className="text-black">Max Attempts</label>
        <input
          type="number"
          value={control?.maxAttempts || 0}
          onChange={handleMaxAttemptsChange}
          className="w-full p-1 border mt-1 text-black"
        />
      </div>
      <div>
        <label className="text-black">Show Feedback</label>
        <input
          type="checkbox"
          checked={control?.showFeedback || false}
          onChange={(e) => onChange({ ...control, showFeedback: e.target.checked })}
          className="ml-2"
        />
      </div>
      <div>
        <label className="text-black">Allow Review</label>
        <input
          type="checkbox"
          checked={control?.allowReview || false}
          onChange={(e) => onChange({ ...control, allowReview: e.target.checked })}
          className="ml-2"
        />
      </div>
      <div>
        <label className="text-black">Show Solution</label>
        <input
          type="checkbox"
          checked={control?.showSolution || false}
          onChange={(e) => onChange({ ...control, showSolution: e.target.checked })}
          className="ml-2"
        />
      </div>
      <div>
        <label className="text-black">Allow Comment</label>
        <input
          type="checkbox"
          checked={control?.allowComment || false}
          onChange={(e) => onChange({ ...control, allowComment: e.target.checked })}
          className="ml-2"
        />
      </div>
      <div>
        <label className="text-black">Allow Skipping</label>
        <input
          type="checkbox"
          checked={control?.allowSkipping || false}
          onChange={(e) => onChange({ ...control, allowSkipping: e.target.checked })}
          className="ml-2"
        />
      </div>
      <div>
        <label className="text-black">Validate Responses</label>
        <input
          type="checkbox"
          checked={control?.validateResponses || false}
          onChange={(e) => onChange({ ...control, validateResponses: e.target.checked })}
          className="ml-2"
        />
      </div>
    </div>
  );
});

ItemSessionControlEditor.displayName = 'ItemSessionControlEditor';

const TimeLimitsEditor = memo(({
  limits,
  onChange
}: {
  limits?: TimeLimits,
  onChange: (updates: TimeLimits) => void
}) => {
  const handleMinTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...limits, minTime: Number(e.target.value) });
  }, [limits, onChange]);

  const handleMaxTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...limits, maxTime: Number(e.target.value) });
  }, [limits, onChange]);

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label className="text-black">Minimum Time (seconds)</label>
        <input
          type="number"
          value={limits?.minTime || 0}
          onChange={handleMinTimeChange}
          className="w-full p-1 border mt-1 text-black"
        />
      </div>
      <div>
        <label className="text-black">Maximum Time (seconds)</label>
        <input
          type="number"
          value={limits?.maxTime || 0}
          onChange={handleMaxTimeChange}
          className="w-full p-1 border mt-1 text-black"
        />
      </div>
      <div>
        <label className="text-black">Allow Late Submission</label>
        <input
          type="checkbox"
          checked={limits?.allowLateSubmission || false}
          onChange={(e) => onChange({ ...limits, allowLateSubmission: e.target.checked })}
          className="ml-2"
        />
      </div>
    </div>
  );
});

TimeLimitsEditor.displayName = 'TimeLimitsEditor';

// Add this new component before the main QTIEditor component
const TestPartEditor = memo(({ 
  testPart, 
  testPartIndex,
  onUpdate
}: { 
  testPart: QTITestPart;
  testPartIndex: number;
  onUpdate: (index: number, updates: Partial<QTITestPart>) => void;
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    const formData = new FormData(formRef.current);
    const updates: Partial<QTITestPart> = {
      identifier: formData.get('identifier') as string || '',
      title: formData.get('title') as string || '',
      timeDependent: formData.get('timeDependent') === 'on',
      label: formData.get('label') as string || '',
      lang: formData.get('lang') as string || '',
      base: formData.get('base') as string || '',
      navigationMode: formData.get('navigationMode') as 'linear' | 'nonlinear',
      submissionMode: formData.get('submissionMode') as 'individual' | 'simultaneous'
    };
    onUpdate(testPartIndex, updates);
  }, [testPartIndex, onUpdate]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="border p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-black">Test Part: {testPart.title || testPart.identifier}</h4>
      </div>

      <CommonAttributesEditor
        attributes={testPart}
        onChange={(updates) => onUpdate(testPartIndex, updates)}
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-black">Navigation Mode</label>
          <select
            name="navigationMode"
            defaultValue={testPart.navigationMode}
            className="w-full p-1 border mt-1 text-black"
          >
            <option value="linear">Linear</option>
            <option value="nonlinear">Non-linear</option>
          </select>
        </div>
        <div>
          <label className="text-black">Submission Mode</label>
          <select
            name="submissionMode"
            defaultValue={testPart.submissionMode}
            className="w-full p-1 border mt-1 text-black"
          >
            <option value="individual">Individual</option>
            <option value="simultaneous">Simultaneous</option>
          </select>
        </div>
      </div>
    </form>
  );
});

TestPartEditor.displayName = 'TestPartEditor';

export default function QTIEditor({ initialData, onSave }: QTIEditorProps) {
  const [state, dispatch] = useReducer(reducer, {
    assessment: initialData,
    isSubmitting: false
  });

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (state.isSubmitting) return;

      dispatch({ type: 'START_SUBMISSION' });

      try {
        await onSave(state.assessment);
        if (formRef.current) {
          formRef.current.reset();
        }
        alert('Form submitted successfully!');
      } catch (error) {
        console.error('Failed to submit:', error);
        alert('Submission failed. Please try again.');
      } finally {
        dispatch({ type: 'END_SUBMISSION' });
      }
    },
    [state.isSubmitting, state.assessment, onSave]
  );

  const handleAttributesChange = useCallback((updates: Partial<CommonAttributes>) => {
    dispatch({ 
      type: 'UPDATE_ASSESSMENT', 
      payload: { ...state.assessment, ...updates } 
    });
  }, [state.assessment]);

  const handleTestPartUpdate = useCallback((testPartIndex: number, updates: Partial<QTITestPart>) => {
    if (!state.assessment.testParts) return;
    
    dispatch({ 
      type: 'UPDATE_ASSESSMENT', 
      payload: {
        testParts: state.assessment.testParts.map((part, idx) => 
          idx === testPartIndex ? { ...part, ...updates } : part
        )
      } 
    });
  }, [state.assessment.testParts]);

  const updateQuestion = (
    index: number,
    field: keyof QTIQuestion,
    value: string | string[] | { correct: string; incorrect: string; } | QTIChoice[] | QTIQuestion[keyof QTIQuestion]
  ) => {
    const updatedQuestions = [...state.assessment.questions];
    const question = { ...updatedQuestions[index] } as QTIQuestion;

    if (field === 'type') {
      const newType = value as QTIQuestion['type'];
      question.type = newType;
      // Initialize default values for the new question type
      switch (newType) {
        case 'choiceInteraction':
          question.choices = [];
          question.maxChoices = 1;
          question.minChoices = 0;
          question.shuffle = false;
          break;
        case 'textEntryInteraction':
          question.baseType = 'string';
          question.format = 'plain';
          break;
        case 'extendedTextInteraction':
          question.format = 'plain';
          break;
        case 'orderInteraction':
          question.orderItems = [];
          question.shuffle = false;
          break;
        case 'matchInteraction':
          question.matchItems = { source: [], target: [] };
          question.shuffle = false;
          break;
        case 'inlineChoiceInteraction':
          question.inlineChoices = [];
          break;
        case 'gapMatchInteraction':
          question.gaps = [];
          question.gapTexts = [];
          question.shuffle = false;
          break;
        case 'hotspotInteraction':
          question.hotspots = [];
          break;
        case 'graphicGapMatchInteraction':
          question.hotspots = [];
          question.image = '';
          break;
        case 'sliderInteraction':
          question.sliderConfig = { min: 0, max: 100, step: 1, orientation: 'horizontal' };
          break;
        case 'drawingInteraction':
          question.drawingConfig = { width: 400, height: 300, tools: ['pen', 'eraser'] };
          break;
      }
    } else {
      // Type assertion to handle the complex union type
      (question[field] as typeof value) = value;
    }

    updatedQuestions[index] = question;
    dispatch({ 
      type: 'UPDATE_ASSESSMENT', 
      payload: { questions: updatedQuestions } 
    });
  };

  const handleItemSessionControlChange = useCallback((updates: ItemSessionControl) => {
    dispatch({ 
      type: 'UPDATE_ASSESSMENT', 
      payload: { ...state.assessment, itemSessionControl: updates } 
    });
  }, [state.assessment]);

  const handleTimeLimitsChange = useCallback((updates: TimeLimits) => {
    dispatch({ 
      type: 'UPDATE_ASSESSMENT', 
      payload: { ...state.assessment, timeLimits: updates } 
    });
  }, [state.assessment]);

  // Question type options for the dropdown
  const questionTypes = [
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
    { value: 'drawingInteraction', label: 'Drawing' }
  ];

  const addChoice = (questionIndex: number) => {
    const updatedQuestions = [...state.assessment.questions];
    const choices = updatedQuestions[questionIndex].choices || [];
    choices.push({
      identifier: `C${choices.length + 1}`,
      value: ''
    });
    updatedQuestions[questionIndex].choices = choices;
    dispatch({ 
      type: 'UPDATE_ASSESSMENT', 
      payload: { questions: updatedQuestions } 
    });
  };

  const addOrderItem = (questionIndex: number) => {
    const updatedQuestions = [...state.assessment.questions];
    const orderItems = updatedQuestions[questionIndex].orderItems || [];
    orderItems.push('');
    updatedQuestions[questionIndex].orderItems = orderItems;
    dispatch({ 
      type: 'UPDATE_ASSESSMENT', 
      payload: { questions: updatedQuestions } 
    });
  };

  const addMatchItem = (questionIndex: number, type: 'source' | 'target') => {
    const updatedQuestions = [...state.assessment.questions];
    const matchItems = updatedQuestions[questionIndex].matchItems || { source: [], target: [] };
    const items = matchItems[type];
    items.push({
      identifier: `${type[0].toUpperCase()}${items.length + 1}`,
      value: ''
    });
    updatedQuestions[questionIndex].matchItems = matchItems;
    dispatch({ 
      type: 'UPDATE_ASSESSMENT', 
      payload: { questions: updatedQuestions } 
    });
  };

  const updateChoice = (questionIndex: number, choiceIndex: number, value: string) => {
    const updatedQuestions = [...state.assessment.questions];
    const choices = [...(updatedQuestions[questionIndex].choices || [])];
    choices[choiceIndex] = { ...choices[choiceIndex], value };
    updatedQuestions[questionIndex].choices = choices;
    dispatch({ 
      type: 'UPDATE_ASSESSMENT', 
      payload: { questions: updatedQuestions } 
    });
  };

  const updateOrderItem = (questionIndex: number, itemIndex: number, value: string) => {
    const updatedQuestions = [...state.assessment.questions];
    const orderItems = [...(updatedQuestions[questionIndex].orderItems || [])];
    orderItems[itemIndex] = value;
    updatedQuestions[questionIndex].orderItems = orderItems;
    dispatch({ 
      type: 'UPDATE_ASSESSMENT', 
      payload: { questions: updatedQuestions } 
    });
  };

  const updateMatchItem = (questionIndex: number, type: 'source' | 'target', itemIndex: number, value: string) => {
    const updatedQuestions = [...state.assessment.questions];
    const matchItems = { ...(updatedQuestions[questionIndex].matchItems || { source: [], target: [] }) };
    const items = [...matchItems[type]];
    items[itemIndex] = { ...items[itemIndex], value };
    matchItems[type] = items;
    updatedQuestions[questionIndex].matchItems = matchItems;
    dispatch({ 
      type: 'UPDATE_ASSESSMENT', 
      payload: { questions: updatedQuestions } 
    });
  };

  const addHotspot = (questionIndex: number) => {
    const updatedQuestions = [...state.assessment.questions];
    const hotspots = updatedQuestions[questionIndex].hotspots || [];
    hotspots.push({
      identifier: `H${hotspots.length + 1}`,
      shape: 'rect',
      coords: '0,0,100,100',
    });
    updatedQuestions[questionIndex].hotspots = hotspots;
    dispatch({ 
      type: 'UPDATE_ASSESSMENT', 
      payload: { questions: updatedQuestions } 
    });
  };

  const updateHotspot = (questionIndex: number, hotspotIndex: number, updates: Partial<QTIHotspot>) => {
    const updatedQuestions = [...state.assessment.questions];
    const hotspots = [...(updatedQuestions[questionIndex].hotspots || [])];
    hotspots[hotspotIndex] = { ...hotspots[hotspotIndex], ...updates };
    updatedQuestions[questionIndex].hotspots = hotspots;
    dispatch({ 
      type: 'UPDATE_ASSESSMENT', 
      payload: { questions: updatedQuestions } 
    });
  };

  const addGapText = (questionIndex: number) => {
    const updatedQuestions = [...state.assessment.questions];
    const gapTexts = updatedQuestions[questionIndex].gapTexts || [];
    gapTexts.push({
      identifier: `G${gapTexts.length + 1}`,
      value: ''
    });
    updatedQuestions[questionIndex].gapTexts = gapTexts;
    dispatch({ 
      type: 'UPDATE_ASSESSMENT', 
      payload: { questions: updatedQuestions } 
    });
  };

  const updateGapText = (questionIndex: number, gapIndex: number, value: string) => {
    const updatedQuestions = [...state.assessment.questions];
    const gapTexts = [...(updatedQuestions[questionIndex].gapTexts || [])];
    gapTexts[gapIndex] = { ...gapTexts[gapIndex], value };
    updatedQuestions[questionIndex].gapTexts = gapTexts;
    dispatch({ 
      type: 'UPDATE_ASSESSMENT', 
      payload: { questions: updatedQuestions } 
    });
  };

  const renderQuestionEditor = (question: QTIQuestion, qIndex: number) => {
    switch (question.type) {
      case 'choiceInteraction':
        return (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-black">Response Identifier</label>
                <input
                  type="text"
                  value={question.responseIdentifier || ''}
                  onChange={(e) => {
                    updateQuestion(qIndex, 'responseIdentifier', e.target.value);
                  }}
                  className="w-full p-1 border mt-1 text-black"
                  placeholder="Required: Enter response identifier"
                />
              </div>
              <div>
                <label className="text-black">Max Choices</label>
                <input
                  type="number"
                  value={question.maxChoices || 1}
                  onChange={(e) => updateQuestion(qIndex, 'maxChoices', Number(e.target.value))}
                  className="w-full p-1 border mt-1 text-black"
                  min="1"
                  placeholder="Required: Maximum choices allowed"
                />
              </div>
              <div>
                <label className="text-black">Min Choices</label>
                <input
                  type="number"
                  value={question.minChoices || 0}
                  onChange={(e) => updateQuestion(qIndex, 'minChoices', Number(e.target.value))}
                  className="w-full p-1 border mt-1 text-black"
                  min="0"
                  placeholder="Optional: Minimum choices required"
                />
              </div>
              <div>
                <label className="text-black">Shuffle Choices</label>
                <input
                  type="checkbox"
                  checked={question.shuffle || false}
                  onChange={(e) => updateQuestion(qIndex, 'shuffle', e.target.checked)}
                  className="ml-2"
                />
              </div>
            </div>

            <label className="text-black">Choices</label>
            {question.choices?.map((choice, cIndex) => (
              <div key={cIndex} className="flex items-center mt-2">
                <input
                  type="text"
                  value={choice.value}
                  onChange={(e) => updateChoice(qIndex, cIndex, e.target.value)}
                  className="flex-1 p-1 border mr-2 text-black"
                  placeholder="Enter choice text"
                />
                <div className="flex items-center ml-2">
                  <label className="text-sm mr-2">Fixed</label>
                  <input
                    type="checkbox"
                    checked={choice.fixed || false}
                    onChange={(e) => {
                      const updatedQuestions = [...state.assessment.questions];
                      const choices = [...(updatedQuestions[qIndex].choices || [])];
                      choices[cIndex] = { ...choices[cIndex], fixed: e.target.checked };
                      updatedQuestions[qIndex].choices = choices;
                      dispatch({ 
                        type: 'UPDATE_ASSESSMENT', 
                        payload: { questions: updatedQuestions } 
                      });
                    }}
                    className="mr-4"
                  />
                </div>
                <label className="text-sm mr-2">Correct</label>
                <input
                  type="checkbox"
                  checked={question.correctResponse.includes(choice.identifier)}
                  onChange={(e) => {
                    const correctResponse = e.target.checked
                      ? [...question.correctResponse, choice.identifier]
                      : question.correctResponse.filter(id => id !== choice.identifier);
                    updateQuestion(qIndex, 'correctResponse', correctResponse);
                  }}
                />
              </div>
            ))}
            <button
              onClick={() => addChoice(qIndex)}
              className="mt-2 text-blue-600"
            >
              + Add Choice
            </button>
          </div>
        );

      case 'textEntryInteraction':
        return (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-black">Response Identifier</label>
                <input
                  type="text"
                  value={question.responseIdentifier || ''}
                  onChange={(e) => updateQuestion(qIndex, 'responseIdentifier', e.target.value)}
                  className="w-full p-1 border mt-1 text-black"
                  placeholder="Required: Enter response identifier"
                />
              </div>
              <div>
                <label className="text-black">Base Type</label>
                <select
                  value={question.baseType || 'string'}
                  onChange={(e) => updateQuestion(qIndex, 'baseType', e.target.value)}
                  className="w-full p-1 border mt-1 text-black"
                >
                  <option value="string">String</option>
                  <option value="integer">Integer</option>
                  <option value="float">Float</option>
                </select>
              </div>
              <div>
                <label className="text-black">Pattern</label>
                <input
                  type="text"
                  value={question.pattern || ''}
                  onChange={(e) => updateQuestion(qIndex, 'pattern', e.target.value)}
                  className="w-full p-1 border mt-1 text-black"
                  placeholder="Optional: Regular expression pattern"
                />
              </div>
              <div>
                <label className="text-black">Format</label>
                <select
                  value={question.format || 'plain'}
                  onChange={(e) => updateQuestion(qIndex, 'format', e.target.value)}
                  className="w-full p-1 border mt-1 text-black"
                >
                  <option value="plain">Plain</option>
                  <option value="preformatted">Preformatted</option>
                  <option value="xhtml">XHTML</option>
                </select>
              </div>
              <div>
                <label className="text-black">Placeholder</label>
                <input
                  type="text"
                  value={question.placeholder || ''}
                  onChange={(e) => updateQuestion(qIndex, 'placeholder', e.target.value)}
                  className="w-full p-1 border mt-1 text-black"
                  placeholder="Optional: Placeholder text"
                />
              </div>
              <div>
                <label className="text-black">Expected Length</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={question.minLength || ''}
                    onChange={(e) => updateQuestion(qIndex, 'minLength', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full p-1 border mt-1 text-black"
                    placeholder="Min"
                    min="0"
                  />
                  <input
                    type="number"
                    value={question.maxLength || ''}
                    onChange={(e) => updateQuestion(qIndex, 'maxLength', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full p-1 border mt-1 text-black"
                    placeholder="Max"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-black">Expected Answer</label>
              <textarea
                value={question.correctResponse[0] || ''}
                onChange={(e) => updateQuestion(qIndex, 'correctResponse', [e.target.value])}
                className="w-full p-1 border mt-1 text-black"
                rows={2}
                placeholder="Enter expected answer"
              />
            </div>

            <div className="mb-4">
              <label className="text-black">Case Sensitive</label>
              <input
                type="checkbox"
                checked={question.caseSensitive || false}
                onChange={(e) => updateQuestion(qIndex, 'caseSensitive', e.target.checked)}
                className="ml-2"
              />
            </div>
          </div>
        );

      case 'extendedTextInteraction':
        return (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-black">Response Identifier</label>
                <input
                  type="text"
                  value={question.responseIdentifier || ''}
                  onChange={(e) => updateQuestion(qIndex, 'responseIdentifier', e.target.value)}
                  className="w-full p-1 border mt-1 text-black"
                  placeholder="Required: Enter response identifier"
                />
              </div>
              <div>
                <label className="text-black">Format</label>
                <select
                  value={question.format || 'plain'}
                  onChange={(e) => updateQuestion(qIndex, 'format', e.target.value)}
                  className="w-full p-1 border mt-1 text-black"
                >
                  <option value="plain">Plain Text</option>
                  <option value="preformatted">Preformatted</option>
                  <option value="xhtml">XHTML</option>
                  <option value="rtf">RTF</option>
                </select>
              </div>
              <div>
                <label className="text-black">Expected Length</label>
                <input
                  type="number"
                  value={question.expectedLength || ''}
                  onChange={(e) => updateQuestion(qIndex, 'expectedLength', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-1 border mt-1 text-black"
                  min="0"
                  placeholder="Optional: Expected response length"
                />
              </div>
              <div>
                <label className="text-black">String Limits</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={question.minStrings || ''}
                    onChange={(e) => updateQuestion(qIndex, 'minStrings', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full p-1 border mt-1 text-black"
                    placeholder="Min strings"
                    min="0"
                  />
                  <input
                    type="number"
                    value={question.maxStrings || ''}
                    onChange={(e) => updateQuestion(qIndex, 'maxStrings', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full p-1 border mt-1 text-black"
                    placeholder="Max strings"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-black">Model Answer</label>
              <textarea
                value={question.correctResponse[0] || ''}
                onChange={(e) => updateQuestion(qIndex, 'correctResponse', [e.target.value])}
                className="w-full p-1 border mt-1 text-black"
                rows={4}
                placeholder="Enter model essay answer"
              />
            </div>

            <div className="mb-4">
              <label className="text-black">Rubric</label>
              <textarea
                value={question.rubricBlock || ''}
                onChange={(e) => updateQuestion(qIndex, 'rubricBlock', e.target.value)}
                className="w-full p-1 border mt-1 text-black"
                rows={3}
                placeholder="Enter scoring rubric or guidelines"
              />
            </div>
          </div>
        );

      case 'orderInteraction':
        return (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-black">Response Identifier</label>
                <input
                  type="text"
                  value={question.responseIdentifier || ''}
                  onChange={(e) => updateQuestion(qIndex, 'responseIdentifier', e.target.value)}
                  className="w-full p-1 border mt-1 text-black"
                  placeholder="Required: Enter response identifier"
                />
              </div>
              <div>
                <label className="text-black">Shuffle</label>
                <input
                  type="checkbox"
                  checked={question.shuffle || false}
                  onChange={(e) => updateQuestion(qIndex, 'shuffle', e.target.checked)}
                  className="ml-2"
                />
              </div>
              <div>
                <label className="text-black">Min Choices</label>
                <input
                  type="number"
                  value={question.minChoices || ''}
                  onChange={(e) => updateQuestion(qIndex, 'minChoices', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-1 border mt-1 text-black"
                  min="0"
                  placeholder="Minimum choices to arrange"
                />
              </div>
              <div>
                <label className="text-black">Max Choices</label>
                <input
                  type="number"
                  value={question.maxChoices || ''}
                  onChange={(e) => updateQuestion(qIndex, 'maxChoices', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-1 border mt-1 text-black"
                  min="0"
                  placeholder="Maximum choices to arrange"
                />
              </div>
            </div>

            <label className="text-black">Order Items</label>
            {question.orderItems?.map((item, iIndex) => (
              <div key={iIndex} className="flex items-center mt-2">
                <span className="mr-2 text-black">{iIndex + 1}.</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateOrderItem(qIndex, iIndex, e.target.value)}
                  className="flex-1 p-1 border text-black"
                  placeholder="Enter item text"
                />
                <div className="flex items-center ml-2">
                  <label className="text-sm mr-2">Fixed</label>
                  <input
                    type="checkbox"
                    checked={question.choices?.[iIndex]?.fixed || false}
                    onChange={(e) => {
                      const updatedQuestions = [...state.assessment.questions];
                      const choices = [...(updatedQuestions[qIndex].choices || [])];
                      choices[iIndex] = {
                        ...choices[iIndex],
                        identifier: `choice_${iIndex}`,
                        value: item,
                        fixed: e.target.checked
                      };
                      updatedQuestions[qIndex].choices = choices;
                      dispatch({ 
                        type: 'UPDATE_ASSESSMENT', 
                        payload: { questions: updatedQuestions } 
                      });
                    }}
                    className="mr-4"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => addOrderItem(qIndex)}
              className="mt-2 text-blue-600"
            >
              + Add Order Item
            </button>
          </div>
        );

      case 'matchInteraction':
        return (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-black">Response Identifier</label>
                <input
                  type="text"
                  value={question.responseIdentifier || ''}
                  onChange={(e) => updateQuestion(qIndex, 'responseIdentifier', e.target.value)}
                  className="w-full p-1 border mt-1 text-black"
                  placeholder="Required: Enter response identifier"
                />
              </div>
              <div>
                <label className="text-black">Shuffle</label>
                <input
                  type="checkbox"
                  checked={question.shuffle || false}
                  onChange={(e) => updateQuestion(qIndex, 'shuffle', e.target.checked)}
                  className="ml-2"
                />
              </div>
              <div>
                <label className="text-black">Max Associations</label>
                <input
                  type="number"
                  value={question.maxAssociations || ''}
                  onChange={(e) => updateQuestion(qIndex, 'maxAssociations', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-1 border mt-1 text-black"
                  min="0"
                  placeholder="Maximum number of matches allowed"
                />
              </div>
              <div>
                <label className="text-black">Min Associations</label>
                <input
                  type="number"
                  value={question.minAssociations || ''}
                  onChange={(e) => updateQuestion(qIndex, 'minAssociations', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-1 border mt-1 text-black"
                  min="0"
                  placeholder="Minimum number of matches required"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-black">Source Items</label>
                {question.matchItems?.source.map((item, iIndex) => (
                  <div key={iIndex} className="mt-2">
                    <input
                        type="text"
                        value={item.value}
                        onChange={(e) => updateMatchItem(qIndex, 'source', iIndex, e.target.value)}
                        className="w-full p-1 border text-black"
                        placeholder="Enter source item"
                    />
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <div>
                        <label className="text-sm">Match Max</label>
                        <input
                          type="number"
                          value={item.matchMax || ''}
                          onChange={(e) => {
                            const updatedQuestions = [...state.assessment.questions];
                            const items = [...(updatedQuestions[qIndex].matchItems?.source || [])];
                            items[iIndex] = { ...items[iIndex], matchMax: e.target.value ? Number(e.target.value) : undefined };
                            updatedQuestions[qIndex].matchItems = {
                              ...(updatedQuestions[qIndex].matchItems || { source: [], target: [] }),
                              source: items
                            };
                            dispatch({ 
                              type: 'UPDATE_ASSESSMENT', 
                              payload: { questions: updatedQuestions } 
                            });
                          }}
                          className="w-full p-1 border text-black"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="text-sm">Match Min</label>
                        <input
                          type="number"
                          value={item.matchMin || ''}
                          onChange={(e) => {
                            const updatedQuestions = [...state.assessment.questions];
                            const items = [...(updatedQuestions[qIndex].matchItems?.source || [])];
                            items[iIndex] = { ...items[iIndex], matchMin: e.target.value ? Number(e.target.value) : undefined };
                            updatedQuestions[qIndex].matchItems = {
                              ...(updatedQuestions[qIndex].matchItems || { source: [], target: [] }),
                              source: items
                            };
                            dispatch({ 
                              type: 'UPDATE_ASSESSMENT', 
                              payload: { questions: updatedQuestions } 
                            });
                          }}
                          className="w-full p-1 border text-black"
                          min="0"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm">Fixed</label>
                        <input
                          type="checkbox"
                          checked={item.fixed || false}
                          onChange={(e) => {
                            const updatedQuestions = [...state.assessment.questions];
                            const items = [...(updatedQuestions[qIndex].matchItems?.source || [])];
                            items[iIndex] = { ...items[iIndex], fixed: e.target.checked };
                            updatedQuestions[qIndex].matchItems = {
                              ...(updatedQuestions[qIndex].matchItems || { source: [], target: [] }),
                              source: items
                            };
                            dispatch({ 
                              type: 'UPDATE_ASSESSMENT', 
                              payload: { questions: updatedQuestions } 
                            });
                          }}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addMatchItem(qIndex, 'source')}
                  className="mt-2 text-blue-600"
                >
                  + Add Source
                </button>
              </div>
              <div>
                <label className="text-black">Target Items</label>
                {question.matchItems?.target.map((item, iIndex) => (
                  <div key={iIndex} className="mt-2">
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => updateMatchItem(qIndex, 'target', iIndex, e.target.value)}
                      className="w-full p-1 border text-black"
                      placeholder="Enter target item"
                    />
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <div>
                        <label className="text-sm">Match Max</label>
                        <input
                          type="number"
                          value={item.matchMax || ''}
                          onChange={(e) => {
                            const updatedQuestions = [...state.assessment.questions];
                            const items = [...(updatedQuestions[qIndex].matchItems?.target || [])];
                            items[iIndex] = { ...items[iIndex], matchMax: e.target.value ? Number(e.target.value) : undefined };
                            updatedQuestions[qIndex].matchItems = {
                              ...(updatedQuestions[qIndex].matchItems || { source: [], target: [] }),
                              target: items
                            };
                            dispatch({ 
                              type: 'UPDATE_ASSESSMENT', 
                              payload: { questions: updatedQuestions } 
                            });
                          }}
                          className="w-full p-1 border text-black"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="text-sm">Match Min</label>
                        <input
                          type="number"
                          value={item.matchMin || ''}
                          onChange={(e) => {
                            const updatedQuestions = [...state.assessment.questions];
                            const items = [...(updatedQuestions[qIndex].matchItems?.target || [])];
                            items[iIndex] = { ...items[iIndex], matchMin: e.target.value ? Number(e.target.value) : undefined };
                            updatedQuestions[qIndex].matchItems = {
                              ...(updatedQuestions[qIndex].matchItems || { source: [], target: [] }),
                              target: items
                            };
                            dispatch({ 
                              type: 'UPDATE_ASSESSMENT', 
                              payload: { questions: updatedQuestions } 
                            });
                          }}
                          className="w-full p-1 border text-black"
                          min="0"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm">Fixed</label>
                        <input
                          type="checkbox"
                          checked={item.fixed || false}
                          onChange={(e) => {
                            const updatedQuestions = [...state.assessment.questions];
                            const items = [...(updatedQuestions[qIndex].matchItems?.target || [])];
                            items[iIndex] = { ...items[iIndex], fixed: e.target.checked };
                            updatedQuestions[qIndex].matchItems = {
                              ...(updatedQuestions[qIndex].matchItems || { source: [], target: [] }),
                              target: items
                            };
                            dispatch({ 
                              type: 'UPDATE_ASSESSMENT', 
                              payload: { questions: updatedQuestions } 
                            });
                          }}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addMatchItem(qIndex, 'target')}
                  className="mt-2 text-blue-600"
                >
                  + Add Target
                </button>
              </div>
            </div>
          </div>
        );

      case 'inlineChoiceInteraction':
        return (
          <div className="mb-4">
            <label className="text-black">Dropdown Choices</label>
            {question.inlineChoices?.map((choice, cIndex) => (
              <div key={cIndex} className="flex items-center mt-2">
                <input
                  type="text"
                  value={choice.value}
                  onChange={(e) => {
                    const updatedQuestions = [...state.assessment.questions];
                    const choices = [...(updatedQuestions[qIndex].inlineChoices || [])];
                    choices[cIndex] = { ...choices[cIndex], value: e.target.value };
                    updatedQuestions[qIndex].inlineChoices = choices;
                    dispatch({ 
                      type: 'UPDATE_ASSESSMENT', 
                      payload: { questions: updatedQuestions } 
                    });
                  }}
                  className="flex-1 p-1 border mr-2 text-black"
                  placeholder="Enter choice text"
                />
                <input
                  type="radio"
                  checked={question.correctResponse[0] === choice.identifier}
                  onChange={() => updateQuestion(qIndex, 'correctResponse', [choice.identifier])}
                  className="ml-2"
                />
              </div>
            ))}
            <button
              onClick={() => {
                const updatedQuestions = [...state.assessment.questions];
                const choices = updatedQuestions[qIndex].inlineChoices || [];
                choices.push({
                  identifier: `IC${choices.length + 1}`,
                  value: ''
                });
                updatedQuestions[qIndex].inlineChoices = choices;
                dispatch({ 
                  type: 'UPDATE_ASSESSMENT', 
                  payload: { questions: updatedQuestions } 
                });
              }}
              className="mt-2 text-blue-600"
            >
              + Add Choice
            </button>
          </div>
        );

      case 'gapMatchInteraction':
        return (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-black">Response Identifier</label>
                <input
                  type="text"
                  value={question.responseIdentifier || ''}
                  onChange={(e) => updateQuestion(qIndex, 'responseIdentifier', e.target.value)}
                  className="w-full p-1 border mt-1 text-black"
                  placeholder="Required: Enter response identifier"
                />
              </div>
              <div>
                <label className="text-black">Shuffle</label>
                <input
                  type="checkbox"
                  checked={question.shuffle || false}
                  onChange={(e) => updateQuestion(qIndex, 'shuffle', e.target.checked)}
                  className="ml-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-black">Gap Texts (Draggable Items)</label>
                {question.gapTexts?.map((text, index) => (
                  <div key={index} className="mt-2">
                    <input
                      type="text"
                      value={text.value}
                      onChange={(e) => updateGapText(qIndex, index, e.target.value)}
                      className="w-full p-1 border text-black"
                      placeholder="Enter draggable text"
                    />
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <label className="text-sm">Match Max</label>
                        <input
                          type="number"
                          value={text.matchMax || ''}
                          onChange={(e) => {
                            const updatedQuestions = [...state.assessment.questions];
                            const gapTexts = [...(updatedQuestions[qIndex].gapTexts || [])];
                            gapTexts[index] = {
                              ...gapTexts[index],
                              matchMax: e.target.value ? Number(e.target.value) : undefined
                            };
                            updatedQuestions[qIndex].gapTexts = gapTexts;
                            dispatch({ 
                              type: 'UPDATE_ASSESSMENT', 
                              payload: { questions: updatedQuestions } 
                            });
                          }}
                          className="w-full p-1 border text-black"
                          min="0"
                          placeholder="Max uses"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm">Fixed</label>
                        <input
                          type="checkbox"
                          checked={text.fixed || false}
                          onChange={(e) => {
                            const updatedQuestions = [...state.assessment.questions];
                            const gapTexts = [...(updatedQuestions[qIndex].gapTexts || [])];
                            gapTexts[index] = {
                              ...gapTexts[index],
                              fixed: e.target.checked
                            };
                            updatedQuestions[qIndex].gapTexts = gapTexts;
                            dispatch({ 
                              type: 'UPDATE_ASSESSMENT', 
                              payload: { questions: updatedQuestions } 
                            });
                          }}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => addGapText(qIndex)} className="mt-2 text-blue-600">
                  + Add Gap Text
                </button>
              </div>
              <div>
                <label className="text-black">Gaps (Drop Zones)</label>
                <div className="mt-2">
                  <textarea
                    value={question.prompt}
                    onChange={(e) => updateQuestion(qIndex, 'prompt', e.target.value)}
                    className="w-full p-1 border text-black"
                    rows={4}
                    placeholder="Enter text with [gap1] [gap2] etc. placeholders"
                  />
                  <div className="mt-2">
                    {question.gaps?.map((gap, index) => (
                      <div key={index} className="mt-2">
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={gap}
                            onChange={(e) => {
                              const updatedQuestions = [...state.assessment.questions];
                              const gaps = [...(updatedQuestions[qIndex].gaps || [])];
                              gaps[index] = e.target.value;
                              updatedQuestions[qIndex].gaps = gaps;
                              dispatch({ 
                                type: 'UPDATE_ASSESSMENT', 
                                payload: { questions: updatedQuestions } 
                              });
                            }}
                            className="flex-1 p-1 border text-black"
                            placeholder={`Gap ${index + 1} identifier`}
                          />
                          <label className="ml-2">
                            <input
                              type="checkbox"
                              checked={question.correctResponse.includes(`${question.gapTexts?.[0]?.identifier} ${gap}`)}
                              onChange={(e) => {
                                const gapTextId = question.gapTexts?.[0]?.identifier;
                                const pair = `${gapTextId} ${gap}`;
                                const correctResponse = e.target.checked
                                  ? [...question.correctResponse, pair]
                                  : question.correctResponse.filter(id => id !== pair);
                                updateQuestion(qIndex, 'correctResponse', correctResponse);
                              }}
                              className="mr-1"
                            />
                            Required
                          </label>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const updatedQuestions = [...state.assessment.questions];
                        const gaps = [...(updatedQuestions[qIndex].gaps || [])];
                        gaps.push(`gap${gaps.length + 1}`);
                        updatedQuestions[qIndex].gaps = gaps;
                        dispatch({ 
                          type: 'UPDATE_ASSESSMENT', 
                          payload: { questions: updatedQuestions } 
                        });
                      }}
                      className="mt-2 text-blue-600"
                    >
                      + Add Gap
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'hotspotInteraction':
        return (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-black">Response Identifier</label>
                <input
                  type="text"
                  value={question.responseIdentifier || ''}
                  onChange={(e) => updateQuestion(qIndex, 'responseIdentifier', e.target.value)}
                  className="w-full p-1 border mt-1 text-black"
                  placeholder="Required: Enter response identifier"
                />
              </div>
              <div>
                <label className="text-black">Max Choices</label>
                <input
                  type="number"
                  value={question.maxChoices || ''}
                  onChange={(e) => updateQuestion(qIndex, 'maxChoices', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-1 border mt-1 text-black"
                  min="0"
                  placeholder="Optional: Maximum choices allowed"
                />
              </div>
              <div>
                <label className="text-black">Min Choices</label>
                <input
                  type="number"
                  value={question.minChoices || ''}
                  onChange={(e) => updateQuestion(qIndex, 'minChoices', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-1 border mt-1 text-black"
                  min="0"
                  placeholder="Optional: Minimum choices required"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-black">Image Configuration</label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <label className="text-sm">Image URL</label>
                  <input
                    type="text"
                    value={question.image || ''}
                    onChange={(e) => updateQuestion(qIndex, 'image', e.target.value)}
                    className="w-full p-1 border mt-1 text-black"
                    placeholder="Required: Enter image URL"
                  />
                </div>
                <div>
                  <label className="text-sm">Width</label>
                  <input
                    type="number"
                    value={question.imageWidth || ''}
                    onChange={(e) => updateQuestion(qIndex, 'imageWidth', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full p-1 border mt-1 text-black"
                    min="0"
                    placeholder="Image width in pixels"
                  />
                </div>
                <div>
                  <label className="text-sm">Height</label>
                  <input
                    type="number"
                    value={question.imageHeight || ''}
                    onChange={(e) => updateQuestion(qIndex, 'imageHeight', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full p-1 border mt-1 text-black"
                    min="0"
                    placeholder="Image height in pixels"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-black">Hotspots</label>
              {question.hotspots?.map((hotspot, index) => (
                <div key={index} className="mt-2 border p-4">
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <label className="text-sm">Identifier</label>
                      <input
                        type="text"
                        value={hotspot.identifier}
                        onChange={(e) => updateHotspot(qIndex, index, { identifier: e.target.value })}
                        className="w-full p-1 border mt-1 text-black"
                        placeholder="Required: Hotspot identifier"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Shape</label>
                      <select
                        value={hotspot.shape}
                        onChange={(e) => updateHotspot(qIndex, index, { shape: e.target.value as 'circle' | 'rect' | 'poly' })}
                        className="w-full p-1 border mt-1 text-black"
                      >
                        <option value="circle">Circle</option>
                        <option value="rect">Rectangle</option>
                        <option value="poly">Polygon</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="text-sm">Coordinates</label>
                    <input
                      type="text"
                      value={hotspot.coords}
                      onChange={(e) => updateHotspot(qIndex, index, { coords: e.target.value })}
                      className="w-full p-1 border mt-1 text-black"
                      placeholder={
                        hotspot.shape === 'circle' ? 'Format: x,y,radius' :
                        hotspot.shape === 'rect' ? 'Format: x1,y1,x2,y2' :
                        'Format: x1,y1,x2,y2,x3,y3,...'
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm">Hotspot Label</label>
                      <input
                        type="text"
                        value={hotspot.hotspotLabel || ''}
                        onChange={(e) => updateHotspot(qIndex, index, { hotspotLabel: e.target.value })}
                        className="w-full p-1 border mt-1 text-black"
                        placeholder="Optional: Label for the hotspot"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={hotspot.fixed || false}
                          onChange={(e) => updateHotspot(qIndex, index, { fixed: e.target.checked })}
                          className="mr-2"
                        />
                        Fixed Position
                      </label>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={question.correctResponse.includes(hotspot.identifier)}
                        onChange={(e) => {
                          const correctResponse = e.target.checked
                            ? [...question.correctResponse, hotspot.identifier]
                            : question.correctResponse.filter(id => id !== hotspot.identifier);
                          updateQuestion(qIndex, 'correctResponse', correctResponse);
                        }}
                        className="mr-2"
                      />
                      Correct Answer
                    </label>
                  </div>
                </div>
              ))}
              <button onClick={() => addHotspot(qIndex)} className="mt-2 text-blue-600">
                + Add Hotspot
              </button>
            </div>
          </div>
        );

      case 'graphicGapMatchInteraction':
        return (
          <div className="mb-4">
            <label className="text-black">Image URL</label>
            <input
              type="text"
              value={question.image || ''}
              onChange={(e) => updateQuestion(qIndex, 'image', e.target.value)}
              className="w-full p-1 border mt-1 text-black"
              placeholder="Enter image URL"
            />
            <div className="mt-4">
              <label className="text-black">Hotspots</label>
              {question.hotspots?.map((hotspot, index) => (
                <div key={index} className="mt-2 grid grid-cols-3 gap-2">
                  <select
                    value={hotspot.shape}
                    onChange={(e) => updateHotspot(qIndex, index, { shape: e.target.value as 'circle' | 'rect' | 'poly' })}
                    className="p-1 border text-black"
                  >
                    <option value="rect">Rectangle</option>
                    <option value="circle">Circle</option>
                    <option value="poly">Polygon</option>
                  </select>
                  <input
                    type="text"
                    value={hotspot.coords}
                    onChange={(e) => updateHotspot(qIndex, index, { coords: e.target.value })}
                    className="p-1 border text-black"
                    placeholder="Enter coordinates"
                  />
                  <input
                    type="checkbox"
                    checked={question.correctResponse.includes(hotspot.identifier)}
                    onChange={(e) => {
                      const correctResponse = e.target.checked
                        ? [...question.correctResponse, hotspot.identifier]
                        : question.correctResponse.filter(id => id !== hotspot.identifier);
                      updateQuestion(qIndex, 'correctResponse', correctResponse);
                    }}
                  />
                </div>
              ))}
              <button onClick={() => addHotspot(qIndex)} className="mt-2 text-blue-600">
                + Add Hotspot
              </button>
            </div>
          </div>
        );

      case 'sliderInteraction':
        return (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-black">Slider Configuration</label>
                <div className="mt-2 space-y-2">
                  <input
                    type="number"
                    value={question.sliderConfig?.min ?? 0}
                    onChange={(e) => {
                      const updatedQuestions = [...state.assessment.questions];
                      updatedQuestions[qIndex].sliderConfig = {
                        ...(updatedQuestions[qIndex].sliderConfig || { min: 0, max: 100, step: 1, orientation: 'horizontal' }),
                        min: Number(e.target.value)
                      };
                      dispatch({ 
                        type: 'UPDATE_ASSESSMENT', 
                        payload: { questions: updatedQuestions } 
                      });
                    }}
                    className="w-full p-1 border text-black"
                    placeholder="Minimum value"
                  />
                  <input
                    type="number"
                    value={question.sliderConfig?.max ?? 100}
                    onChange={(e) => {
                      const updatedQuestions = [...state.assessment.questions];
                      updatedQuestions[qIndex].sliderConfig = {
                        ...(updatedQuestions[qIndex].sliderConfig || { min: 0, max: 100, step: 1, orientation: 'horizontal' }),
                        max: Number(e.target.value)
                      };
                      dispatch({ 
                        type: 'UPDATE_ASSESSMENT', 
                        payload: { questions: updatedQuestions } 
                      });
                    }}
                    className="w-full p-1 border text-black"
                    placeholder="Maximum value"
                  />
                  <input
                    type="number"
                    value={question.sliderConfig?.step ?? 1}
                    onChange={(e) => {
                      const updatedQuestions = [...state.assessment.questions];
                      updatedQuestions[qIndex].sliderConfig = {
                        ...(updatedQuestions[qIndex].sliderConfig || { min: 0, max: 100, step: 1, orientation: 'horizontal' }),
                        step: Number(e.target.value)
                      };
                      dispatch({ 
                        type: 'UPDATE_ASSESSMENT', 
                        payload: { questions: updatedQuestions } 
                      });
                    }}
                    className="w-full p-1 border text-black"
                    placeholder="Step size"
                  />
                </div>
              </div>
              <div>
                <label className="text-black">Correct Value</label>
                <input
                  type="number"
                  value={question.correctResponse[0] || ''}
                  onChange={(e) => updateQuestion(qIndex, 'correctResponse', [e.target.value])}
                  className="w-full p-1 border mt-2 text-black"
                  placeholder="Enter correct value"
                />
              </div>
            </div>
          </div>
        );

      case 'drawingInteraction':
        return (
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-black">Canvas Configuration</label>
                <div className="mt-2 space-y-2">
                  <input
                    type="number"
                    value={question.drawingConfig?.width ?? 400}
                    onChange={(e) => {
                      const updatedQuestions = [...state.assessment.questions];
                      updatedQuestions[qIndex].drawingConfig = {
                        ...(updatedQuestions[qIndex].drawingConfig || { width: 400, height: 300, tools: ['pen', 'eraser'] }),
                        width: Number(e.target.value)
                      };
                      dispatch({ 
                        type: 'UPDATE_ASSESSMENT', 
                        payload: { questions: updatedQuestions } 
                      });
                    }}
                    className="w-full p-1 border text-black"
                    placeholder="Canvas width"
                  />
                  <input
                    type="number"
                    value={question.drawingConfig?.height ?? 300}
                    onChange={(e) => {
                      const updatedQuestions = [...state.assessment.questions];
                      updatedQuestions[qIndex].drawingConfig = {
                        ...(updatedQuestions[qIndex].drawingConfig || { width: 400, height: 300, tools: ['pen', 'eraser'] }),
                        height: Number(e.target.value)
                      };
                      dispatch({ 
                        type: 'UPDATE_ASSESSMENT', 
                        payload: { questions: updatedQuestions } 
                      });
                    }}
                    className="w-full p-1 border text-black"
                    placeholder="Canvas height"
                  />
                </div>
              </div>
              <div>
                <label className="text-black">Available Tools</label>
                <div className="mt-2 space-y-2">
                  {(['pen', 'eraser', 'shapes'] as DrawingTool[]).map((tool) => (
                    <label key={tool} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={question.drawingConfig?.tools.includes(tool)}
                        onChange={(e) => {
                          const updatedQuestions = [...state.assessment.questions];
                          const currentTools = updatedQuestions[qIndex].drawingConfig?.tools || [];
                          updatedQuestions[qIndex].drawingConfig = {
                            ...(updatedQuestions[qIndex].drawingConfig || { width: 400, height: 300, tools: [] }),
                            tools: e.target.checked
                              ? [...currentTools, tool]
                              : currentTools.filter(t => t !== tool)
                          };
                          dispatch({ 
                            type: 'UPDATE_ASSESSMENT', 
                            payload: { questions: updatedQuestions } 
                          });
                        }}
                        className="mr-2"
                      />
                      {tool.charAt(0).toUpperCase() + tool.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'uploadInteraction':
        return (
          <div className="mb-4">
            <label className="text-black">Allowed File Types</label>
            <input
              type="text"
              value={question.correctResponse.join(',')}
              onChange={(e) => updateQuestion(qIndex, 'correctResponse', e.target.value.split(','))}
              className="w-full p-1 border mt-1 text-black"
              placeholder="Enter allowed file extensions (e.g., .pdf,.doc,.docx)"
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Section editor component
  const SectionEditor = ({
    section,
    onUpdate,
    onDelete,
    level = 0
  }: {
    section: QTISection;
    onUpdate: (updates: Partial<QTISection>) => void;
    onDelete: () => void;
    level?: number;
  }) => {
    const addSubsection = () => {
      const newSection: QTISection = {
        identifier: `section_${Date.now()}`,
        title: 'New Section',
        visible: 'true',
        sections: [],
        items: []
      };
      onUpdate({
        sections: [...(section.sections || []), newSection]
      });
    };

    const addItem = () => {
      const newItem: QTIAssessmentItem = {
        identifier: `item_${Date.now()}`,
        title: 'New Item',
        questions: []
      };
      onUpdate({
        items: [...(section.items || []), newItem]
      });
    };

    const addQuestionToItem = (itemIndex: number) => {
      const updatedItems = [...(section.items || [])];
      const newQuestion: QTIQuestion = {
        identifier: `Q${updatedItems[itemIndex].questions.length + 1}`,
        type: 'choiceInteraction',
        prompt: '',
        choices: [],
        correctResponse: [],
        feedback: {
          correct: '',
          incorrect: ''
        }
      };
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        questions: [...updatedItems[itemIndex].questions, newQuestion]
      };
      onUpdate({ items: updatedItems });
    };

    const updateQuestion = (itemIndex: number, questionIndex: number, updates: Partial<QTIQuestion>) => {
      const updatedItems = [...(section.items || [])];
      const updatedQuestions = [...updatedItems[itemIndex].questions];
      updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], ...updates };
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], questions: updatedQuestions };
      onUpdate({ items: updatedItems });
    };

    const deleteQuestion = (itemIndex: number, questionIndex: number) => {
      const updatedItems = [...(section.items || [])];
      const updatedQuestions = [...updatedItems[itemIndex].questions];
      updatedQuestions.splice(questionIndex, 1);
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], questions: updatedQuestions };
      onUpdate({ items: updatedItems });
    };

    const updateSubsection = (index: number, updates: Partial<QTISection>) => {
      const updatedSections = [...(section.sections || [])];
      updatedSections[index] = { ...updatedSections[index], ...updates };
      onUpdate({ sections: updatedSections });
    };

    const deleteSubsection = (index: number) => {
      const updatedSections = [...(section.sections || [])];
      updatedSections.splice(index, 1);
      onUpdate({ sections: updatedSections });
    };

    return (
      <div className={`border p-4 mb-4 ${level > 0 ? 'ml-4' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Section: {section.title}</h3>
          {level > 0 && (
            <button
              onClick={onDelete}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Delete Section
            </button>
          )}
        </div>

        <CommonAttributesEditor
          attributes={section}
          onChange={(updates) => onUpdate(updates)}
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-black">Visible</label>
            <select
              value={section.visible}
              onChange={(e) => onUpdate({ visible: e.target.value as 'true' | 'false' })}
              className="w-full p-1 border mt-1 text-black"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div>
            <label className="text-black">Selection</label>
            <input
              type="number"
              value={section.selection || ''}
              onChange={(e) => onUpdate({ selection: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full p-1 border mt-1 text-black"
              min="0"
            />
          </div>
          <div>
            <label className="text-black">Ordering</label>
            <select
              value={section.ordering || ''}
              onChange={(e) => onUpdate({ ordering: e.target.value as 'random' | 'sequential' | undefined })}
              className="w-full p-1 border mt-1 text-black"
            >
              <option value="">Default</option>
              <option value="random">Random</option>
              <option value="sequential">Sequential</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2">Item Session Control</h3>
          <ItemSessionControlEditor
            control={section.itemSessionControl}
            onChange={(updates) => onUpdate({ itemSessionControl: updates })}
          />
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2">Time Limits</h3>
          <TimeLimitsEditor
            limits={section.timeLimits}
            onChange={(updates) => onUpdate({ timeLimits: updates })}
          />
        </div>

        <div className="mb-4">
          <h4 className="font-bold mb-2">Subsections</h4>
          {section.sections?.map((subsection, index) => (
            <SectionEditor
              key={subsection.identifier}
              section={subsection}
              onUpdate={(updates) => updateSubsection(index, updates)}
              onDelete={() => deleteSubsection(index)}
              level={level + 1}
            />
          ))}
          <button
            onClick={addSubsection}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mr-2"
          >
            Add Subsection
          </button>
        </div>

        <div className="mb-4">
          <h4 className="font-bold mb-2">Items</h4>
          {section.items?.map((item, itemIndex) => (
            <div key={item.identifier} className="border p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-bold">Item: {item.title}</h5>
                <button
                  onClick={() => addQuestionToItem(itemIndex)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Add Question
                </button>
              </div>

              {item.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="mb-6 p-4 border">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex-1">
                      <label className="text-black">Question Type</label>
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(itemIndex, questionIndex, { type: e.target.value as QuestionType })}
                        className="p-1 border text-black ml-2"
                      >
                        {questionTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => deleteQuestion(itemIndex, questionIndex)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-black">Response Identifier</label>
                      <input
                        type="text"
                        value={question.responseIdentifier || ''}
                        onChange={(e) => updateQuestion(itemIndex, questionIndex, { responseIdentifier: e.target.value })}
                        className="w-full p-1 border mt-1 text-black"
                      />
                    </div>
                    <div>
                      <label className="text-black">Required</label>
                      <input
                        type="checkbox"
                        checked={question.required || false}
                        onChange={(e) => updateQuestion(itemIndex, questionIndex, { required: e.target.checked })}
                        className="ml-2"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-black">Question Prompt</label>
                    <textarea
                      value={question.prompt}
                      onChange={(e) => updateQuestion(itemIndex, questionIndex, { prompt: e.target.value })}
                      className="w-full p-2 border mt-1 text-black"
                      rows={3}
                    />
                  </div>

                  {renderQuestionEditor(question, questionIndex)}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-black">Correct Feedback</label>
                      <textarea
                        value={question.feedback.correct}
                        onChange={(e) => updateQuestion(itemIndex, questionIndex, {
                          feedback: { ...question.feedback, correct: e.target.value }
                        })}
                        className="w-full p-1 border mt-1 text-black"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-black">Incorrect Feedback</label>
                      <textarea
                        value={question.feedback.incorrect}
                        onChange={(e) => updateQuestion(itemIndex, questionIndex, {
                          feedback: { ...question.feedback, incorrect: e.target.value }
                        })}
                        className="w-full p-1 border mt-1 text-black"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <button
            onClick={addItem}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Add Item
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 text-black">
      <form ref={formRef} onSubmit={handleSubmit}>
        <CommonAttributesEditor
          attributes={state.assessment}
          onChange={handleAttributesChange}
        />
        <div className="mb-4">
          <h3 className="font-bold mb-2 text-black">Test Parts</h3>
          {state.assessment.testParts?.map((testPart, index) => (
            <div key={testPart.identifier}>
              {/* Existing test part rendering logic */}
              <button onClick={() => handleTestPartUpdate(index, { title: 'Updated Title' })}>
                Update Title
              </button>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <h3 className="font-bold mb-2 text-black">Item Session Control</h3>
          <ItemSessionControlEditor
            control={state.assessment.itemSessionControl}
            onChange={(updates) => handleItemSessionControlChange(updates)}
          />
        </div>
        <div className="mb-4">
          <h3 className="font-bold mb-2 text-black">Time Limits</h3>
          <TimeLimitsEditor
            limits={state.assessment.timeLimits}
            onChange={(updates) => handleTimeLimitsChange(updates)}
          />
        </div>
        <div className="mb-4">
          <h3 className="font-bold mb-2 text-black">Pre-conditions</h3>
          <textarea
            value={state.assessment.preConditions?.join('\n') || ''}
            onChange={(e) => dispatch({ 
              type: 'UPDATE_ASSESSMENT', 
              payload: { preConditions: e.target.value.split('\n') } 
            })}
            className="w-full p-1 border mt-1 text-black"
            rows={3}
            placeholder="Enter one pre-condition per line"
          />
        </div>
        <div className="mb-4">
          <h3 className="font-bold mb-2 text-black">Test Parts</h3>
          {state.assessment.testParts?.map((testPart: QTITestPart, testPartIndex: number) => (
            <div key={testPart.identifier} className="border p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-black">Test Part: {testPart.title || testPart.identifier}</h4>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-black">Identifier</label>
                  <input
                    type="text"
                    name={`testParts[${testPartIndex}].identifier`}
                    defaultValue={testPart.identifier || ''}
                    className="w-full p-1 border mt-1 text-black"
                  />
                </div>
                <div>
                  <label className="text-black">Title</label>
                  <input
                    type="text"
                    name={`testParts[${testPartIndex}].title`}
                    defaultValue={testPart.title || ''}
                    className="w-full p-1 border mt-1 text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-black">Navigation Mode</label>
                  <select
                    name={`testParts[${testPartIndex}].navigationMode`}
                    defaultValue={testPart.navigationMode}
                    className="w-full p-1 border mt-1 text-black"
                  >
                    <option value="linear">Linear</option>
                    <option value="nonlinear">Non-linear</option>
                  </select>
                </div>
                <div>
                  <label className="text-black">Submission Mode</label>
                  <select
                    name={`testParts[${testPartIndex}].submissionMode`}
                    defaultValue={testPart.submissionMode}
                    className="w-full p-1 border mt-1 text-black"
                  >
                    <option value="individual">Individual</option>
                    <option value="simultaneous">Simultaneous</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-bold mb-2 text-black">Sections</h4>
                {testPart.sections?.map((section, sectionIndex) => (
                  <SectionEditor
                    key={section.identifier}
                    section={section}
                    onUpdate={(updates) => {
                      const updatedTestParts = [...(state.assessment.testParts || [])];
                      const updatedSections = [...testPart.sections];
                      updatedSections[sectionIndex] = { ...section, ...updates };
                      updatedTestParts[testPartIndex] = {
                        ...testPart,
                        sections: updatedSections
                      };
                      dispatch({ 
                        type: 'UPDATE_ASSESSMENT', 
                        payload: {
                          testParts: updatedTestParts
                        } 
                      });
                    }}
                    onDelete={() => {
                      const updatedTestParts = [...(state.assessment.testParts || [])];
                      const updatedSections = [...testPart.sections];
                      updatedSections.splice(sectionIndex, 1);
                      updatedTestParts[testPartIndex] = {
                        ...testPart,
                        sections: updatedSections
                      };
                      dispatch({ 
                        type: 'UPDATE_ASSESSMENT', 
                        payload: {
                          testParts: updatedTestParts
                        } 
                      });
                    }}
                  />
                ))}
                <button
                  onClick={() => {
                    const updatedTestParts = [...(state.assessment.testParts || [])];
                    const newSection: QTISection = {
                      identifier: `section_${Date.now()}`,
                      title: 'New Section',
                      visible: 'true',
                      sections: [],
                      items: []
                    };
                    updatedTestParts[testPartIndex] = {
                      ...testPart,
                      sections: [...(testPart.sections || []), newSection]
                    };
                    dispatch({ 
                      type: 'UPDATE_ASSESSMENT', 
                      payload: {
                        testParts: updatedTestParts
                      } 
                    });
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Add Section
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              const newTestPart: QTITestPart = {
                identifier: `testpart_${Date.now()}`,
                title: 'New Test Part',
                navigationMode: 'linear',
                submissionMode: 'individual',
                sections: []
              };
              dispatch({ 
                type: 'UPDATE_ASSESSMENT', 
                payload: {
                  testParts: [...(state.assessment.testParts || []), newTestPart]
                } 
              });
            }}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Add Test Part
          </button>
        </div>
        <button
          type="submit"
          disabled={state.isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {state.isSubmitting ? 'Submitting...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
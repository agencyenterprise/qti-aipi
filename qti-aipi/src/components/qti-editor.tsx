'use client';

import { useCallback, useRef, useReducer } from 'react';
import {
  QTITestPart,
  QTIHotspot,
  CommonAttributes,
  ItemSessionControl,
  TimeLimits,
  QTIAssessmentTest
} from '../types';
import { 
  CommonAttributesEditor, 
  ItemSessionControlEditor, 
  TimeLimitsEditor,
  TestPartEditor
} from './editors';

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

  return (
    <div className="p-4 text-black">
      <form ref={formRef} onSubmit={handleSubmit}>
        <CommonAttributesEditor
          attributes={state.assessment}
          onChange={handleAttributesChange}
        />
        <div className="mb-4">
          <h3 className="font-bold mb-2 text-black">Test Parts</h3>
          {state.assessment.testParts?.map((testPart: QTITestPart, testPartIndex: number) => (
            <TestPartEditor
              key={testPart.identifier}
              testPart={testPart}
              testPartIndex={testPartIndex}
              onUpdate={handleTestPartUpdate}
              updateChoice={updateChoice}
              addChoice={addChoice}
              updateOrderItem={updateOrderItem}
              addOrderItem={addOrderItem}
              updateMatchItem={updateMatchItem}
              addMatchItem={addMatchItem}
              updateGapText={updateGapText}
              addGapText={addGapText}
              updateHotspot={updateHotspot}
              addHotspot={addHotspot}
              state={state}
              dispatch={dispatch}
            />
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
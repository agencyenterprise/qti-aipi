'use client';

import { useCallback, useRef, useReducer } from 'react';
import {
  QTISection,
  QTITestPart,
  ItemSessionControl,
  TimeLimits,
  QTIAssessmentTest
} from '../types';
import { 
  CommonAttributesEditor, 
  ItemSessionControlEditor, 
  TimeLimitsEditor,
  SectionEditor
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

  return (
    <div className="p-4 text-black">
      <form ref={formRef} onSubmit={handleSubmit}>
        <CommonAttributesEditor
          attributes={state.assessment}
          onChange={(updates) => dispatch({ type: 'UPDATE_ASSESSMENT', payload: updates })}
        />

        <div className="mb-4">
          <h3 className="font-bold mb-2 text-black">Item Session Control</h3>
          <ItemSessionControlEditor
            control={state.assessment.itemSessionControl}
            onChange={(updates) => dispatch({ type: 'UPDATE_ASSESSMENT', payload: { itemSessionControl: updates } })}
          />
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2 text-black">Time Limits</h3>
          <TimeLimitsEditor
            limits={state.assessment.timeLimits}
            onChange={(updates) => dispatch({ type: 'UPDATE_ASSESSMENT', payload: { timeLimits: updates } })}
          />
        </div>

        <div className="mb-4">
          <h3 className="font-bold mb-2 text-black">Pre-conditions</h3>
          <textarea
            value={state.assessment.preConditions?.join('\n') || ''}
            onChange={(e) => dispatch({ type: 'UPDATE_ASSESSMENT', payload: { preConditions: e.target.value.split('\n') } })}
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

              <CommonAttributesEditor
                attributes={testPart}
                onChange={(updates) => {
                  const updatedTestParts = [...(state.assessment.testParts || [])];
                  updatedTestParts[testPartIndex] = { ...testPart, ...updates };
                  dispatch({ type: 'UPDATE_ASSESSMENT', payload: { testParts: updatedTestParts } });
                }}
              />

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-black">Navigation Mode</label>
                  <select
                    value={testPart.navigationMode}
                    onChange={(e) => {
                      const updatedTestParts = [...(state.assessment.testParts || [])];
                      updatedTestParts[testPartIndex] = {
                        ...testPart,
                        navigationMode: e.target.value as 'linear' | 'nonlinear'
                      };
                      dispatch({ type: 'UPDATE_ASSESSMENT', payload: { testParts: updatedTestParts } });
                    }}
                    className="w-full p-1 border mt-1 text-black"
                  >
                    <option value="linear">Linear</option>
                    <option value="nonlinear">Non-linear</option>
                  </select>
                </div>
                <div>
                  <label className="text-black">Submission Mode</label>
                  <select
                    value={testPart.submissionMode}
                    onChange={(e) => {
                      const updatedTestParts = [...(state.assessment.testParts || [])];
                      updatedTestParts[testPartIndex] = {
                        ...testPart,
                        submissionMode: e.target.value as 'individual' | 'simultaneous'
                      };
                      dispatch({ type: 'UPDATE_ASSESSMENT', payload: { testParts: updatedTestParts } });
                    }}
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
                      dispatch({ type: 'UPDATE_ASSESSMENT', payload: { testParts: updatedTestParts } });
                    }}
                    onDelete={() => {
                      const updatedTestParts = [...(state.assessment.testParts || [])];
                      const updatedSections = [...testPart.sections];
                      updatedSections.splice(sectionIndex, 1);
                      updatedTestParts[testPartIndex] = {
                        ...testPart,
                        sections: updatedSections
                      };
                      dispatch({ type: 'UPDATE_ASSESSMENT', payload: { testParts: updatedTestParts } });
                    }}
                  />
                ))}
                <button
                  type="button"
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
                    dispatch({ type: 'UPDATE_ASSESSMENT', payload: { testParts: updatedTestParts } });
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Add Section
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
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
                payload: { testParts: [...(state.assessment.testParts || []), newTestPart] } 
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
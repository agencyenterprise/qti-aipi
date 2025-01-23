import { QTIQuestion } from '../../types';
import { Dispatch } from 'react';
import { BasePromptInteraction } from './qti-base-prompt-interaction';
import { BasePromptInteractionType } from '../../types/base-prompt-interaction';

interface State {
  assessment: {
    questions: QTIQuestion[];
  };
  isSubmitting: boolean;
}

interface Action {
  type: 'UPDATE_ASSESSMENT' | 'START_SUBMISSION' | 'END_SUBMISSION';
  payload?: Partial<State['assessment']>;
}

interface BaseAction {
  type: 'UPDATE_ASSESSMENT';
  payload: {
    questions: BasePromptInteractionType[];
  };
}

interface MatchInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | undefined) => void;
  updateMatchItem: (questionIndex: number, type: 'source' | 'target', itemIndex: number, value: string) => void;
  addMatchItem: (questionIndex: number, type: 'source' | 'target') => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const MatchInteraction = ({
  question,
  qIndex,
  updateQuestion,
  updateMatchItem,
  addMatchItem,
  state,
  dispatch,
}: MatchInteractionProps) => {
  // Create a base prompt interaction object from the question
  const baseInteraction: BasePromptInteractionType = {
    id: question.identifier,
    responseIdentifier: question.responseIdentifier || '',
    qtiPrompt: question.prompt
  };

  // Create a handler to update base interaction fields
  const handleBaseInteractionUpdate = (
    index: number,
    field: keyof BasePromptInteractionType,
    value: string | number | boolean | { [key: string]: string }
  ) => {
    // Map base interaction fields back to question fields
    switch (field) {
      case 'id':
        updateQuestion(index, 'identifier', value as string);
        break;
      case 'qtiPrompt':
        updateQuestion(index, 'prompt', value as string);
        break;
      case 'responseIdentifier':
        updateQuestion(index, 'responseIdentifier', value as string);
        break;
    }
  };

  // Create a handler to map the dispatch for base interaction
  const handleBaseDispatch = (action: BaseAction) => {
    if (action.type === 'UPDATE_ASSESSMENT') {
      const updatedQuestions = [...state.assessment.questions];
      const baseQuestion = action.payload.questions[qIndex];
      updatedQuestions[qIndex] = {
        ...updatedQuestions[qIndex],
        identifier: baseQuestion.id || updatedQuestions[qIndex].identifier,
        responseIdentifier: baseQuestion.responseIdentifier,
        prompt: baseQuestion.qtiPrompt || updatedQuestions[qIndex].prompt
      };
      dispatch({
        type: 'UPDATE_ASSESSMENT',
        payload: { questions: updatedQuestions }
      });
    }
  };

  return (
    <div className="mb-4">
      {/* Base Prompt Interaction Fields */}
      <BasePromptInteraction
        interaction={baseInteraction}
        index={qIndex}
        updateInteraction={handleBaseInteractionUpdate}
        state={{ assessment: { questions: state.assessment.questions.map(q => ({
          id: q.identifier,
          responseIdentifier: q.responseIdentifier || '',
          qtiPrompt: q.prompt
        })) } }}
        dispatch={handleBaseDispatch}
      />

      {/* Match Interaction Specific Fields */}
      <div className="grid grid-cols-2 gap-4 mb-4">
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
          <label className="text-black">First Column Header</label>
          <input
            type="text"
            value={question.firstColumnHeader || ''}
            onChange={(e) => updateQuestion(qIndex, 'firstColumnHeader', e.target.value)}
            className="w-full p-1 border mt-1 text-black"
            placeholder="Header for first column"
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

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-black">Min Selections Message</label>
          <input
            type="text"
            value={question.minSelectionsMessage || ''}
            onChange={(e) => updateQuestion(qIndex, 'minSelectionsMessage', e.target.value)}
            className="w-full p-1 border mt-1 text-black"
            placeholder="Message for minimum selections violation"
          />
        </div>
        <div>
          <label className="text-black">Max Selections Message</label>
          <input
            type="text"
            value={question.maxSelectionsMessage || ''}
            onChange={(e) => updateQuestion(qIndex, 'maxSelectionsMessage', e.target.value)}
            className="w-full p-1 border mt-1 text-black"
            placeholder="Message for maximum selections violation"
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
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addMatchItem(qIndex, 'source');
            }}
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
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addMatchItem(qIndex, 'target');
            }}
            className="mt-2 text-blue-600"
          >
            + Add Target
          </button>
        </div>
      </div>
    </div>
  );
}; 
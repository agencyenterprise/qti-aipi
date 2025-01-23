import React from 'react';
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

interface GapMatchInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | undefined) => void;
  updateGapText: (questionIndex: number, gapIndex: number, value: string) => void;
  addGapText: (questionIndex: number) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const GapMatchInteraction = ({
  question,
  qIndex,
  updateQuestion,
  updateGapText,
  addGapText,
  state,
  dispatch,
}: GapMatchInteractionProps) => {
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

      {/* Gap Match Specific Fields */}
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
          <label className="text-black">Associations</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={question.minAssociations || ''}
              onChange={(e) => updateQuestion(qIndex, 'minAssociations', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-1 border mt-1 text-black"
              min="0"
              placeholder="Min associations"
            />
            <input
              type="number"
              value={question.maxAssociations || '1'}
              onChange={(e) => updateQuestion(qIndex, 'maxAssociations', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-1 border mt-1 text-black"
              min="0"
              placeholder="Max associations (default: 1)"
            />
          </div>
        </div>
        <div>
          <label className="text-black">Selection Messages</label>
          <div className="space-y-2">
            <input
              type="text"
              value={question.minSelectionsMessage || ''}
              onChange={(e) => updateQuestion(qIndex, 'minSelectionsMessage', e.target.value)}
              className="w-full p-1 border text-black"
              placeholder="Min selections message"
            />
            <input
              type="text"
              value={question.maxSelectionsMessage || ''}
              onChange={(e) => updateQuestion(qIndex, 'maxSelectionsMessage', e.target.value)}
              className="w-full p-1 border text-black"
              placeholder="Max selections message"
            />
          </div>
        </div>
        <div>
          <label className="text-black">Choices Container Width (px)</label>
          <input
            type="number"
            value={question.choicesContainerWidth || ''}
            onChange={(e) => updateQuestion(qIndex, 'choicesContainerWidth', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-1 border mt-1 text-black"
            min="0"
            placeholder="Container width in pixels"
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
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addGapText(qIndex);
            }} 
            className="mt-2 text-blue-600"
          >
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
                type="button"
                onClick={(e) => {
                  e.preventDefault();
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
}; 
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

interface SliderInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | undefined) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const SliderInteraction = ({
  question,
  qIndex,
  updateQuestion,
  state,
  dispatch
}: SliderInteractionProps) => {
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

      {/* Slider Interaction Specific Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-black">Slider Configuration</label>
          <div className="mt-2 space-y-2">
            <div>
              <label className="text-sm">Lower Bound</label>
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
                placeholder="Lower bound value"
              />
            </div>
            <div>
              <label className="text-sm">Upper Bound</label>
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
                placeholder="Upper bound value"
              />
            </div>
            <div>
              <label className="text-sm">Step Size</label>
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
                placeholder="Step size (default: 1)"
              />
            </div>
            <div>
              <label className="text-sm">Orientation</label>
              <select
                value={question.sliderConfig?.orientation || 'horizontal'}
                onChange={(e) => {
                  const updatedQuestions = [...state.assessment.questions];
                  updatedQuestions[qIndex].sliderConfig = {
                    ...(updatedQuestions[qIndex].sliderConfig || { min: 0, max: 100, step: 1, orientation: 'horizontal' }),
                    orientation: e.target.value as 'horizontal' | 'vertical'
                  };
                  dispatch({ 
                    type: 'UPDATE_ASSESSMENT', 
                    payload: { questions: updatedQuestions } 
                  });
                }}
                className="w-full p-1 border text-black"
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm mr-2">Show Step Labels</label>
                <input
                  type="checkbox"
                  checked={question.sliderConfig?.stepLabel || false}
                  onChange={(e) => {
                    const updatedQuestions = [...state.assessment.questions];
                    updatedQuestions[qIndex].sliderConfig = {
                      ...(updatedQuestions[qIndex].sliderConfig || { min: 0, max: 100, step: 1, orientation: 'horizontal' }),
                      stepLabel: e.target.checked
                    };
                    dispatch({ 
                      type: 'UPDATE_ASSESSMENT', 
                      payload: { questions: updatedQuestions } 
                    });
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm mr-2">Reverse</label>
                <input
                  type="checkbox"
                  checked={question.sliderConfig?.reverse || false}
                  onChange={(e) => {
                    const updatedQuestions = [...state.assessment.questions];
                    updatedQuestions[qIndex].sliderConfig = {
                      ...(updatedQuestions[qIndex].sliderConfig || { min: 0, max: 100, step: 1, orientation: 'horizontal' }),
                      reverse: e.target.checked
                    };
                    dispatch({ 
                      type: 'UPDATE_ASSESSMENT', 
                      payload: { questions: updatedQuestions } 
                    });
                  }}
                  className="mt-1"
                />
              </div>
            </div>
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
}; 
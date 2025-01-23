import { QTIQuestion } from '../../types';
import { Dispatch } from 'react';

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
}; 
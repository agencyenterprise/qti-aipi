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

interface InlineChoiceInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | undefined) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const InlineChoiceInteraction = ({
  question,
  qIndex,
  updateQuestion,
  state,
  dispatch,
}: InlineChoiceInteractionProps) => {
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
}; 
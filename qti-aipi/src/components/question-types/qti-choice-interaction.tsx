import { QTIQuestion } from '../../types';
import { Dispatch } from 'react';

interface State {
  assessment: {
    questions: QTIQuestion[];
  };
}

interface Action {
  type: 'UPDATE_ASSESSMENT';
  payload: {
    questions: QTIQuestion[];
  };
}

interface ChoiceInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (qIndex: number, field: keyof QTIQuestion, value: string | number | boolean | string[]) => void;
  updateChoice: (qIndex: number, cIndex: number, value: string) => void;
  addChoice: (qIndex: number) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const ChoiceInteraction = ({
  question,
  qIndex,
  updateQuestion,
  updateChoice,
  addChoice,
  state,
  dispatch
}: ChoiceInteractionProps) => {
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
}; 
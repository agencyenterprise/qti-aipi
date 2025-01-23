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

interface OrderInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | undefined) => void;
  updateOrderItem: (questionIndex: number, itemIndex: number, value: string) => void;
  addOrderItem: (questionIndex: number) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const OrderInteraction = ({
  question,
  qIndex,
  updateQuestion,
  updateOrderItem,
  addOrderItem,
  state,
  dispatch,
}: OrderInteractionProps) => {
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
}; 
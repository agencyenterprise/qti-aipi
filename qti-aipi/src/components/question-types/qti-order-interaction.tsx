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

      {/* Order Interaction Specific Fields */}
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
          <label className="text-black">Orientation</label>
          <select
            value={question.orientation || 'vertical'}
            onChange={(e) => updateQuestion(qIndex, 'orientation', e.target.value)}
            className="w-full p-1 border mt-1 text-black"
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
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

      <div className="mb-4">
        <label className="text-black">Container Width (pixels)</label>
        <input
          type="number"
          value={question.choicesContainerWidth || ''}
          onChange={(e) => updateQuestion(qIndex, 'choicesContainerWidth', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full p-1 border mt-1 text-black"
          min="0"
          placeholder="Width of choices container in pixels"
        />
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
        type="button"
        onClick={(e) => {
          e.preventDefault();
          addOrderItem(qIndex);
        }}
        className="mt-2 text-blue-600"
      >
        + Add Order Item
      </button>
    </div>
  );
}; 
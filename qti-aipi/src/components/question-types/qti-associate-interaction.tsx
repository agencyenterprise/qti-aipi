import { QTIQuestion, QTIChoice } from '../../types';
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

interface AssociateInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | QTIChoice[] | undefined) => void;
  updateAssociableChoice: (questionIndex: number, choiceIndex: number, value: string) => void;
  addAssociableChoice: (questionIndex: number) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const AssociateInteraction = ({
  question,
  qIndex,
  updateQuestion,
  updateAssociableChoice,
  addAssociableChoice,
}: AssociateInteractionProps) => {
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
          <label className="text-black">Max Associations</label>
          <input
            type="number"
            value={question.maxAssociations || ''}
            onChange={(e) => updateQuestion(qIndex, 'maxAssociations', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-1 border mt-1 text-black"
            min="0"
            placeholder="Maximum number of associations"
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
            placeholder="Minimum number of associations"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-black">Associable Choices</label>
        {question.associableChoices?.map((choice, cIndex) => (
          <div key={cIndex} className="flex items-center mt-2">
            <span className="mr-2 text-black">{cIndex + 1}.</span>
            <input
              type="text"
              value={choice.value}
              onChange={(e) => updateAssociableChoice(qIndex, cIndex, e.target.value)}
              className="flex-1 p-1 border text-black"
              placeholder="Enter choice text"
            />
            <div className="flex items-center ml-2">
              <label className="text-sm mr-2">Match Max</label>
              <input
                type="number"
                value={choice.matchMax || ''}
                onChange={(e) => {
                  const updatedChoices = [...(question.associableChoices || [])];
                  updatedChoices[cIndex] = {
                    ...updatedChoices[cIndex],
                    matchMax: e.target.value ? Number(e.target.value) : undefined
                  };
                  updateQuestion(qIndex, 'associableChoices', updatedChoices);
                }}
                className="w-16 p-1 border text-black"
                min="0"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addAssociableChoice(qIndex)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Choice
        </button>
      </div>
    </div>
  );
}; 
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

interface SelectPointInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | undefined) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const SelectPointInteraction = ({
  question,
  qIndex,
  updateQuestion,
}: SelectPointInteractionProps) => {
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
          <label className="text-black">Max Points</label>
          <input
            type="number"
            value={question.maxPoints || ''}
            onChange={(e) => updateQuestion(qIndex, 'maxPoints', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-1 border mt-1 text-black"
            min="0"
            placeholder="Maximum number of points"
          />
        </div>
        <div>
          <label className="text-black">Min Points</label>
          <input
            type="number"
            value={question.minPoints || ''}
            onChange={(e) => updateQuestion(qIndex, 'minPoints', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-1 border mt-1 text-black"
            min="0"
            placeholder="Minimum number of points"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-black">Background Image</label>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={question.image || ''}
            onChange={(e) => updateQuestion(qIndex, 'image', e.target.value)}
            className="flex-1 p-1 border mt-1 text-black"
            placeholder="Enter image URL"
          />
          <div>
            <label className="text-black text-sm">Width</label>
            <input
              type="number"
              value={question.imageWidth || ''}
              onChange={(e) => updateQuestion(qIndex, 'imageWidth', e.target.value ? Number(e.target.value) : undefined)}
              className="w-20 p-1 border mt-1 text-black"
              min="0"
              placeholder="Width"
            />
          </div>
          <div>
            <label className="text-black text-sm">Height</label>
            <input
              type="number"
              value={question.imageHeight || ''}
              onChange={(e) => updateQuestion(qIndex, 'imageHeight', e.target.value ? Number(e.target.value) : undefined)}
              className="w-20 p-1 border mt-1 text-black"
              min="0"
              placeholder="Height"
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 
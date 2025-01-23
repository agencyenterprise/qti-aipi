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

interface UploadInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | undefined) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const UploadInteraction = ({
  question,
  qIndex,
  updateQuestion
}: UploadInteractionProps) => {
  return (
    <div className="mb-4">
      <label className="text-black">Allowed File Types</label>
      <input
        type="text"
        value={question.correctResponse.join(',')}
        onChange={(e) => updateQuestion(qIndex, 'correctResponse', e.target.value.split(','))}
        className="w-full p-1 border mt-1 text-black"
        placeholder="Enter allowed file extensions (e.g., .pdf,.doc,.docx)"
      />
    </div>
  );
}; 
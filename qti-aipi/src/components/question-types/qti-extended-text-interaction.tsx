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

interface ExtendedTextInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | undefined) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const ExtendedTextInteraction = ({
  question,
  qIndex,
  updateQuestion,
}: ExtendedTextInteractionProps) => {
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
          <label className="text-black">Format</label>
          <select
            value={question.format || 'plain'}
            onChange={(e) => updateQuestion(qIndex, 'format', e.target.value)}
            className="w-full p-1 border mt-1 text-black"
          >
            <option value="plain">Plain Text</option>
            <option value="preformatted">Preformatted</option>
            <option value="xhtml">XHTML</option>
            <option value="rtf">RTF</option>
          </select>
        </div>
        <div>
          <label className="text-black">Expected Length</label>
          <input
            type="number"
            value={question.expectedLength || ''}
            onChange={(e) => updateQuestion(qIndex, 'expectedLength', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-1 border mt-1 text-black"
            min="0"
            placeholder="Optional: Expected response length"
          />
        </div>
        <div>
          <label className="text-black">String Limits</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={question.minStrings || ''}
              onChange={(e) => updateQuestion(qIndex, 'minStrings', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-1 border mt-1 text-black"
              placeholder="Min strings"
              min="0"
            />
            <input
              type="number"
              value={question.maxStrings || ''}
              onChange={(e) => updateQuestion(qIndex, 'maxStrings', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-1 border mt-1 text-black"
              placeholder="Max strings"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-black">Model Answer</label>
        <textarea
          value={question.correctResponse[0] || ''}
          onChange={(e) => updateQuestion(qIndex, 'correctResponse', [e.target.value])}
          className="w-full p-1 border mt-1 text-black"
          rows={4}
          placeholder="Enter model essay answer"
        />
      </div>

      <div className="mb-4">
        <label className="text-black">Rubric</label>
        <textarea
          value={question.rubricBlock || ''}
          onChange={(e) => updateQuestion(qIndex, 'rubricBlock', e.target.value)}
          className="w-full p-1 border mt-1 text-black"
          rows={3}
          placeholder="Enter scoring rubric or guidelines"
        />
      </div>
    </div>
  );
}; 
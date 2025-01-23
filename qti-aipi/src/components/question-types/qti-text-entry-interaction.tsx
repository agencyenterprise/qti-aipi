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

interface TextEntryInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | undefined) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const TextEntryInteraction = ({
  question,
  qIndex,
  updateQuestion,
}: TextEntryInteractionProps) => {
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
          <label className="text-black">Base Type</label>
          <select
            value={question.baseType || 'string'}
            onChange={(e) => updateQuestion(qIndex, 'baseType', e.target.value)}
            className="w-full p-1 border mt-1 text-black"
          >
            <option value="string">String</option>
            <option value="integer">Integer</option>
            <option value="float">Float</option>
          </select>
        </div>
        <div>
          <label className="text-black">Pattern</label>
          <input
            type="text"
            value={question.pattern || ''}
            onChange={(e) => updateQuestion(qIndex, 'pattern', e.target.value)}
            className="w-full p-1 border mt-1 text-black"
            placeholder="Optional: Regular expression pattern"
          />
        </div>
        <div>
          <label className="text-black">Format</label>
          <select
            value={question.format || 'plain'}
            onChange={(e) => updateQuestion(qIndex, 'format', e.target.value)}
            className="w-full p-1 border mt-1 text-black"
          >
            <option value="plain">Plain</option>
            <option value="preformatted">Preformatted</option>
            <option value="xhtml">XHTML</option>
          </select>
        </div>
        <div>
          <label className="text-black">Placeholder</label>
          <input
            type="text"
            value={question.placeholder || ''}
            onChange={(e) => updateQuestion(qIndex, 'placeholder', e.target.value)}
            className="w-full p-1 border mt-1 text-black"
            placeholder="Optional: Placeholder text"
          />
        </div>
        <div>
          <label className="text-black">Expected Length</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={question.minLength || ''}
              onChange={(e) => updateQuestion(qIndex, 'minLength', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-1 border mt-1 text-black"
              placeholder="Min"
              min="0"
            />
            <input
              type="number"
              value={question.maxLength || ''}
              onChange={(e) => updateQuestion(qIndex, 'maxLength', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-1 border mt-1 text-black"
              placeholder="Max"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-black">Expected Answer</label>
        <textarea
          value={question.correctResponse[0] || ''}
          onChange={(e) => updateQuestion(qIndex, 'correctResponse', [e.target.value])}
          className="w-full p-1 border mt-1 text-black"
          rows={2}
          placeholder="Enter expected answer"
        />
      </div>

      <div className="mb-4">
        <label className="text-black">Case Sensitive</label>
        <input
          type="checkbox"
          checked={question.caseSensitive || false}
          onChange={(e) => updateQuestion(qIndex, 'caseSensitive', e.target.checked)}
          className="ml-2"
        />
      </div>
    </div>
  );
}; 
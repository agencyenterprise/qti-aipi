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

interface CustomInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | Record<string, string | number | boolean | null> | undefined) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const CustomInteraction = ({
  question,
  qIndex,
  updateQuestion,
}: CustomInteractionProps) => {
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
          <label className="text-black">Custom Namespace</label>
          <input
            type="text"
            value={question.customNamespace || ''}
            onChange={(e) => updateQuestion(qIndex, 'customNamespace', e.target.value)}
            className="w-full p-1 border mt-1 text-black"
            placeholder="Enter custom namespace"
          />
        </div>
        <div>
          <label className="text-black">Custom Element</label>
          <input
            type="text"
            value={question.customElement || ''}
            onChange={(e) => updateQuestion(qIndex, 'customElement', e.target.value)}
            className="w-full p-1 border mt-1 text-black"
            placeholder="Enter custom element name"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-black">Custom Properties</label>
        <textarea
          value={question.customProperties ? JSON.stringify(question.customProperties, null, 2) : ''}
          onChange={(e) => {
            try {
              const properties = JSON.parse(e.target.value);
              updateQuestion(qIndex, 'customProperties', properties);
            } catch {
              // Silently ignore JSON parse errors to allow for partial input
              // The properties won't be updated until valid JSON is entered
            }
          }}
          className="w-full p-1 border mt-1 text-black font-mono"
          rows={5}
          placeholder="Enter custom properties as JSON"
        />
      </div>
    </div>
  );
}; 
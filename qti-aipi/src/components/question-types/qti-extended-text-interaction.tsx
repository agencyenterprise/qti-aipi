import React from 'react';
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
  state,
  dispatch
}: ExtendedTextInteractionProps) => {
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

      {/* Extended Text Specific Fields */}
      <div className="grid grid-cols-2 gap-4 mb-4">
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
          </select>
        </div>
        <div>
          <label className="text-black">Base</label>
          <input
            type="number"
            value={question.base || 10}
            onChange={(e) => updateQuestion(qIndex, 'base', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-1 border mt-1 text-black"
            min="2"
            placeholder="Default: 10"
          />
        </div>
        <div>
          <label className="text-black">String Identifier</label>
          <input
            type="text"
            value={question.stringIdentifier || ''}
            onChange={(e) => updateQuestion(qIndex, 'stringIdentifier', e.target.value)}
            className="w-full p-1 border mt-1 text-black"
            placeholder="Optional: String identifier"
          />
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
          <label className="text-black">Pattern Mask</label>
          <input
            type="text"
            value={question.patternMask || ''}
            onChange={(e) => updateQuestion(qIndex, 'patternMask', e.target.value)}
            className="w-full p-1 border mt-1 text-black"
            placeholder="Optional: Regular expression pattern"
          />
        </div>
        <div>
          <label className="text-black">Pattern Mask Message</label>
          <input
            type="text"
            value={question.patternMaskMessage || ''}
            onChange={(e) => updateQuestion(qIndex, 'patternMaskMessage', e.target.value)}
            className="w-full p-1 border mt-1 text-black"
            placeholder="Message for pattern mask violation"
          />
        </div>
        <div>
          <label className="text-black">Placeholder Text</label>
          <input
            type="text"
            value={question.placeholderText || ''}
            onChange={(e) => updateQuestion(qIndex, 'placeholderText', e.target.value)}
            className="w-full p-1 border mt-1 text-black"
            placeholder="Optional: Placeholder text"
          />
        </div>
        <div>
          <label className="text-black">Expected Lines</label>
          <input
            type="number"
            value={question.expectedLines || ''}
            onChange={(e) => updateQuestion(qIndex, 'expectedLines', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-1 border mt-1 text-black"
            min="0"
            placeholder="Optional: Expected number of lines"
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
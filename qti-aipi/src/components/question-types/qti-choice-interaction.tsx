import React from 'react';
import { SimpleChoice } from '../../types/choice-interaction';
import { ShowHide } from '../../types/base-types';
import { QTIQuestion } from '../../types';

interface ChoiceInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (
    index: number,
    field: keyof QTIQuestion,
    value: string | number | boolean | SimpleChoice[] | string[] | { [key: string]: string } | undefined
  ) => void;
  updateChoice: (questionIndex: number, choiceIndex: number, value: string) => void;
  addChoice: (e: React.MouseEvent, questionIndex: number) => void;
  state: {
    assessment: {
      questions: QTIQuestion[];
    };
    isSubmitting: boolean;
  };
  dispatch: (action: { type: string; payload?: { questions?: QTIQuestion[] } }) => void;
}

export const ChoiceInteraction = ({
  question,
  qIndex,
  updateQuestion,
  updateChoice,
  addChoice,
}: ChoiceInteractionProps) => {
  if (!question) {
    return null;
  }

  return (
    <div className="mb-4">
      {/* Response Identifier */}
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
      
      {/* Prompt */}
      <div>
        <label className="text-black">Prompt</label>
        <textarea
          value={question.prompt || ''}
          onChange={(e) => updateQuestion(qIndex, 'prompt', e.target.value)}
          className="w-full p-1 border mt-1 text-black"
          placeholder="Optional: Enter the prompt text"
        />
      </div>
      
      {/* Choice-specific Fields */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-black">Max Choices</label>
          <input
            type="number"
            value={question.maxChoices || 1}
            onChange={(e) => updateQuestion(qIndex, 'maxChoices', Number(e.target.value))}
            className="w-full p-1 border mt-1 text-black"
            min="1"
            placeholder="Default: 1"
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
            placeholder="Default: 0"
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
        <div>
          <label className="text-black">Orientation</label>
          <select
            value={question.orientation || 'vertical'}
            onChange={(e) => updateQuestion(qIndex, 'orientation', e.target.value as 'horizontal' | 'vertical')}
            className="w-full p-1 border mt-1 text-black"
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>
      </div>

      {/* Choices */}
      <div className="mb-4">
        <label className="text-black">Choices</label>
        {question.choices?.map((choice, cIndex) => (
          <div key={cIndex} className="flex items-center mt-2">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div>
                <input
                  type="text"
                  value={choice?.identifier || ''}
                  onChange={(e) => {
                    const updatedChoices = [...(question.choices || [])];
                    updatedChoices[cIndex] = { ...updatedChoices[cIndex], identifier: e.target.value };
                    updateQuestion(qIndex, 'choices', updatedChoices);
                  }}
                  className="w-full p-1 border text-black"
                  placeholder="Enter choice identifier"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={choice?.value || ''}
                  onChange={(e) => updateChoice(qIndex, cIndex, e.target.value)}
                  className="w-full p-1 border text-black"
                  placeholder="Enter choice text"
                />
              </div>
            </div>
            <div className="flex items-center ml-2">
              <label className="text-sm mr-2">Fixed</label>
              <input
                type="checkbox"
                checked={choice?.fixed || false}
                onChange={(e) => {
                  const updatedChoices = [...(question.choices || [])];
                  updatedChoices[cIndex] = { ...updatedChoices[cIndex], fixed: e.target.checked };
                  updateQuestion(qIndex, 'choices', updatedChoices);
                }}
                className="mr-4"
              />
              <label className="text-sm mr-2">Show/Hide</label>
              <select
                value={choice?.showHide || 'show'}
                onChange={(e) => {
                  const updatedChoices = [...(question.choices || [])];
                  updatedChoices[cIndex] = { ...updatedChoices[cIndex], showHide: e.target.value as ShowHide };
                  updateQuestion(qIndex, 'choices', updatedChoices);
                }}
                className="mr-4 p-1 border text-black"
              >
                <option value="show">Show</option>
                <option value="hide">Hide</option>
              </select>
              <label className="text-sm mr-2">Correct</label>
              <input
                type="checkbox"
                checked={question.correctResponse?.includes(choice?.identifier || '') || false}
                onChange={(e) => {
                  const correctResponse = e.target.checked
                    ? [...(question.correctResponse || []), choice.identifier]
                    : (question.correctResponse || []).filter(id => id !== choice.identifier);
                  updateQuestion(qIndex, 'correctResponse', correctResponse);
                }}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addChoice(e, qIndex);
          }}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Choice
        </button>
      </div>
    </div>
  );
}; 
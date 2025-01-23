import React from 'react';
import { Dispatch } from 'react';
import { BasePromptInteraction } from './qti-base-prompt-interaction';
import { QTIQuestion } from '../../types';
import { BasePromptInteractionType } from '../../types/base-prompt-interaction';
import { SimpleChoice } from '../../types/choice-interaction';


interface State {
  assessment: {
    questions: QTIQuestion[];
  };
  isSubmitting: boolean;
}

interface AssociateAction {
  type: 'UPDATE_ASSESSMENT' | 'START_SUBMISSION' | 'END_SUBMISSION';
  payload?: {
    questions?: QTIQuestion[];
  };
}

interface BaseAction {
  type: 'UPDATE_ASSESSMENT';
  payload: {
    questions: BasePromptInteractionType[];
  };
}

interface AssociateInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | SimpleChoice[] | { [key: string]: string } | undefined) => void;
  updateAssociableChoice: (questionIndex: number, choiceIndex: number, value: string) => void;
  addAssociableChoice: (questionIndex: number) => void;
  state: State;
  dispatch: Dispatch<AssociateAction>;
}

export const AssociateInteraction = ({
  question,
  qIndex,
  updateQuestion,
  updateAssociableChoice,
  addAssociableChoice,
  state,
  dispatch
}: AssociateInteractionProps) => {
  const handleBaseDispatch = (baseAction: BaseAction) => {
    if (baseAction.type === 'UPDATE_ASSESSMENT') {
      const baseQuestion = baseAction.payload.questions[qIndex];
      const updatedQuestions = state.assessment.questions.map((q, i) => 
        i === qIndex ? {
          ...q,
          id: baseQuestion.id,
          responseIdentifier: baseQuestion.responseIdentifier,
          qtiPrompt: baseQuestion.qtiPrompt
        } : q
      );
      dispatch({
        type: 'UPDATE_ASSESSMENT',
        payload: { questions: updatedQuestions }
      });
    }
  };

  // Create base interaction object from question
  const baseInteraction: BasePromptInteractionType = {
    id: question.identifier,
    responseIdentifier: question.responseIdentifier || '',
    qtiPrompt: question.prompt
  };

  return (
    <div className="mb-4">
      <BasePromptInteraction
        interaction={baseInteraction}
        index={qIndex}
        updateInteraction={(index, field, value) => {
          switch (field) {
            case 'id':
              updateQuestion(index, 'identifier', value as string);
              break;
            case 'responseIdentifier':
              updateQuestion(index, 'responseIdentifier', value as string);
              break;
            case 'qtiPrompt':
              updateQuestion(index, 'prompt', value as string);
              break;
          }
        }}
        state={{ assessment: { questions: state.assessment.questions.map(q => ({
          id: q.identifier,
          responseIdentifier: q.responseIdentifier || '',
          qtiPrompt: q.prompt
        })) } }}
        dispatch={handleBaseDispatch}
      />
      
      {/* Associate-specific Fields */}
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
          <label className="text-black">Max Associations</label>
          <input
            type="number"
            value={question.maxAssociations || ''}
            onChange={(e) => updateQuestion(qIndex, 'maxAssociations', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-1 border mt-1 text-black"
            min="0"
            placeholder="Default: 1"
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
            placeholder="Default: 0"
          />
        </div>
      </div>

      {/* Associable Choices */}
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
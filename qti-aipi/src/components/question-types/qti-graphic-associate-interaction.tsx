import React from 'react';
import { QTIQuestion, QTIHotspot } from '../../types';
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

interface GraphicAssociateInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | QTIHotspot[] | undefined) => void;
  updateHotspot: (questionIndex: number, hotspotIndex: number, updates: Partial<QTIHotspot>) => void;
  addHotspot: (questionIndex: number) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const GraphicAssociateInteraction = ({
  question,
  qIndex,
  updateQuestion,
  updateHotspot,
  addHotspot,
  state,
  dispatch
}: GraphicAssociateInteractionProps) => {
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

      {/* Graphic Associate Specific Fields */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-black">Associations</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={question.minAssociations || ''}
              onChange={(e) => updateQuestion(qIndex, 'minAssociations', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-1 border mt-1 text-black"
              min="0"
              placeholder="Min associations"
            />
            <input
              type="number"
              value={question.maxAssociations || '1'}
              onChange={(e) => updateQuestion(qIndex, 'maxAssociations', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-1 border mt-1 text-black"
              min="0"
              placeholder="Max associations (default: 1)"
            />
          </div>
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

      <div className="mb-4">
        <label className="text-black">Associable Hotspots</label>
        {question.associableHotspots?.map((hotspot, hIndex) => (
          <div key={hIndex} className="flex items-center mt-2">
            <span className="mr-2 text-black">{hIndex + 1}.</span>
            <input
              type="text"
              value={hotspot.value || ''}
              onChange={(e) => updateHotspot(qIndex, hIndex, { value: e.target.value })}
              className="flex-1 p-1 border text-black"
              placeholder="Enter hotspot text"
            />
            <div className="flex items-center ml-2">
              <label className="text-sm mr-2">Match Max</label>
              <input
                type="number"
                value={hotspot.matchMax || ''}
                onChange={(e) => updateHotspot(qIndex, hIndex, { matchMax: e.target.value ? Number(e.target.value) : undefined })}
                className="w-16 p-1 border text-black"
                min="0"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addHotspot(qIndex);
          }}
          className="mt-2 text-blue-600"
        >
          + Add Hotspot
        </button>
      </div>
    </div>
  );
}; 
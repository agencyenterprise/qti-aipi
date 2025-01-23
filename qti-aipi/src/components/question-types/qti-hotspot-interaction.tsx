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

interface HotspotInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | undefined) => void;
  updateHotspot: (questionIndex: number, hotspotIndex: number, updates: Partial<QTIHotspot>) => void;
  addHotspot: (questionIndex: number) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const HotspotInteraction = ({
  question,
  qIndex,
  updateQuestion,
  updateHotspot,
  addHotspot,
  state,
  dispatch,
}: HotspotInteractionProps) => {
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

      {/* Hotspot Specific Fields */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-black">Choices</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={question.minChoices || '0'}
              onChange={(e) => updateQuestion(qIndex, 'minChoices', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-1 border mt-1 text-black"
              min="0"
              placeholder="Min choices (default: 0)"
            />
            <input
              type="number"
              value={question.maxChoices || '1'}
              onChange={(e) => updateQuestion(qIndex, 'maxChoices', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-1 border mt-1 text-black"
              min="0"
              placeholder="Max choices (default: 1)"
            />
          </div>
        </div>
        <div>
          <label className="text-black">Selection Messages</label>
          <div className="space-y-2">
            <input
              type="text"
              value={question.minSelectionsMessage || ''}
              onChange={(e) => updateQuestion(qIndex, 'minSelectionsMessage', e.target.value)}
              className="w-full p-1 border text-black"
              placeholder="Min selections message"
            />
            <input
              type="text"
              value={question.maxSelectionsMessage || ''}
              onChange={(e) => updateQuestion(qIndex, 'maxSelectionsMessage', e.target.value)}
              className="w-full p-1 border text-black"
              placeholder="Max selections message"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-black">Image Configuration</label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div>
            <label className="text-sm">Image URL</label>
            <input
              type="text"
              value={question.image || ''}
              onChange={(e) => updateQuestion(qIndex, 'image', e.target.value)}
              className="w-full p-1 border mt-1 text-black"
              placeholder="Required: Enter image URL"
            />
          </div>
          <div>
            <label className="text-sm">Width</label>
            <input
              type="number"
              value={question.imageWidth || ''}
              onChange={(e) => updateQuestion(qIndex, 'imageWidth', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-1 border mt-1 text-black"
              min="0"
              placeholder="Image width in pixels"
            />
          </div>
          <div>
            <label className="text-sm">Height</label>
            <input
              type="number"
              value={question.imageHeight || ''}
              onChange={(e) => updateQuestion(qIndex, 'imageHeight', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-1 border mt-1 text-black"
              min="0"
              placeholder="Image height in pixels"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-black">Hotspots</label>
        {question.hotspots?.map((hotspot, index) => (
          <div key={index} className="mt-2 border p-4">
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="text-sm">Identifier</label>
                <input
                  type="text"
                  value={hotspot.identifier}
                  onChange={(e) => updateHotspot(qIndex, index, { identifier: e.target.value })}
                  className="w-full p-1 border mt-1 text-black"
                  placeholder="Required: Hotspot identifier"
                />
              </div>
              <div>
                <label className="text-sm">Shape</label>
                <select
                  value={hotspot.shape}
                  onChange={(e) => updateHotspot(qIndex, index, { shape: e.target.value as 'circle' | 'rect' | 'poly' })}
                  className="w-full p-1 border mt-1 text-black"
                >
                  <option value="circle">Circle</option>
                  <option value="rect">Rectangle</option>
                  <option value="poly">Polygon</option>
                </select>
              </div>
            </div>

            <div className="mb-2">
              <label className="text-sm">Coordinates</label>
              <input
                type="text"
                value={hotspot.coords}
                onChange={(e) => updateHotspot(qIndex, index, { coords: e.target.value })}
                className="w-full p-1 border mt-1 text-black"
                placeholder={
                  hotspot.shape === 'circle' ? 'Format: x,y,radius' :
                  hotspot.shape === 'rect' ? 'Format: x1,y1,x2,y2' :
                  'Format: x1,y1,x2,y2,x3,y3,...'
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Hotspot Label</label>
                <input
                  type="text"
                  value={hotspot.hotspotLabel || ''}
                  onChange={(e) => updateHotspot(qIndex, index, { hotspotLabel: e.target.value })}
                  className="w-full p-1 border mt-1 text-black"
                  placeholder="Optional: Label for the hotspot"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hotspot.fixed || false}
                    onChange={(e) => updateHotspot(qIndex, index, { fixed: e.target.checked })}
                    className="mr-2"
                  />
                  Fixed Position
                </label>
              </div>
            </div>

            <div className="mt-2 flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={question.correctResponse.includes(hotspot.identifier)}
                  onChange={(e) => {
                    const correctResponse = e.target.checked
                      ? [...question.correctResponse, hotspot.identifier]
                      : question.correctResponse.filter(id => id !== hotspot.identifier);
                    updateQuestion(qIndex, 'correctResponse', correctResponse);
                  }}
                  className="mr-2"
                />
                Correct Answer
              </label>
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
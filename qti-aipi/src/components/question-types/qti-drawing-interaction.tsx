import React from 'react';
import { QTIQuestion, DrawingTool } from '../../types';
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

interface DrawingInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | undefined) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const DrawingInteraction = ({
  question,
  qIndex,
  updateQuestion,
  state,
  dispatch
}: DrawingInteractionProps) => {
  // Default drawing configuration
  const defaultDrawingConfig = {
    width: 400,
    height: 300,
    tools: ['pen', 'eraser'] as DrawingTool[],
    grid: false,
    gridSize: 20,
    background: ''
  };

  // Ensure drawing config is always initialized
  const drawingConfig = question.drawingConfig || defaultDrawingConfig;

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

  // Handler for updating drawing configuration
  const updateDrawingConfig = (updates: Partial<typeof defaultDrawingConfig>) => {
    const updatedQuestions = [...state.assessment.questions];
    updatedQuestions[qIndex].drawingConfig = {
      ...drawingConfig,
      ...updates
    };
    dispatch({
      type: 'UPDATE_ASSESSMENT',
      payload: { questions: updatedQuestions }
    });
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

      {/* Drawing-specific Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-black">Canvas Configuration</label>
          <div className="mt-2 space-y-2">
            <input
              type="number"
              value={drawingConfig.width}
              onChange={(e) => updateDrawingConfig({ width: Number(e.target.value) })}
              className="w-full p-1 border text-black"
              placeholder="Canvas width"
            />
            <input
              type="number"
              value={drawingConfig.height}
              onChange={(e) => updateDrawingConfig({ height: Number(e.target.value) })}
              className="w-full p-1 border text-black"
              placeholder="Canvas height"
            />
          </div>
        </div>
        <div>
          <label className="text-black">Available Tools</label>
          <div className="mt-2 space-y-2">
            {(['pen', 'eraser', 'shapes'] as DrawingTool[]).map((tool) => (
              <label key={tool} className="flex items-center">
                <input
                  type="checkbox"
                  checked={drawingConfig.tools.includes(tool)}
                  onChange={(e) => {
                    const currentTools = drawingConfig.tools;
                    updateDrawingConfig({
                      tools: e.target.checked
                        ? [...currentTools, tool]
                        : currentTools.filter(t => t !== tool)
                    });
                  }}
                  className="mr-2"
                />
                {tool.charAt(0).toUpperCase() + tool.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Background Image */}
      <div className="mt-4">
        <label className="text-black">Background Image</label>
        <div className="mt-2">
          <input
            type="text"
            value={drawingConfig.background}
            onChange={(e) => updateDrawingConfig({ background: e.target.value })}
            className="w-full p-1 border text-black"
            placeholder="Enter background image URL"
          />
        </div>
      </div>

      {/* Grid Configuration */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="text-black">Show Grid</label>
          <input
            type="checkbox"
            checked={drawingConfig.grid}
            onChange={(e) => updateDrawingConfig({ grid: e.target.checked })}
            className="ml-2"
          />
        </div>
        <div>
          <label className="text-black">Grid Size</label>
          <input
            type="number"
            value={drawingConfig.gridSize}
            onChange={(e) => updateDrawingConfig({ gridSize: Number(e.target.value) })}
            className="w-full p-1 border text-black"
            min="1"
            placeholder="Grid size in pixels"
          />
        </div>
      </div>
    </div>
  );
}; 
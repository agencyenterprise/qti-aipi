import { QTIQuestion, DrawingTool } from '../../types';
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
  state,
  dispatch
}: DrawingInteractionProps) => {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-black">Canvas Configuration</label>
          <div className="mt-2 space-y-2">
            <input
              type="number"
              value={question.drawingConfig?.width ?? 400}
              onChange={(e) => {
                const updatedQuestions = [...state.assessment.questions];
                updatedQuestions[qIndex].drawingConfig = {
                  ...(updatedQuestions[qIndex].drawingConfig || { width: 400, height: 300, tools: ['pen', 'eraser'] }),
                  width: Number(e.target.value)
                };
                dispatch({ 
                  type: 'UPDATE_ASSESSMENT', 
                  payload: { questions: updatedQuestions } 
                });
              }}
              className="w-full p-1 border text-black"
              placeholder="Canvas width"
            />
            <input
              type="number"
              value={question.drawingConfig?.height ?? 300}
              onChange={(e) => {
                const updatedQuestions = [...state.assessment.questions];
                updatedQuestions[qIndex].drawingConfig = {
                  ...(updatedQuestions[qIndex].drawingConfig || { width: 400, height: 300, tools: ['pen', 'eraser'] }),
                  height: Number(e.target.value)
                };
                dispatch({ 
                  type: 'UPDATE_ASSESSMENT', 
                  payload: { questions: updatedQuestions } 
                });
              }}
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
                  checked={question.drawingConfig?.tools.includes(tool)}
                  onChange={(e) => {
                    const updatedQuestions = [...state.assessment.questions];
                    const currentTools = updatedQuestions[qIndex].drawingConfig?.tools || [];
                    updatedQuestions[qIndex].drawingConfig = {
                      ...(updatedQuestions[qIndex].drawingConfig || { width: 400, height: 300, tools: [] }),
                      tools: e.target.checked
                        ? [...currentTools, tool]
                        : currentTools.filter(t => t !== tool)
                    };
                    dispatch({ 
                      type: 'UPDATE_ASSESSMENT', 
                      payload: { questions: updatedQuestions } 
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
    </div>
  );
}; 
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

interface MatchInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | undefined) => void;
  updateMatchItem: (questionIndex: number, type: 'source' | 'target', itemIndex: number, value: string) => void;
  addMatchItem: (questionIndex: number, type: 'source' | 'target') => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const MatchInteraction = ({
  question,
  qIndex,
  updateQuestion,
  updateMatchItem,
  addMatchItem,
  state,
  dispatch,
}: MatchInteractionProps) => {
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
            placeholder="Maximum number of matches allowed"
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
            placeholder="Minimum number of matches required"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-black">Source Items</label>
          {question.matchItems?.source.map((item, iIndex) => (
            <div key={iIndex} className="mt-2">
              <input
                type="text"
                value={item.value}
                onChange={(e) => updateMatchItem(qIndex, 'source', iIndex, e.target.value)}
                className="w-full p-1 border text-black"
                placeholder="Enter source item"
              />
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div>
                  <label className="text-sm">Match Max</label>
                  <input
                    type="number"
                    value={item.matchMax || ''}
                    onChange={(e) => {
                      const updatedQuestions = [...state.assessment.questions];
                      const items = [...(updatedQuestions[qIndex].matchItems?.source || [])];
                      items[iIndex] = { ...items[iIndex], matchMax: e.target.value ? Number(e.target.value) : undefined };
                      updatedQuestions[qIndex].matchItems = {
                        ...(updatedQuestions[qIndex].matchItems || { source: [], target: [] }),
                        source: items
                      };
                      dispatch({ 
                        type: 'UPDATE_ASSESSMENT', 
                        payload: { questions: updatedQuestions } 
                      });
                    }}
                    className="w-full p-1 border text-black"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-sm">Match Min</label>
                  <input
                    type="number"
                    value={item.matchMin || ''}
                    onChange={(e) => {
                      const updatedQuestions = [...state.assessment.questions];
                      const items = [...(updatedQuestions[qIndex].matchItems?.source || [])];
                      items[iIndex] = { ...items[iIndex], matchMin: e.target.value ? Number(e.target.value) : undefined };
                      updatedQuestions[qIndex].matchItems = {
                        ...(updatedQuestions[qIndex].matchItems || { source: [], target: [] }),
                        source: items
                      };
                      dispatch({ 
                        type: 'UPDATE_ASSESSMENT', 
                        payload: { questions: updatedQuestions } 
                      });
                    }}
                    className="w-full p-1 border text-black"
                    min="0"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm">Fixed</label>
                  <input
                    type="checkbox"
                    checked={item.fixed || false}
                    onChange={(e) => {
                      const updatedQuestions = [...state.assessment.questions];
                      const items = [...(updatedQuestions[qIndex].matchItems?.source || [])];
                      items[iIndex] = { ...items[iIndex], fixed: e.target.checked };
                      updatedQuestions[qIndex].matchItems = {
                        ...(updatedQuestions[qIndex].matchItems || { source: [], target: [] }),
                        source: items
                      };
                      dispatch({ 
                        type: 'UPDATE_ASSESSMENT', 
                        payload: { questions: updatedQuestions } 
                      });
                    }}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => addMatchItem(qIndex, 'source')}
            className="mt-2 text-blue-600"
          >
            + Add Source
          </button>
        </div>
        <div>
          <label className="text-black">Target Items</label>
          {question.matchItems?.target.map((item, iIndex) => (
            <div key={iIndex} className="mt-2">
              <input
                type="text"
                value={item.value}
                onChange={(e) => updateMatchItem(qIndex, 'target', iIndex, e.target.value)}
                className="w-full p-1 border text-black"
                placeholder="Enter target item"
              />
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div>
                  <label className="text-sm">Match Max</label>
                  <input
                    type="number"
                    value={item.matchMax || ''}
                    onChange={(e) => {
                      const updatedQuestions = [...state.assessment.questions];
                      const items = [...(updatedQuestions[qIndex].matchItems?.target || [])];
                      items[iIndex] = { ...items[iIndex], matchMax: e.target.value ? Number(e.target.value) : undefined };
                      updatedQuestions[qIndex].matchItems = {
                        ...(updatedQuestions[qIndex].matchItems || { source: [], target: [] }),
                        target: items
                      };
                      dispatch({ 
                        type: 'UPDATE_ASSESSMENT', 
                        payload: { questions: updatedQuestions } 
                      });
                    }}
                    className="w-full p-1 border text-black"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-sm">Match Min</label>
                  <input
                    type="number"
                    value={item.matchMin || ''}
                    onChange={(e) => {
                      const updatedQuestions = [...state.assessment.questions];
                      const items = [...(updatedQuestions[qIndex].matchItems?.target || [])];
                      items[iIndex] = { ...items[iIndex], matchMin: e.target.value ? Number(e.target.value) : undefined };
                      updatedQuestions[qIndex].matchItems = {
                        ...(updatedQuestions[qIndex].matchItems || { source: [], target: [] }),
                        target: items
                      };
                      dispatch({ 
                        type: 'UPDATE_ASSESSMENT', 
                        payload: { questions: updatedQuestions } 
                      });
                    }}
                    className="w-full p-1 border text-black"
                    min="0"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm">Fixed</label>
                  <input
                    type="checkbox"
                    checked={item.fixed || false}
                    onChange={(e) => {
                      const updatedQuestions = [...state.assessment.questions];
                      const items = [...(updatedQuestions[qIndex].matchItems?.target || [])];
                      items[iIndex] = { ...items[iIndex], fixed: e.target.checked };
                      updatedQuestions[qIndex].matchItems = {
                        ...(updatedQuestions[qIndex].matchItems || { source: [], target: [] }),
                        target: items
                      };
                      dispatch({ 
                        type: 'UPDATE_ASSESSMENT', 
                        payload: { questions: updatedQuestions } 
                      });
                    }}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => addMatchItem(qIndex, 'target')}
            className="mt-2 text-blue-600"
          >
            + Add Target
          </button>
        </div>
      </div>
    </div>
  );
}; 
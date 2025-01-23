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

interface GapMatchInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | undefined) => void;
  updateGapText: (questionIndex: number, gapIndex: number, value: string) => void;
  addGapText: (questionIndex: number) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const GapMatchInteraction = ({
  question,
  qIndex,
  updateQuestion,
  updateGapText,
  addGapText,
  state,
  dispatch,
}: GapMatchInteractionProps) => {
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-black">Gap Texts (Draggable Items)</label>
          {question.gapTexts?.map((text, index) => (
            <div key={index} className="mt-2">
              <input
                type="text"
                value={text.value}
                onChange={(e) => updateGapText(qIndex, index, e.target.value)}
                className="w-full p-1 border text-black"
                placeholder="Enter draggable text"
              />
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <label className="text-sm">Match Max</label>
                  <input
                    type="number"
                    value={text.matchMax || ''}
                    onChange={(e) => {
                      const updatedQuestions = [...state.assessment.questions];
                      const gapTexts = [...(updatedQuestions[qIndex].gapTexts || [])];
                      gapTexts[index] = {
                        ...gapTexts[index],
                        matchMax: e.target.value ? Number(e.target.value) : undefined
                      };
                      updatedQuestions[qIndex].gapTexts = gapTexts;
                      dispatch({ 
                        type: 'UPDATE_ASSESSMENT', 
                        payload: { questions: updatedQuestions } 
                      });
                    }}
                    className="w-full p-1 border text-black"
                    min="0"
                    placeholder="Max uses"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm">Fixed</label>
                  <input
                    type="checkbox"
                    checked={text.fixed || false}
                    onChange={(e) => {
                      const updatedQuestions = [...state.assessment.questions];
                      const gapTexts = [...(updatedQuestions[qIndex].gapTexts || [])];
                      gapTexts[index] = {
                        ...gapTexts[index],
                        fixed: e.target.checked
                      };
                      updatedQuestions[qIndex].gapTexts = gapTexts;
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
          <button onClick={() => addGapText(qIndex)} className="mt-2 text-blue-600">
            + Add Gap Text
          </button>
        </div>
        <div>
          <label className="text-black">Gaps (Drop Zones)</label>
          <div className="mt-2">
            <textarea
              value={question.prompt}
              onChange={(e) => updateQuestion(qIndex, 'prompt', e.target.value)}
              className="w-full p-1 border text-black"
              rows={4}
              placeholder="Enter text with [gap1] [gap2] etc. placeholders"
            />
            <div className="mt-2">
              {question.gaps?.map((gap, index) => (
                <div key={index} className="mt-2">
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={gap}
                      onChange={(e) => {
                        const updatedQuestions = [...state.assessment.questions];
                        const gaps = [...(updatedQuestions[qIndex].gaps || [])];
                        gaps[index] = e.target.value;
                        updatedQuestions[qIndex].gaps = gaps;
                        dispatch({ 
                          type: 'UPDATE_ASSESSMENT', 
                          payload: { questions: updatedQuestions } 
                        });
                      }}
                      className="flex-1 p-1 border text-black"
                      placeholder={`Gap ${index + 1} identifier`}
                    />
                    <label className="ml-2">
                      <input
                        type="checkbox"
                        checked={question.correctResponse.includes(`${question.gapTexts?.[0]?.identifier} ${gap}`)}
                        onChange={(e) => {
                          const gapTextId = question.gapTexts?.[0]?.identifier;
                          const pair = `${gapTextId} ${gap}`;
                          const correctResponse = e.target.checked
                            ? [...question.correctResponse, pair]
                            : question.correctResponse.filter(id => id !== pair);
                          updateQuestion(qIndex, 'correctResponse', correctResponse);
                        }}
                        className="mr-1"
                      />
                      Required
                    </label>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const updatedQuestions = [...state.assessment.questions];
                  const gaps = [...(updatedQuestions[qIndex].gaps || [])];
                  gaps.push(`gap${gaps.length + 1}`);
                  updatedQuestions[qIndex].gaps = gaps;
                  dispatch({ 
                    type: 'UPDATE_ASSESSMENT', 
                    payload: { questions: updatedQuestions } 
                  });
                }}
                className="mt-2 text-blue-600"
              >
                + Add Gap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
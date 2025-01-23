import { QTIQuestion, QTIHotspot } from '../../types';
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

interface GraphicGapMatchInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | undefined) => void;
  updateHotspot: (questionIndex: number, hotspotIndex: number, updates: Partial<QTIHotspot>) => void;
  addHotspot: (questionIndex: number) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const GraphicGapMatchInteraction = ({
  question,
  qIndex,
  updateQuestion,
  updateHotspot,
  addHotspot
}: GraphicGapMatchInteractionProps) => {
  return (
    <div className="mb-4">
      <div className="mb-4">
        <label className="text-black">Image URL</label>
        <input
          type="text"
          value={question.image || ''}
          onChange={(e) => updateQuestion(qIndex, 'image', e.target.value)}
          className="w-full p-1 border mt-1 text-black"
          placeholder="Enter image URL"
        />
      </div>

      <div className="mt-4">
        <label className="text-black">Hotspots</label>
        {question.hotspots?.map((hotspot, index) => (
          <div key={index} className="mt-2 grid grid-cols-3 gap-2">
            <div>
              <label className="text-sm">Shape</label>
              <select
                value={hotspot.shape}
                onChange={(e) => updateHotspot(qIndex, index, { shape: e.target.value as 'circle' | 'rect' | 'poly' })}
                className="w-full p-1 border mt-1 text-black"
              >
                <option value="rect">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="poly">Polygon</option>
              </select>
            </div>
            <div>
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
            <div className="flex items-end">
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
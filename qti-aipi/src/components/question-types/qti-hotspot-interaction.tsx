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
  // state,
  // dispatch,
}: HotspotInteractionProps) => {
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
          <label className="text-black">Max Choices</label>
          <input
            type="number"
            value={question.maxChoices || ''}
            onChange={(e) => updateQuestion(qIndex, 'maxChoices', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-1 border mt-1 text-black"
            min="0"
            placeholder="Optional: Maximum choices allowed"
          />
        </div>
        <div>
          <label className="text-black">Min Choices</label>
          <input
            type="number"
            value={question.minChoices || ''}
            onChange={(e) => updateQuestion(qIndex, 'minChoices', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-1 border mt-1 text-black"
            min="0"
            placeholder="Optional: Minimum choices required"
          />
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
        <button onClick={() => addHotspot(qIndex)} className="mt-2 text-blue-600">
          + Add Hotspot
        </button>
      </div>
    </div>
  );
}; 
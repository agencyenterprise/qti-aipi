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
}: GraphicAssociateInteractionProps) => {
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
          <label className="text-black">Max Associations</label>
          <input
            type="number"
            value={question.maxAssociations || ''}
            onChange={(e) => updateQuestion(qIndex, 'maxAssociations', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-1 border mt-1 text-black"
            min="0"
            placeholder="Maximum number of associations"
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
            placeholder="Minimum number of associations"
          />
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
          onClick={() => addHotspot(qIndex)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Hotspot
        </button>
      </div>
    </div>
  );
}; 
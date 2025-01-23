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

interface PositionObjectInteractionProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (index: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | Array<{ type: 'image' | 'text'; value: string; width?: number; height?: number; }> | undefined) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const PositionObjectInteraction = ({
  question,
  qIndex,
  updateQuestion,
}: PositionObjectInteractionProps) => {
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
          <label className="text-black">Center Point</label>
          <input
            type="checkbox"
            checked={question.centerPoint || false}
            onChange={(e) => updateQuestion(qIndex, 'centerPoint', e.target.checked)}
            className="ml-2"
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
            placeholder="Minimum objects to position"
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
            placeholder="Maximum objects to position"
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
        <label className="text-black">Positionable Objects</label>
        {question.objects?.map((object, oIndex) => (
          <div key={oIndex} className="grid grid-cols-2 gap-4 mt-2 p-2 border rounded">
            <div>
              <label className="text-black text-sm">Type</label>
              <select
                value={object.type}
                onChange={(e) => {
                  const updatedObjects = [...(question.objects || [])];
                  updatedObjects[oIndex] = { ...object, type: e.target.value as 'image' | 'text' };
                  updateQuestion(qIndex, 'objects', updatedObjects);
                }}
                className="w-full p-1 border mt-1 text-black"
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
              </select>
            </div>
            <div>
              <label className="text-black text-sm">Value</label>
              <input
                type="text"
                value={object.value}
                onChange={(e) => {
                  const updatedObjects = [...(question.objects || [])];
                  updatedObjects[oIndex] = { ...object, value: e.target.value };
                  updateQuestion(qIndex, 'objects', updatedObjects);
                }}
                className="w-full p-1 border mt-1 text-black"
                placeholder={object.type === 'image' ? 'Enter image URL' : 'Enter text'}
              />
            </div>
            {object.type === 'image' && (
              <>
                <div>
                  <label className="text-black text-sm">Width</label>
                  <input
                    type="number"
                    value={object.width || ''}
                    onChange={(e) => {
                      const updatedObjects = [...(question.objects || [])];
                      updatedObjects[oIndex] = { ...object, width: e.target.value ? Number(e.target.value) : undefined };
                      updateQuestion(qIndex, 'objects', updatedObjects);
                    }}
                    className="w-full p-1 border mt-1 text-black"
                    min="0"
                    placeholder="Width"
                  />
                </div>
                <div>
                  <label className="text-black text-sm">Height</label>
                  <input
                    type="number"
                    value={object.height || ''}
                    onChange={(e) => {
                      const updatedObjects = [...(question.objects || [])];
                      updatedObjects[oIndex] = { ...object, height: e.target.value ? Number(e.target.value) : undefined };
                      updateQuestion(qIndex, 'objects', updatedObjects);
                    }}
                    className="w-full p-1 border mt-1 text-black"
                    min="0"
                    placeholder="Height"
                  />
                </div>
              </>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const updatedObjects = [...(question.objects || [])];
            updatedObjects.push({ type: 'text', value: '' });
            updateQuestion(qIndex, 'objects', updatedObjects);
          }}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Object
        </button>
      </div>
    </div>
  );
}; 
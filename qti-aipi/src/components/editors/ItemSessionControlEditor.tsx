import { memo, useCallback } from 'react';
import { ItemSessionControl } from '../../types';

interface ItemSessionControlEditorProps {
  control?: ItemSessionControl;
  onChange: (updates: ItemSessionControl) => void;
}

export const ItemSessionControlEditor = memo(({
  control,
  onChange
}: ItemSessionControlEditorProps) => {
  const handleMaxAttemptsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...control, maxAttempts: Number(e.target.value) });
  }, [control, onChange]);

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label className="text-black">Max Attempts</label>
        <input
          type="number"
          value={control?.maxAttempts || 0}
          onChange={handleMaxAttemptsChange}
          className="w-full p-1 border mt-1 text-black"
        />
      </div>
      <div>
        <label className="text-black">Show Feedback</label>
        <input
          type="checkbox"
          checked={control?.showFeedback || false}
          onChange={(e) => onChange({ ...control, showFeedback: e.target.checked })}
          className="ml-2"
        />
      </div>
      <div>
        <label className="text-black">Allow Review</label>
        <input
          type="checkbox"
          checked={control?.allowReview || false}
          onChange={(e) => onChange({ ...control, allowReview: e.target.checked })}
          className="ml-2"
        />
      </div>
      <div>
        <label className="text-black">Show Solution</label>
        <input
          type="checkbox"
          checked={control?.showSolution || false}
          onChange={(e) => onChange({ ...control, showSolution: e.target.checked })}
          className="ml-2"
        />
      </div>
      <div>
        <label className="text-black">Allow Comment</label>
        <input
          type="checkbox"
          checked={control?.allowComment || false}
          onChange={(e) => onChange({ ...control, allowComment: e.target.checked })}
          className="ml-2"
        />
      </div>
      <div>
        <label className="text-black">Allow Skipping</label>
        <input
          type="checkbox"
          checked={control?.allowSkipping || false}
          onChange={(e) => onChange({ ...control, allowSkipping: e.target.checked })}
          className="ml-2"
        />
      </div>
      <div>
        <label className="text-black">Validate Responses</label>
        <input
          type="checkbox"
          checked={control?.validateResponses || false}
          onChange={(e) => onChange({ ...control, validateResponses: e.target.checked })}
          className="ml-2"
        />
      </div>
    </div>
  );
});

ItemSessionControlEditor.displayName = 'ItemSessionControlEditor'; 
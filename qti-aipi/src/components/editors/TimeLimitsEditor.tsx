import { memo, useCallback } from 'react';
import { TimeLimits } from '../../types';

interface TimeLimitsEditorProps {
  limits?: TimeLimits;
  onChange: (updates: TimeLimits) => void;
}

export const TimeLimitsEditor = memo(({
  limits,
  onChange
}: TimeLimitsEditorProps) => {
  const handleMinTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...limits, minTime: Number(e.target.value) });
  }, [limits, onChange]);

  const handleMaxTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...limits, maxTime: Number(e.target.value) });
  }, [limits, onChange]);

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label className="text-black">Minimum Time (seconds)</label>
        <input
          type="number"
          value={limits?.minTime || 0}
          onChange={handleMinTimeChange}
          className="w-full p-1 border mt-1 text-black"
        />
      </div>
      <div>
        <label className="text-black">Maximum Time (seconds)</label>
        <input
          type="number"
          value={limits?.maxTime || 0}
          onChange={handleMaxTimeChange}
          className="w-full p-1 border mt-1 text-black"
        />
      </div>
      <div>
        <label className="text-black">Allow Late Submission</label>
        <input
          type="checkbox"
          checked={limits?.allowLateSubmission || false}
          onChange={(e) => onChange({ ...limits, allowLateSubmission: e.target.checked })}
          className="ml-2"
        />
      </div>
    </div>
  );
});

TimeLimitsEditor.displayName = 'TimeLimitsEditor'; 
import { memo, useCallback } from 'react';
import { CommonAttributes } from '../../types';

interface CommonAttributesEditorProps {
  attributes: CommonAttributes;
  onChange: (updates: Partial<CommonAttributes>) => void;
}

export const CommonAttributesEditor = memo(({
  attributes,
  onChange
}: CommonAttributesEditorProps) => {
  const handleChange = useCallback((field: keyof CommonAttributes, value: string | boolean) => {
    onChange({ [field]: value });
  }, [onChange]);

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label className="text-black">Identifier</label>
        <input
          type="text"
          value={attributes.identifier || ''}
          onChange={(e) => handleChange('identifier', e.target.value)}
          className="w-full p-1 border mt-1 text-black"
        />
      </div>
      <div>
        <label className="text-black">Title</label>
        <input
          type="text"
          value={attributes.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full p-1 border mt-1 text-black"
        />
      </div>
      <div>
        <label className="text-black">Time Dependent</label>
        <input
          type="checkbox"
          checked={attributes.timeDependent || false}
          onChange={(e) => handleChange('timeDependent', e.target.checked)}
          className="ml-2"
        />
      </div>
      <div>
        <label className="text-black">Label</label>
        <input
          type="text"
          value={attributes.label || ''}
          onChange={(e) => handleChange('label', e.target.value)}
          className="w-full p-1 border mt-1 text-black"
        />
      </div>
      <div>
        <label className="text-black">Language</label>
        <input
          type="text"
          value={attributes.lang || ''}
          onChange={(e) => handleChange('lang', e.target.value)}
          className="w-full p-1 border mt-1 text-black"
        />
      </div>
      <div>
        <label className="text-black">Base URI</label>
        <input
          type="text"
          value={attributes.base || ''}
          onChange={(e) => handleChange('base', e.target.value)}
          className="w-full p-1 border mt-1 text-black"
        />
      </div>
    </div>
  );
});

CommonAttributesEditor.displayName = 'CommonAttributesEditor'; 
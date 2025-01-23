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
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    onChange({ [name]: newValue });
  }, [onChange]);

  return (
    <div className="grid grid-cols-2 gap-4 mb-4" onClick={(e) => e.stopPropagation()}>
      <div>
        <label className="text-black">Identifier</label>
        <input
          type="text"
          name="identifier"
          defaultValue={attributes.identifier || ''}
          onBlur={handleInputChange}
          className="w-full p-1 border mt-1 text-black"
          placeholder="Enter identifier"
        />
      </div>
      <div>
        <label className="text-black">Title</label>
        <input
          type="text"
          name="title"
          value={attributes.title || ''}
          onChange={handleInputChange}
          className="w-full p-1 border mt-1 text-black"
          placeholder="Enter title"
        />
      </div>
      <div>
        <label className="text-black">Time Dependent</label>
        <input
          type="checkbox"
          name="timeDependent"
          checked={attributes.timeDependent || false}
          onChange={handleInputChange}
          className="ml-2"
        />
      </div>
      <div>
        <label className="text-black">Label</label>
        <input
          type="text"
          name="label"
          value={attributes.label || ''}
          onChange={handleInputChange}
          className="w-full p-1 border mt-1 text-black"
          placeholder="Enter label"
        />
      </div>
      <div>
        <label className="text-black">Language</label>
        <input
          type="text"
          name="lang"
          value={attributes.lang || ''}
          onChange={handleInputChange}
          className="w-full p-1 border mt-1 text-black"
          placeholder="Enter language"
        />
      </div>
      <div>
        <label className="text-black">Base URI</label>
        <input
          type="text"
          name="base"
          value={attributes.base || ''}
          onChange={handleInputChange}
          className="w-full p-1 border mt-1 text-black"
          placeholder="Enter base URI"
        />
      </div>
    </div>
  );
});

CommonAttributesEditor.displayName = 'CommonAttributesEditor'; 
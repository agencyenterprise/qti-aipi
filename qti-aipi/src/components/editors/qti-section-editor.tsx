import { memo } from 'react';
import { QTISection } from '../../types';
import { CommonAttributesEditor } from './qti-common-attributes-editor';
import { ItemSessionControlEditor } from './qti-item-session-controller-editor';
import { TimeLimitsEditor } from './qti-time-limits-editor';
import { ItemEditor } from './qti-item-editor';

interface SectionEditorProps {
  section: QTISection;
  onUpdate: (updates: Partial<QTISection>) => void;
  onDelete: () => void;
}

export const SectionEditor = memo(({
  section,
  onUpdate,
  onDelete
}: SectionEditorProps) => {
  return (
    <div className="border p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-black">Section: {section.title || section.identifier}</h4>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Delete Section
        </button>
      </div>

      <CommonAttributesEditor
        attributes={section}
        onChange={(updates) => onUpdate(updates)}
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-black">Visible</label>
          <select
            value={section.visible}
            onChange={(e) => onUpdate({ visible: e.target.value as 'true' | 'false' })}
            className="w-full p-1 border mt-1 text-black"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div>
          <label className="text-black">Selection</label>
          <input
            type="number"
            value={section.selection || ''}
            onChange={(e) => onUpdate({ selection: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full p-1 border mt-1 text-black"
            min="0"
          />
        </div>
        <div>
          <label className="text-black">Ordering</label>
          <select
            value={section.ordering || ''}
            onChange={(e) => onUpdate({ ordering: e.target.value as 'random' | 'sequential' | undefined })}
            className="w-full p-1 border mt-1 text-black"
          >
            <option value="">Default</option>
            <option value="random">Random</option>
            <option value="sequential">Sequential</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Item Session Control</h3>
        <ItemSessionControlEditor
          control={section.itemSessionControl}
          onChange={(updates) => onUpdate({ itemSessionControl: updates })}
        />
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Time Limits</h3>
        <TimeLimitsEditor
          limits={section.timeLimits}
          onChange={(updates) => onUpdate({ timeLimits: updates })}
        />
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Pre-conditions</h3>
        <textarea
          value={section.preConditions?.join('\n') || ''}
          onChange={(e) => onUpdate({ preConditions: e.target.value.split('\n') })}
          className="w-full p-1 border mt-1 text-black"
          rows={3}
          placeholder="Enter one pre-condition per line"
        />
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Branch Rules</h3>
        <textarea
          value={section.branchRules?.join('\n') || ''}
          onChange={(e) => onUpdate({ branchRules: e.target.value.split('\n') })}
          className="w-full p-1 border mt-1 text-black"
          rows={3}
          placeholder="Enter one branch rule per line"
        />
      </div>

      <div className="mb-4">
        <h4 className="font-bold mb-2">Items</h4>
        {section.items?.map((item, index) => (
          <ItemEditor
            key={item.identifier}
            item={item}
            onUpdate={(updates) => {
              const updatedItems = [...(section.items || [])];
              updatedItems[index] = { ...item, ...updates };
              onUpdate({ items: updatedItems });
            }}
            onDelete={() => {
              const updatedItems = [...(section.items || [])];
              updatedItems.splice(index, 1);
              onUpdate({ items: updatedItems });
            }}
          />
        ))}

        <div onClick={(e) => e.preventDefault()}>
          <button
            type="button"
            onClick={() => {
              const newItem = {
                identifier: `item_${(section.items?.length || 0) + 1}`,
                title: `Item ${(section.items?.length || 0) + 1}`,
                questions: []
              };
              onUpdate({ items: [...(section.items || []), newItem] });
            }}
            className="text-blue-600"
          >
            + Add Item
          </button>
        </div>
      </div>

      {section.sections && section.sections.length > 0 && (
        <div className="mb-4">
          <h4 className="font-bold mb-2">Subsections</h4>
          {section.sections.map((subsection, index) => (
            <SectionEditor
              key={subsection.identifier}
              section={subsection}
              onUpdate={(updates) => {
                const updatedSections = [...section.sections!];
                updatedSections[index] = { ...subsection, ...updates };
                onUpdate({ sections: updatedSections });
              }}
              onDelete={() => {
                const updatedSections = [...section.sections!];
                updatedSections.splice(index, 1);
                onUpdate({ sections: updatedSections });
              }}
            />
          ))}
        </div>
      )}

      <div onClick={(e) => e.preventDefault()}>
        <button
          type="button"
          onClick={() => {
            const newSection: QTISection = {
              identifier: `section_${(section.sections?.length || 0) + 1}`,
              title: `Section ${(section.sections?.length || 0) + 1}`,
              visible: 'true'
            };
            onUpdate({ sections: [...(section.sections || []), newSection] });
          }}
          className="text-blue-600"
        >
          + Add Subsection
        </button>
      </div>
    </div>
  );
});

SectionEditor.displayName = 'SectionEditor'; 
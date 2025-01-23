import { memo } from 'react';
import { QTITestPart, QTISection } from '../../types';
import { CommonAttributesEditor } from './qti-common-attributes-editor';
import { SectionEditor } from './qti-section-editor';

interface TestPartEditorProps {
  testPart: QTITestPart;
  testPartIndex: number;
  onUpdate: (index: number, updates: Partial<QTITestPart>) => void;
}

export const TestPartEditor = memo(({ 
  testPart, 
  testPartIndex,
  onUpdate
}: TestPartEditorProps) => {
  const addSection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSection: QTISection = {
      identifier: `section_${Date.now()}`,
      title: 'New Section',
      visible: 'true',
      sections: [],
      items: []
    };
    onUpdate(testPartIndex, {
      sections: [...(testPart.sections || []), newSection]
    });
  };

  const updateSection = (sectionIndex: number, updates: Partial<QTISection>) => {
    const updatedSections = [...(testPart.sections || [])];
    updatedSections[sectionIndex] = { ...updatedSections[sectionIndex], ...updates };
    onUpdate(testPartIndex, { sections: updatedSections });
  };

  const deleteSection = (sectionIndex: number) => {
    const updatedSections = [...(testPart.sections || [])];
    updatedSections.splice(sectionIndex, 1);
    onUpdate(testPartIndex, { sections: updatedSections });
  };

  return (
    <div className="border p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-black">Test Part: {testPart.title || testPart.identifier}</h4>
      </div>

      <CommonAttributesEditor
        attributes={testPart}
        onChange={(updates) => onUpdate(testPartIndex, updates)}
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-black">Navigation Mode</label>
          <select
            name="navigationMode"
            value={testPart.navigationMode}
            onChange={(e) => onUpdate(testPartIndex, { navigationMode: e.target.value as 'linear' | 'nonlinear' })}
            className="w-full p-1 border mt-1 text-black"
          >
            <option value="linear">Linear</option>
            <option value="nonlinear">Non-linear</option>
          </select>
        </div>
        <div>
          <label className="text-black">Submission Mode</label>
          <select
            name="submissionMode"
            value={testPart.submissionMode}
            onChange={(e) => onUpdate(testPartIndex, { submissionMode: e.target.value as 'individual' | 'simultaneous' })}
            className="w-full p-1 border mt-1 text-black"
          >
            <option value="individual">Individual</option>
            <option value="simultaneous">Simultaneous</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-bold mb-2 text-black">Sections</h4>
        {testPart.sections?.map((section, sectionIndex) => (
          <SectionEditor
            key={section.identifier}
            section={section}
            onUpdate={(updates) => updateSection(sectionIndex, updates)}
            onDelete={() => deleteSection(sectionIndex)}
          />
        ))}
        <button
          type="button"
          onClick={addSection}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Add Section
        </button>
      </div>
    </div>
  );
});

TestPartEditor.displayName = 'TestPartEditor'; 
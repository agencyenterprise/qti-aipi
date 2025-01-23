import { memo } from 'react';
import { QTITestPart, QTIHotspot, QTISection, QTIAssessmentTest, ItemSessionControl, TimeLimits } from '../../types';
import { CommonAttributesEditor } from './CommonAttributesEditor';
import { SectionEditor } from './SectionEditor';
import { Dispatch } from 'react';

interface ExtendedQTIAssessmentItem extends QTIAssessmentTest {
  itemSessionControl?: ItemSessionControl;
  timeLimits?: TimeLimits;
}

interface State {
  assessment: ExtendedQTIAssessmentItem;
  isSubmitting: boolean;
}

interface Action {
  type: 'UPDATE_ASSESSMENT' | 'START_SUBMISSION' | 'END_SUBMISSION';
  payload?: Partial<ExtendedQTIAssessmentItem>;
}

interface TestPartEditorProps {
  testPart: QTITestPart;
  testPartIndex: number;
  onUpdate: (index: number, updates: Partial<QTITestPart>) => void;
  updateChoice: (qIndex: number, cIndex: number, value: string) => void;
  addChoice: (qIndex: number) => void;
  updateOrderItem: (qIndex: number, itemIndex: number, value: string) => void;
  addOrderItem: (qIndex: number) => void;
  updateMatchItem: (qIndex: number, type: 'source' | 'target', itemIndex: number, value: string) => void;
  addMatchItem: (qIndex: number, type: 'source' | 'target') => void;
  updateGapText: (qIndex: number, gapIndex: number, value: string) => void;
  addGapText: (qIndex: number) => void;
  updateHotspot: (qIndex: number, hotspotIndex: number, updates: Partial<QTIHotspot>) => void;
  addHotspot: (qIndex: number) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const TestPartEditor = memo(({ 
  testPart, 
  testPartIndex,
  onUpdate,
  updateChoice,
  addChoice,
  updateOrderItem,
  addOrderItem,
  updateMatchItem,
  addMatchItem,
  updateGapText,
  addGapText,
  updateHotspot,
  addHotspot,
  state,
  dispatch
}: TestPartEditorProps) => {
  const addSection = () => {
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
        <h4 className="font-bold mb-2">Sections</h4>
        {testPart.sections?.map((section, index) => (
          <SectionEditor
            key={section.identifier}
            section={section}
            onUpdate={(updates) => updateSection(index, updates)}
            onDelete={() => deleteSection(index)}
            updateChoice={updateChoice}
            addChoice={addChoice}
            updateOrderItem={updateOrderItem}
            addOrderItem={addOrderItem}
            updateMatchItem={updateMatchItem}
            addMatchItem={addMatchItem}
            updateGapText={updateGapText}
            addGapText={addGapText}
            updateHotspot={updateHotspot}
            addHotspot={addHotspot}
            state={state}
            dispatch={dispatch}
          />
        ))}
        <button
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
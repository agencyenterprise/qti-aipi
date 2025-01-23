import { QTISection, QTIAssessmentItem, QTIQuestion, QuestionType, QTIHotspot, QTIAssessmentTest, ItemSessionControl, TimeLimits } from '../../types';
import { CommonAttributesEditor } from './CommonAttributesEditor';
import { ItemSessionControlEditor } from './ItemSessionControlEditor';
import { TimeLimitsEditor } from './TimeLimitsEditor';
import { QuestionEditor } from './QuestionEditor';
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

interface SectionEditorProps {
  section: QTISection;
  onUpdate: (updates: Partial<QTISection>) => void;
  onDelete: () => void;
  level?: number;
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

const questionTypes = [
  { value: 'choiceInteraction', label: 'Multiple Choice' },
  { value: 'textEntryInteraction', label: 'Text Entry' },
  { value: 'extendedTextInteraction', label: 'Extended Text' },
  { value: 'orderInteraction', label: 'Order' },
  { value: 'matchInteraction', label: 'Match' },
  { value: 'inlineChoiceInteraction', label: 'Inline Choice' },
  { value: 'gapMatchInteraction', label: 'Gap Match' },
  { value: 'hotspotInteraction', label: 'Hotspot' },
  { value: 'graphicGapMatchInteraction', label: 'Graphic Gap Match' },
  { value: 'sliderInteraction', label: 'Slider' },
  { value: 'drawingInteraction', label: 'Drawing' },
  { value: 'uploadInteraction', label: 'Upload' }
];

export const SectionEditor = ({
  section,
  onUpdate,
  onDelete,
  level = 0,
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
}: SectionEditorProps) => {
  const addSubsection = () => {
    const newSection: QTISection = {
      identifier: `section_${Date.now()}`,
      title: 'New Section',
      visible: 'true',
      sections: [],
      items: []
    };
    onUpdate({
      sections: [...(section.sections || []), newSection]
    });
  };

  const updateSubsection = (index: number, updates: Partial<QTISection>) => {
    const updatedSections = [...(section.sections || [])];
    updatedSections[index] = { ...updatedSections[index], ...updates };
    onUpdate({ sections: updatedSections });
  };

  const addItem = () => {
    const newItem: QTIAssessmentItem = {
      identifier: `item_${Date.now()}`,
      title: 'New Item',
      questions: []
    };
    onUpdate({
      items: [...(section.items || []), newItem]
    });
  };

  const addQuestionToItem = (itemIndex: number) => {
    const updatedItems = [...(section.items || [])];
    const newQuestion: QTIQuestion = {
      identifier: `Q${updatedItems[itemIndex].questions.length + 1}`,
      type: 'choiceInteraction',
      prompt: '',
      choices: [],
      correctResponse: [],
      feedback: {
        correct: '',
        incorrect: ''
      }
    };
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      questions: [...updatedItems[itemIndex].questions, newQuestion]
    };
    onUpdate({ items: updatedItems });
  };

  const updateQuestion = (itemIndex: number, questionIndex: number, updates: Partial<QTIQuestion>) => {
    const updatedItems = [...(section.items || [])];
    const updatedQuestions = [...updatedItems[itemIndex].questions];
    updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], ...updates };
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], questions: updatedQuestions };
    onUpdate({ items: updatedItems });
  };

  const deleteQuestion = (itemIndex: number, questionIndex: number) => {
    const updatedItems = [...(section.items || [])];
    const updatedQuestions = [...updatedItems[itemIndex].questions];
    updatedQuestions.splice(questionIndex, 1);
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], questions: updatedQuestions };
    onUpdate({ items: updatedItems });
  };

  const deleteSubsection = (index: number) => {
    const updatedSections = [...(section.sections || [])];
    updatedSections.splice(index, 1);
    onUpdate({ sections: updatedSections });
  };

  return (
    <div className={`border p-4 mb-4 ${level > 0 ? 'ml-4' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Section: {section.title}</h3>
        {level > 0 && (
          <button
            onClick={onDelete}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete Section
          </button>
        )}
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
        <h4 className="font-bold mb-2">Subsections</h4>
        {section.sections?.map((subsection, index) => (
          <SectionEditor
            key={subsection.identifier}
            section={subsection}
            onUpdate={(updates) => updateSubsection(index, updates)}
            onDelete={() => deleteSubsection(index)}
            level={level + 1}
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
          onClick={addSubsection}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mr-2"
        >
          Add Subsection
        </button>
      </div>

      <div className="mb-4">
        <h4 className="font-bold mb-2">Items</h4>
        {section.items?.map((item, itemIndex) => (
          <div key={item.identifier} className="border p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-bold">Item: {item.title}</h5>
              <button
                onClick={() => addQuestionToItem(itemIndex)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Add Question
              </button>
            </div>

            {item.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="mb-6 p-4 border">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex-1">
                    <label className="text-black">Question Type</label>
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(itemIndex, questionIndex, { type: e.target.value as QuestionType })}
                      className="p-1 border text-black ml-2"
                    >
                      {questionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => deleteQuestion(itemIndex, questionIndex)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-black">Response Identifier</label>
                    <input
                      type="text"
                      value={question.responseIdentifier || ''}
                      onChange={(e) => updateQuestion(itemIndex, questionIndex, { responseIdentifier: e.target.value })}
                      className="w-full p-1 border mt-1 text-black"
                    />
                  </div>
                  <div>
                    <label className="text-black">Required</label>
                    <input
                      type="checkbox"
                      checked={question.required || false}
                      onChange={(e) => updateQuestion(itemIndex, questionIndex, { required: e.target.checked })}
                      className="ml-2"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-black">Question Prompt</label>
                  <textarea
                    value={question.prompt}
                    onChange={(e) => updateQuestion(itemIndex, questionIndex, { prompt: e.target.value })}
                    className="w-full p-2 border mt-1 text-black"
                    rows={3}
                  />
                </div>

                <QuestionEditor
                  question={question}
                  qIndex={questionIndex}
                  updateQuestion={(qIndex, field, value) => updateQuestion(itemIndex, qIndex, { [field]: value })}
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-black">Correct Feedback</label>
                    <textarea
                      value={question.feedback.correct}
                      onChange={(e) => updateQuestion(itemIndex, questionIndex, {
                        feedback: { ...question.feedback, correct: e.target.value }
                      })}
                      className="w-full p-1 border mt-1 text-black"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-black">Incorrect Feedback</label>
                    <textarea
                      value={question.feedback.incorrect}
                      onChange={(e) => updateQuestion(itemIndex, questionIndex, {
                        feedback: { ...question.feedback, incorrect: e.target.value }
                      })}
                      className="w-full p-1 border mt-1 text-black"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <button
          onClick={addItem}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Add Item
        </button>
      </div>
    </div>
  );
}; 
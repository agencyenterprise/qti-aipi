import React, { useState } from 'react';
import type { ChoiceInteractionType, QTIChoice } from '../../types/interactions';

interface ChoiceInteractionProps {
  /**
   * The interaction data following QTI 3.0 specification
   */
  question: ChoiceInteractionType;
  
  /**
   * Whether the component is in edit mode
   */
  isEditing?: boolean;
  
  /**
   * Callback when the response changes (display mode)
   * For choice interactions, response is an array of identifiers
   */
  onResponseChange?: (response: string[]) => void;
  
  /**
   * Callback when the interaction changes (edit mode)
   */
  onQuestionChange?: (updates: Partial<ChoiceInteractionType>) => void;
  
  /**
   * The current response value(s)
   * Must match the interaction's baseType (identifier) and cardinality (single/multiple)
   */
  value?: string[];
}

export const ChoiceInteraction: React.FC<ChoiceInteractionProps> = ({
  question,
  isEditing = false,
  onResponseChange,
  onQuestionChange,
  value = []
}) => {
  const [showAllAttributes, setShowAllAttributes] = useState(false);

  // QTI 3.0 validation
  const validateChoice = (choice: QTIChoice): boolean => {
    return (
      !!choice.identifier &&
      !!choice.value &&
      /^[^\s]+(\s[^\s]+)*$/.test(choice.identifier)
    );
  };

  const validateMaxChoices = (max: number): boolean => {
    if (max < 0) return false;
    if (question.minChoices && max < question.minChoices) return false;
    if (question.choices && max > question.choices.length) return false;
    return true;
  };

  const validateMinChoices = (min: number): boolean => {
    if (min < 0) return false;
    if (question.maxChoices && min > question.maxChoices) return false;
    if (question.choices && min > question.choices.length) return false;
    return true;
  };

  const handleChoiceChange = (choiceId: string) => {
    if (!onResponseChange) return;
    
    // Handle single/multiple cardinality based on maxChoices
    if (question.maxChoices === 1) {
      onResponseChange([choiceId]);
    } else {
      const newValue = value.includes(choiceId)
        ? value.filter(id => id !== choiceId)
        : [...value, choiceId];
        
      // Validate against min/max constraints
      if (newValue.length <= (question.maxChoices || Infinity) && 
          newValue.length >= (question.minChoices || 0)) {
        onResponseChange(newValue);
      }
    }
  };

  const addChoice = () => {
    if (!onQuestionChange || !question.choices) return;
    const newChoices = [...question.choices];
    const newId = `choice_${newChoices.length + 1}`;
    const newChoice = {
      identifier: newId,
      value: `Option ${newChoices.length + 1}`
    };
    
    if (validateChoice(newChoice)) {
      newChoices.push(newChoice);
      onQuestionChange({ choices: newChoices });
    }
  };

  const removeChoice = (index: number) => {
    if (!onQuestionChange || !question.choices) return;
    const newChoices = [...question.choices];
    newChoices.splice(index, 1);
    onQuestionChange({ choices: newChoices });
  };

  const handleChoiceAttributeChange = (index: number, field: keyof QTIChoice, value: string | boolean) => {
    if (!onQuestionChange || !question.choices) return;
    const newChoices = [...question.choices];
    const updatedChoice = { ...newChoices[index], [field]: value };
    
    if (field === 'identifier' || field === 'value') {
      if (validateChoice(updatedChoice as QTIChoice)) {
        newChoices[index] = updatedChoice;
        onQuestionChange({ choices: newChoices });
      }
    } else {
      newChoices[index] = updatedChoice;
      onQuestionChange({ choices: newChoices });
    }
  };

  const handleCorrectResponseChange = (choiceId: string, isCorrect: boolean) => {
    if (!onQuestionChange) return;
    const correctResponse = isCorrect
      ? [...(question.correctResponse || []), choiceId]
      : (question.correctResponse || []).filter(id => id !== choiceId);
    onQuestionChange({ correctResponse });
  };

  // Add validation to maxChoices/minChoices changes
  const handleMaxChoicesChange = (value: number) => {
    if (!onQuestionChange) return;
    if (validateMaxChoices(value)) {
      onQuestionChange({ maxChoices: value });
    }
  };

  const handleMinChoicesChange = (value: number) => {
    if (!onQuestionChange) return;
    if (validateMinChoices(value)) {
      onQuestionChange({ minChoices: value });
    }
  };

  return (
    <div className="qti-choice-interaction">
      {/* Prompt */}
      {isEditing ? (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Prompt</label>
          <textarea
            value={question.prompt || ''}
            onChange={(e) => onQuestionChange?.({ prompt: e.target.value })}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>
      ) : question.prompt ? (
        <div className="mb-4" dangerouslySetInnerHTML={{ __html: question.prompt }} />
      ) : null}

      {isEditing ? (
        <div className="space-y-4">
          {/* Show all attributes toggle */}
          <div className="flex justify-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showAllAttributes}
                onChange={(e) => setShowAllAttributes(e.target.checked)}
              />
              <span className="text-sm">Show all attributes</span>
            </label>
          </div>

          {/* Required Attributes */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Response Identifier</label>
              <input
                type="text"
                value={question.responseIdentifier}
                onChange={(e) => onQuestionChange?.({ responseIdentifier: e.target.value })}
                className="mt-1 block w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Base Type</label>
              <input
                type="text"
                value="identifier"
                disabled
                className="mt-1 block w-full bg-gray-100"
                title="Choice interactions always use identifier base type"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Cardinality</label>
              <input
                type="text"
                value={question.maxChoices === 1 ? 'single' : 'multiple'}
                disabled
                className="mt-1 block w-full bg-gray-100"
                title="Cardinality is determined by maxChoices"
              />
            </div>
          </div>

          {/* Choices */}
          <div>
            <label className="block text-sm font-medium">Choices</label>
            <div className="space-y-2 mt-1">
              {question.choices?.map((choice, index) => (
                <div key={choice.identifier} className="flex gap-4 items-center">
                  <input
                    type="text"
                    value={choice.value}
                    onChange={(e) => handleChoiceAttributeChange(index, 'value', e.target.value)}
                    className="flex-1"
                    placeholder="Enter choice text"
                  />
                  {showAllAttributes && (
                    <>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={choice.fixed || false}
                          onChange={(e) => handleChoiceAttributeChange(index, 'fixed', e.target.checked)}
                        />
                        <span className="text-sm">Fixed</span>
                      </label>
                      <select
                        value={choice.showHide || 'show'}
                        onChange={(e) => handleChoiceAttributeChange(index, 'showHide', e.target.value as 'show' | 'hide')}
                      >
                        <option value="show">Show</option>
                        <option value="hide">Hide</option>
                      </select>
                    </>
                  )}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={question.correctResponse?.includes(choice.identifier)}
                      onChange={(e) => handleCorrectResponseChange(choice.identifier, e.target.checked)}
                    />
                    <span className="text-sm">Correct</span>
                  </label>
                  <button
                    onClick={() => removeChoice(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addChoice}
                className="text-blue-600 hover:text-blue-700"
              >
                + Add Choice
              </button>
            </div>
          </div>

          {/* Optional Attributes */}
          {showAllAttributes && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Max Choices</label>
                  <input
                    type="number"
                    value={question.maxChoices || 1}
                    onChange={(e) => handleMaxChoicesChange(parseInt(e.target.value) || 1)}
                    className="mt-1 block w-full"
                    min={question.minChoices || 0}
                    max={question.choices?.length || 1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Min Choices</label>
                  <input
                    type="number"
                    value={question.minChoices || 0}
                    onChange={(e) => handleMinChoicesChange(parseInt(e.target.value) || 0)}
                    className="mt-1 block w-full"
                    min={0}
                    max={question.maxChoices || question.choices?.length || 1}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Orientation</label>
                <select
                  value={question.orientation || 'vertical'}
                  onChange={(e) => onQuestionChange?.({ orientation: e.target.value as 'vertical' | 'horizontal' })}
                  className="mt-1 block w-full"
                >
                  <option value="vertical">Vertical</option>
                  <option value="horizontal">Horizontal</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={question.shuffle || false}
                    onChange={(e) => onQuestionChange?.({ shuffle: e.target.checked })}
                  />
                  <span className="text-sm">Shuffle Choices</span>
                </label>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className={question.orientation === 'horizontal' ? 'flex gap-4' : 'space-y-2'}>
            {question.choices?.map((choice) => (
              <label
                key={choice.identifier}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type={question.maxChoices === 1 ? 'radio' : 'checkbox'}
                  name={question.responseIdentifier}
                  checked={value.includes(choice.identifier)}
                  onChange={() => handleChoiceChange(choice.identifier)}
                />
                <span dangerouslySetInnerHTML={{ __html: choice.value }} />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 
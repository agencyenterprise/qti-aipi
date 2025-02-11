import React, { useState } from 'react';
import type { TextEntryInteractionType } from '../../types/interactions';

interface TextEntryInteractionProps {
  /**
   * The interaction data
   */
  question: TextEntryInteractionType;

  /**
   * Whether the component is in edit mode
   */
  isEditing?: boolean;

  /**
   * Callback when the response changes
   */
  onResponseChange?: (response: string) => void;

  /**
   * Callback when the question changes in edit mode
   */
  onQuestionChange?: (updates: Partial<TextEntryInteractionType>) => void;

  /**
   * The current response value
   */
  value?: string;
}

export const TextEntryInteraction: React.FC<TextEntryInteractionProps> = ({
  question,
  isEditing = false,
  onResponseChange,
  onQuestionChange,
  value = ''
}) => {
  const [showAllAttributes, setShowAllAttributes] = useState(false);

  const handleResponseChange = (newValue: string) => {
    if (!onResponseChange) return;
    if (question.base === 'integer') {
      const intValue = parseInt(newValue);
      if (!isNaN(intValue)) {
        onResponseChange(intValue.toString());
      }
    } else if (question.base === 'float') {
      const floatValue = parseFloat(newValue);
      if (!isNaN(floatValue)) {
        onResponseChange(floatValue.toString());
      }
    } else {
      onResponseChange(newValue);
    }
  };

  const handleTextAttributeChange = (field: keyof TextEntryInteractionType, value: string) => {
    if (!onQuestionChange) return;
    onQuestionChange({ [field]: value });
  };

  const handleNumericAttributeChange = (field: keyof TextEntryInteractionType, value: string) => {
    if (!onQuestionChange) return;
    const numValue = value ? parseInt(value) : undefined;
    
    // Validate length constraints
    if (field === 'minLength' && question.maxLength && numValue && numValue > question.maxLength) {
      alert('Minimum length cannot be greater than maximum length');
      return;
    }
    if (field === 'maxLength' && question.minLength && numValue && numValue < question.minLength) {
      alert('Maximum length cannot be less than minimum length');
      return;
    }
    if (field === 'expectedLength') {
      if (question.minLength && numValue && numValue < question.minLength) {
        alert('Expected length cannot be less than minimum length');
        return;
      }
      if (question.maxLength && numValue && numValue > question.maxLength) {
        alert('Expected length cannot be greater than maximum length');
        return;
      }
    }
    
    onQuestionChange({ [field]: numValue });
  };

  const handleBooleanAttributeChange = (field: keyof TextEntryInteractionType, value: boolean) => {
    if (!onQuestionChange) return;
    onQuestionChange({ [field]: value });
  };

  const handlePatternMaskChange = (value: string) => {
    if (!onQuestionChange) return;
    
    // Validate pattern mask is a valid regex
    if (value) {
      try {
        new RegExp(value);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Invalid pattern';
        alert(`Invalid regular expression pattern: ${errorMessage}`);
        return;
      }
    }
    
    onQuestionChange({ patternMask: value });
  };

  return (
    <div className="qti-text-entry-interaction">
      {/* Prompt */}
      {isEditing ? (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Prompt</label>
          <textarea
            value={question.prompt || ''}
            onChange={(e) => handleTextAttributeChange('prompt', e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>
      ) : question.prompt ? (
        <div className="mb-4" dangerouslySetInnerHTML={{ __html: question.prompt }} />
      ) : null}

      {isEditing ? (
        <div className="space-y-4">
          {/* Required Attributes */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Response Identifier</label>
              <input
                type="text"
                value={question.responseIdentifier}
                onChange={(e) => handleTextAttributeChange('responseIdentifier', e.target.value)}
                className="mt-1 block w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Base Type</label>
              <select
                value={question.base}
                onChange={(e) => handleTextAttributeChange('base', e.target.value as TextEntryInteractionType['base'])}
                className="mt-1 block w-full"
                required
              >
                <option value="string">String</option>
                <option value="integer">Integer</option>
                <option value="float">Float</option>
              </select>
            </div>
          </div>

          {/* Show all attributes toggle */}
          <div className="flex justify-end border-t pt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showAllAttributes}
                onChange={(e) => setShowAllAttributes(e.target.checked)}
              />
              <span className="text-sm">Show all attributes</span>
            </label>
          </div>

          {/* Optional Attributes */}
          {showAllAttributes && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Expected Length</label>
                  <input
                    type="number"
                    value={question.expectedLength || ''}
                    onChange={(e) => handleNumericAttributeChange('expectedLength', e.target.value)}
                    className="mt-1 block w-full"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Pattern Mask</label>
                  <input
                    type="text"
                    value={question.patternMask || ''}
                    onChange={(e) => handlePatternMaskChange(e.target.value)}
                    className="mt-1 block w-full"
                    placeholder="Regular expression pattern"
                  />
                  {question.patternMask && (
                    <div className="mt-1 text-sm text-gray-500">
                      Pattern will be validated as a regular expression
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Min Length</label>
                  <input
                    type="number"
                    value={question.minLength || ''}
                    onChange={(e) => handleNumericAttributeChange('minLength', e.target.value)}
                    className="mt-1 block w-full"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Max Length</label>
                  <input
                    type="number"
                    value={question.maxLength || ''}
                    onChange={(e) => handleNumericAttributeChange('maxLength', e.target.value)}
                    className="mt-1 block w-full"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Format</label>
                <select
                  value={question.format || 'plain'}
                  onChange={(e) => handleTextAttributeChange('format', e.target.value)}
                  className="mt-1 block w-full"
                >
                  <option value="plain">Plain</option>
                  <option value="preformatted">Preformatted</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Placeholder Text</label>
                <input
                  type="text"
                  value={question.placeholderText || ''}
                  onChange={(e) => handleTextAttributeChange('placeholderText', e.target.value)}
                  className="mt-1 block w-full"
                  placeholder="Text shown when empty"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={question.caseSensitive || false}
                    onChange={(e) => handleBooleanAttributeChange('caseSensitive', e.target.checked)}
                  />
                  <span className="text-sm">Case Sensitive</span>
                </label>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <input
            type={question.base === 'integer' || question.base === 'float' ? 'number' : 'text'}
            value={value}
            onChange={(e) => handleResponseChange(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder={question.placeholderText}
            minLength={question.minLength}
            maxLength={question.maxLength}
            pattern={question.patternMask}
            step={question.base === 'float' ? 'any' : undefined}
          />
          {question.minLength || question.maxLength ? (
            <div className="mt-2 text-sm text-gray-500">
              Characters: {value.length}
              {question.minLength && ` (min: ${question.minLength})`}
              {question.maxLength && ` (max: ${question.maxLength})`}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}; 
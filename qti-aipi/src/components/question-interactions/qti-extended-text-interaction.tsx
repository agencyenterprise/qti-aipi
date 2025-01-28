import React, { useState } from 'react';
import type { ExtendedTextInteractionType } from '../../types/interactions';

interface ExtendedTextInteractionProps {
  /**
   * The interaction data
   */
  question: ExtendedTextInteractionType;

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
  onQuestionChange?: (updates: Partial<ExtendedTextInteractionType>) => void;

  /**
   * The current response value
   */
  value?: string;
}

export const ExtendedTextInteraction: React.FC<ExtendedTextInteractionProps> = ({
  question,
  isEditing = false,
  onResponseChange,
  onQuestionChange,
  value = ''
}) => {
  const [showAllAttributes, setShowAllAttributes] = useState(false);

  const handleResponseChange = (newValue: string) => {
    if (!onResponseChange) return;
    onResponseChange(newValue);
  };

  const handleFormatChange = (format: ExtendedTextInteractionType['format']) => {
    if (!onQuestionChange) return;
    onQuestionChange({ format });
  };

  const handleNumericAttributeChange = (field: keyof ExtendedTextInteractionType, value: string) => {
    if (!onQuestionChange) return;
    const numValue = value ? parseInt(value) : undefined;
    onQuestionChange({ [field]: numValue });
  };

  const handleTextAttributeChange = (field: keyof ExtendedTextInteractionType, value: string) => {
    if (!onQuestionChange) return;
    onQuestionChange({ [field]: value });
  };

  return (
    <div className="qti-extended-text-interaction">
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
            <label className="block text-sm font-medium">Format</label>
            <select
              value={question.format || 'plain'}
              onChange={(e) => handleFormatChange(e.target.value as ExtendedTextInteractionType['format'])}
              className="mt-1 block w-full"
            >
              <option value="plain">Plain Text</option>
              <option value="preformatted">Preformatted</option>
              <option value="xhtml">XHTML</option>
              <option value="base64">Base64</option>
            </select>
          </div>

          {/* Optional Attributes */}
          {showAllAttributes && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Expected Length (chars)</label>
                  <input
                    type="number"
                    value={question.expectedLength || ''}
                    onChange={(e) => handleNumericAttributeChange('expectedLength', e.target.value)}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Pattern Mask</label>
                  <input
                    type="text"
                    value={question.patternMask || ''}
                    onChange={(e) => handleTextAttributeChange('patternMask', e.target.value)}
                    className="mt-1 block w-full"
                    placeholder="Regular expression pattern"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Min Characters</label>
                  <input
                    type="number"
                    value={question.minLength || ''}
                    onChange={(e) => handleNumericAttributeChange('minLength', e.target.value)}
                    className="mt-1 block w-full"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Max Characters</label>
                  <input
                    type="number"
                    value={question.maxLength || ''}
                    onChange={(e) => handleNumericAttributeChange('maxLength', e.target.value)}
                    className="mt-1 block w-full"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Min Paragraphs</label>
                  <input
                    type="number"
                    value={question.minStrings || ''}
                    onChange={(e) => handleNumericAttributeChange('minStrings', e.target.value)}
                    className="mt-1 block w-full"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Max Paragraphs</label>
                  <input
                    type="number"
                    value={question.maxStrings || ''}
                    onChange={(e) => handleNumericAttributeChange('maxStrings', e.target.value)}
                    className="mt-1 block w-full"
                    min="0"
                  />
                </div>
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
            </div>
          )}
        </div>
      ) : (
        <div>
          <textarea
            value={value}
            onChange={(e) => handleResponseChange(e.target.value)}
            className="w-full p-2 border rounded"
            rows={5}
            placeholder={question.placeholderText}
            minLength={question.minLength}
            maxLength={question.maxLength}
          />
          <div className="mt-2 text-sm text-gray-500">
            Characters: {value.length}
            {question.minLength && ` (min: ${question.minLength})`}
            {question.maxLength && ` (max: ${question.maxLength})`}
          </div>
        </div>
      )}
    </div>
  );
}; 
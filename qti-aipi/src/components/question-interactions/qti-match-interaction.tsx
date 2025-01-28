import React, { useState } from 'react';
import type { MatchInteractionType } from '../../types/interactions';
import type { QTIMatchChoice } from '../../types/interactions/match-interaction';

interface MatchInteractionProps {
  /**
   * The interaction data following QTI 3.0 specification
   */
  question: MatchInteractionType;

  /**
   * Whether the component is in edit mode
   */
  isEditing?: boolean;

  /**
   * Callback when the response changes
   * For match interactions, response is an array of directed pairs
   */
  onResponseChange?: (response: string[][]) => void;

  /**
   * Callback when the interaction changes (edit mode)
   */
  onQuestionChange?: (updates: Partial<MatchInteractionType>) => void;

  /**
   * The current response value
   * Must match the interaction's baseType (directedPair) and cardinality (multiple)
   */
  value?: string[][];
}

export const MatchInteraction: React.FC<MatchInteractionProps> = ({
  question,
  isEditing = false,
  onResponseChange,
  onQuestionChange,
  value = []
}) => {
  const [showAllAttributes, setShowAllAttributes] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  // QTI 3.0 validation
  const validateChoice = (choice: QTIMatchChoice): boolean => {
    return (
      !!choice.identifier &&
      !!choice.value &&
      /^[^\s]+(\s[^\s]+)*$/.test(choice.identifier)
    );
  };

  const validateMaxAssociations = (max: number): boolean => {
    if (max < 0) return false;
    if (question.minAssociations && max < question.minAssociations) return false;
    return true;
  };

  const validateMinAssociations = (min: number): boolean => {
    if (min < 0) return false;
    if (question.maxAssociations && min > question.maxAssociations) return false;
    return true;
  };

  const handleSourceClick = (sourceId: string) => {
    if (isEditing) return;
    setSelectedSource(selectedSource === sourceId ? null : sourceId);
  };

  const handleTargetClick = (targetId: string) => {
    if (isEditing || !selectedSource) return;

    // Check if this pair already exists
    const pairExists = value.some(([src, tgt]) => src === selectedSource && tgt === targetId);
    if (pairExists) return;

    // Check maxAssociations constraint
    if (question.maxAssociations) {
      const sourceAssociations = value.filter(([src]) => src === selectedSource).length;
      const targetAssociations = value.filter(([, tgt]) => tgt === targetId).length;
      
      if (sourceAssociations >= question.maxAssociations || 
          targetAssociations >= question.maxAssociations) {
        setSelectedSource(null);
        return;
      }
    }

    const newPairs = [...value, [selectedSource, targetId]];
    setSelectedSource(null);
    onResponseChange?.(newPairs);
  };

  const handleSourceChoiceChange = (index: number, updates: Partial<QTIMatchChoice>) => {
    if (!onQuestionChange) return;
    const newSourceChoices = [...question.sourceChoices];
    const updatedChoice = { ...newSourceChoices[index], ...updates };

    if ('identifier' in updates || 'value' in updates) {
      if (validateChoice(updatedChoice as QTIMatchChoice)) {
        newSourceChoices[index] = updatedChoice;
        onQuestionChange({ sourceChoices: newSourceChoices });
      }
    } else {
      newSourceChoices[index] = updatedChoice;
      onQuestionChange({ sourceChoices: newSourceChoices });
    }
  };

  const handleTargetChoiceChange = (index: number, updates: Partial<QTIMatchChoice>) => {
    if (!onQuestionChange) return;
    const newTargetChoices = [...question.targetChoices];
    const updatedChoice = { ...newTargetChoices[index], ...updates };

    if ('identifier' in updates || 'value' in updates) {
      if (validateChoice(updatedChoice as QTIMatchChoice)) {
        newTargetChoices[index] = updatedChoice;
        onQuestionChange({ targetChoices: newTargetChoices });
      }
    } else {
      newTargetChoices[index] = updatedChoice;
      onQuestionChange({ targetChoices: newTargetChoices });
    }
  };

  const handleMaxAssociationsChange = (value: number) => {
    if (!onQuestionChange) return;
    if (validateMaxAssociations(value)) {
      onQuestionChange({ maxAssociations: value });
    }
  };

  const handleMinAssociationsChange = (value: number) => {
    if (!onQuestionChange) return;
    if (validateMinAssociations(value)) {
      onQuestionChange({ minAssociations: value });
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onQuestionChange?.({ prompt: e.target.value });
  };

  const addSourceChoice = () => {
    const newChoice = {
      identifier: `source_${question.sourceChoices.length + 1}`,
      value: ''
    };
    onQuestionChange?.({ 
      sourceChoices: [...question.sourceChoices, newChoice]
    });
  };

  const addTargetChoice = () => {
    const newChoice = {
      identifier: `target_${question.targetChoices.length + 1}`,
      value: ''
    };
    onQuestionChange?.({ 
      targetChoices: [...question.targetChoices, newChoice]
    });
  };

  const removeSourceChoice = (index: number) => {
    onQuestionChange?.({
      sourceChoices: question.sourceChoices.filter((_, i) => i !== index)
    });
  };

  const removeTargetChoice = (index: number) => {
    onQuestionChange?.({
      targetChoices: question.targetChoices.filter((_, i) => i !== index)
    });
  };

  if (isEditing) {
    return (
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
              value="directedPair"
              disabled
              className="mt-1 block w-full bg-gray-100"
              title="Match interactions always use directedPair base type"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Cardinality</label>
            <input
              type="text"
              value="multiple"
              disabled
              className="mt-1 block w-full bg-gray-100"
              title="Match interactions always use multiple cardinality"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Prompt</label>
            <textarea
              value={question.prompt || ''}
              onChange={handlePromptChange}
              className="mt-1 block w-full"
              rows={3}
            />
          </div>
        </div>

        {/* Source Choices */}
        <div>
          <label className="block text-sm font-medium">Source Choices</label>
          <div className="space-y-2">
            {question.sourceChoices.map((choice, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={choice.identifier}
                  onChange={(e) => handleSourceChoiceChange(index, { identifier: e.target.value })}
                  className="w-1/3"
                  placeholder="Identifier"
                  required
                />
                <input
                  type="text"
                  value={choice.value}
                  onChange={(e) => handleSourceChoiceChange(index, { value: e.target.value })}
                  className="flex-1"
                  placeholder="Value"
                  required
                />
                {showAllAttributes && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={choice.fixed || false}
                      onChange={(e) => handleSourceChoiceChange(index, { fixed: e.target.checked })}
                    />
                    <span className="text-sm">Fixed</span>
                  </label>
                )}
                <button
                  onClick={() => removeSourceChoice(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addSourceChoice}
              className="text-blue-600 hover:text-blue-800"
            >
              + Add Source Choice
            </button>
          </div>
        </div>

        {/* Target Choices */}
        <div>
          <label className="block text-sm font-medium">Target Choices</label>
          <div className="space-y-2">
            {question.targetChoices.map((choice, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={choice.identifier}
                  onChange={(e) => handleTargetChoiceChange(index, { identifier: e.target.value })}
                  className="w-1/3"
                  placeholder="Identifier"
                  required
                />
                <input
                  type="text"
                  value={choice.value}
                  onChange={(e) => handleTargetChoiceChange(index, { value: e.target.value })}
                  className="flex-1"
                  placeholder="Value"
                  required
                />
                {showAllAttributes && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={choice.fixed || false}
                      onChange={(e) => handleTargetChoiceChange(index, { fixed: e.target.checked })}
                    />
                    <span className="text-sm">Fixed</span>
                  </label>
                )}
                <button
                  onClick={() => removeTargetChoice(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addTargetChoice}
              className="text-blue-600 hover:text-blue-800"
            >
              + Add Target Choice
            </button>
          </div>
        </div>

        {/* Optional Attributes */}
        {showAllAttributes && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Maximum Associations</label>
                <input
                  type="number"
                  value={question.maxAssociations || ''}
                  onChange={(e) => handleMaxAssociationsChange(parseInt(e.target.value))}
                  className="mt-1 block w-full"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Minimum Associations</label>
                <input
                  type="number"
                  value={question.minAssociations || ''}
                  onChange={(e) => handleMinAssociationsChange(parseInt(e.target.value))}
                  className="mt-1 block w-full"
                  min="0"
                />
              </div>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={question.shuffle || false}
                onChange={(e) => onQuestionChange?.({ shuffle: e.target.checked })}
                className="mr-2"
              />
              Shuffle Choices
            </label>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {question.prompt && (
        <div className="qti-prompt" dangerouslySetInnerHTML={{ __html: question.prompt }} />
      )}
      
      <div className="flex gap-8">
        {/* Source Choices */}
        <div className="flex-1">
          <h3 className="font-medium mb-2">Source Choices</h3>
          <div className="space-y-2">
            {question.sourceChoices.map(choice => (
              <div
                key={choice.identifier}
                onClick={() => handleSourceClick(choice.identifier)}
                className={`
                  p-2 border rounded cursor-pointer
                  ${selectedSource === choice.identifier ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}
                `}
              >
                <div dangerouslySetInnerHTML={{ __html: choice.value }} />
              </div>
            ))}
          </div>
        </div>

        {/* Target Choices */}
        <div className="flex-1">
          <h3 className="font-medium mb-2">Target Choices</h3>
          <div className="space-y-2">
            {question.targetChoices.map(choice => (
              <div
                key={choice.identifier}
                onClick={() => handleTargetClick(choice.identifier)}
                className={`
                  p-2 border rounded cursor-pointer
                  ${value.some(pair => pair[1] === choice.identifier) ? 'bg-blue-100 border-blue-500' : 
                    selectedSource ? 'hover:bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}
                `}
              >
                <div dangerouslySetInnerHTML={{ __html: choice.value }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Pairs */}
      {value.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Selected Pairs</h3>
          <div className="space-y-2">
            {value.map(([sourceId, targetId], index) => {
              const source = question.sourceChoices.find(c => c.identifier === sourceId);
              const target = question.targetChoices.find(c => c.identifier === targetId);
              return (
                <div key={index} className="flex items-center gap-2">
                  <div dangerouslySetInnerHTML={{ __html: source?.value || '' }} />
                  <span>→</span>
                  <div dangerouslySetInnerHTML={{ __html: target?.value || '' }} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}; 
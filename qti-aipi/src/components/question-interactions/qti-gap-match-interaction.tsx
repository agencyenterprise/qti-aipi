import React, { useState } from 'react';
import type { GapMatchInteractionType } from '../../types/interactions';
import type { QTIGap, QTIGapChoice } from '../../types/interactions/gap-match-interaction';

interface GapMatchInteractionProps {
  /**
   * The interaction data following QTI 3.0 specification
   */
  question: GapMatchInteractionType;
  
  /**
   * Whether the component is in edit mode
   */
  isEditing?: boolean;
  
  /**
   * Callback when the response changes (display mode)
   * For gap match interactions, response is an array of directed pairs
   */
  onResponseChange?: (response: string[][]) => void;
  
  /**
   * Callback when the interaction changes (edit mode)
   */
  onQuestionChange?: (updates: Partial<GapMatchInteractionType>) => void;
  
  /**
   * The current response value
   * Must match the interaction's baseType (directedPair) and cardinality (multiple)
   */
  value?: string[][];
}

export const GapMatchInteraction: React.FC<GapMatchInteractionProps> = ({
  question,
  isEditing = false,
  onResponseChange,
  onQuestionChange,
  value = []
}) => {
  const [showAllAttributes, setShowAllAttributes] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  // QTI 3.0 validation
  const validateChoice = (choice: QTIGapChoice): boolean => {
    return (
      !!choice.identifier &&
      !!choice.value &&
      /^[^\s]+(\s[^\s]+)*$/.test(choice.identifier)
    );
  };

  const validateGap = (gap: QTIGap): boolean => {
    return (
      !!gap.identifier &&
      /^[^\s]+(\s[^\s]+)*$/.test(gap.identifier)
    );
  };

  const validateResponseIdentifier = (identifier: string): boolean => {
    return /^[^\s]+(\s[^\s]+)*$/.test(identifier);
  };

  const handleChoiceClick = (choiceId: string) => {
    if (isEditing) return;
    setSelectedChoice(selectedChoice === choiceId ? null : choiceId);
  };

  const handleGapClick = (gapId: string) => {
    if (isEditing || !selectedChoice) return;

    // Check if this pair already exists
    const pairExists = value.some(([choice, gap]) => choice === selectedChoice && gap === gapId);
    if (pairExists) return;

    // Check if the gap already has a choice
    const gapFilled = value.some(([, gap]) => gap === gapId);
    if (gapFilled) return;

    // Check if the choice has reached its matchMax
    const choice = question.choices.find(c => c.identifier === selectedChoice);
    if (choice?.matchMax) {
      const choiceMatches = value.filter(([c]) => c === selectedChoice).length;
      if (choiceMatches >= choice.matchMax) {
        setSelectedChoice(null);
        return;
      }
    }

    const newPairs = [...value, [selectedChoice, gapId]];
    setSelectedChoice(null);
    onResponseChange?.(newPairs);
  };

  const handleResponseIdentifierChange = (newIdentifier: string) => {
    if (!onQuestionChange) return;
    if (validateResponseIdentifier(newIdentifier)) {
      onQuestionChange({ responseIdentifier: newIdentifier });
    }
  };

  const handleChoiceChange = (index: number, updates: Partial<QTIGapChoice>) => {
    if (!onQuestionChange) return;
    const newChoices = [...question.choices];
    const updatedChoice = { ...newChoices[index], ...updates };

    if ('identifier' in updates || 'value' in updates) {
      if (validateChoice(updatedChoice as QTIGapChoice)) {
        newChoices[index] = updatedChoice;
        onQuestionChange({ choices: newChoices });
      }
    } else {
      newChoices[index] = updatedChoice;
      onQuestionChange({ choices: newChoices });
    }
  };

  const handleGapChange = (index: number, updates: Partial<QTIGap>) => {
    if (!onQuestionChange) return;
    const newGaps = [...question.gaps];
    const updatedGap = { ...newGaps[index], ...updates };

    if ('identifier' in updates) {
      if (validateGap(updatedGap as QTIGap)) {
        newGaps[index] = updatedGap;
        onQuestionChange({ gaps: newGaps });
      }
    } else {
      newGaps[index] = updatedGap;
      onQuestionChange({ gaps: newGaps });
    }
  };

  const addChoice = () => {
    const newChoice: QTIGapChoice = {
      identifier: `choice_${question.choices.length + 1}`,
      value: '',
      matchMax: 1,
      matchMin: 0
    };
    
    if (validateChoice(newChoice)) {
      onQuestionChange?.({ 
        choices: [...question.choices, newChoice]
      });
    }
  };

  const addGap = () => {
    const newGap: QTIGap = {
      identifier: `gap_${question.gaps.length + 1}`,
      fixed: false,
      required: false
    };
    
    if (validateGap(newGap)) {
      onQuestionChange?.({ 
        gaps: [...question.gaps, newGap]
      });
    }
  };

  const removeChoice = (index: number) => {
    onQuestionChange?.({
      choices: question.choices.filter((_, i) => i !== index)
    });
  };

  const removeGap = (index: number) => {
    onQuestionChange?.({
      gaps: question.gaps.filter((_, i) => i !== index)
    });
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onQuestionChange?.({ prompt: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onQuestionChange?.({ content: e.target.value });
  };

  return (
    <div className="qti-gap-match-interaction">
      {/* Prompt */}
      {isEditing ? (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Prompt</label>
          <textarea
            value={question.prompt || ''}
            onChange={handlePromptChange}
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

          {/* Response Identifier */}
          <div>
            <label className="block text-sm font-medium">Response Identifier</label>
            <input
              type="text"
              value={question.responseIdentifier}
              onChange={(e) => handleResponseIdentifierChange(e.target.value)}
              className="mt-1 block w-full"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium">Content</label>
            <textarea
              value={question.content}
              onChange={handleContentChange}
              className="mt-1 block w-full"
              rows={5}
            />
          </div>

          {/* Choices */}
          <div>
            <label className="block text-sm font-medium">Choices</label>
            <div className="space-y-2">
              {question.choices.map((choice, index) => (
                <div key={choice.identifier} className="space-y-2 border p-4 rounded">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={choice.identifier}
                      onChange={(e) => handleChoiceChange(index, { identifier: e.target.value })}
                      className="w-1/3"
                      placeholder="Identifier"
                    />
                    <input
                      type="text"
                      value={choice.value}
                      onChange={(e) => handleChoiceChange(index, { value: e.target.value })}
                      className="flex-1"
                      placeholder="Value"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <label className="text-sm">Match Max</label>
                      <input
                        type="number"
                        value={choice.matchMax}
                        onChange={(e) => handleChoiceChange(index, { matchMax: parseInt(e.target.value) })}
                        className="w-20"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Match Min</label>
                      <input
                        type="number"
                        value={choice.matchMin || 0}
                        onChange={(e) => handleChoiceChange(index, { matchMin: parseInt(e.target.value) })}
                        className="w-20"
                      />
                    </div>
                    {showAllAttributes && (
                      <>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={choice.fixed || false}
                            onChange={(e) => handleChoiceChange(index, { fixed: e.target.checked })}
                            className="mr-2"
                          />
                          Fixed
                        </label>
                        <input
                          type="text"
                          value={choice.matchGroup || ''}
                          onChange={(e) => handleChoiceChange(index, { matchGroup: e.target.value })}
                          className="w-32"
                          placeholder="Match Group"
                        />
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => removeChoice(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addChoice}
                className="text-blue-600 hover:text-blue-800"
              >
                + Add Choice
              </button>
            </div>
          </div>

          {/* Gaps */}
          <div>
            <label className="block text-sm font-medium">Gaps</label>
            <div className="space-y-2">
              {question.gaps.map((gap, index) => (
                <div key={gap.identifier} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={gap.identifier}
                    onChange={(e) => handleGapChange(index, { identifier: e.target.value })}
                    className="flex-1"
                    placeholder="Gap Identifier"
                  />
                  {showAllAttributes && (
                    <>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={gap.fixed || false}
                          onChange={(e) => handleGapChange(index, { fixed: e.target.checked })}
                        />
                        <span className="text-sm">Fixed</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={gap.required || false}
                          onChange={(e) => handleGapChange(index, { required: e.target.checked })}
                        />
                        <span className="text-sm">Required</span>
                      </label>
                    </>
                  )}
                  <button
                    onClick={() => removeGap(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addGap}
                className="text-blue-600 hover:text-blue-800"
              >
                + Add Gap
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Display mode content with gaps */}
          <div className="gap-match-content">
            {question.content.split(/(\[gap\s+[^\]]+\])/).map((part, index) => {
              const gapMatch = part.match(/\[gap\s+([^\]]+)\]/);
              if (gapMatch) {
                const gapId = gapMatch[1];
                const gap = question.gaps.find(g => g.identifier === gapId);
                if (!gap) return null;
                
                const match = value.find(pair => pair[1] === gapId);
                const choice = match ? question.choices.find(c => c.identifier === match[0]) : null;
                
                return (
                  <button
                    key={`gap-${index}`}
                    onClick={() => handleGapClick(gapId)}
                    className={`inline-block px-4 py-1 mx-1 border rounded ${
                      match ? 'bg-blue-100 border-blue-500' : 'border-dashed'
                    }`}
                  >
                    {choice ? choice.value : `[Gap ${gapId}]`}
                  </button>
                );
              }
              return <span key={`text-${index}`}>{part}</span>;
            })}
          </div>
          
          {/* Choices */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {question.choices.map((choice) => (
                <button
                  key={choice.identifier}
                  onClick={() => handleChoiceClick(choice.identifier)}
                  className={`px-4 py-2 rounded border ${
                    selectedChoice === choice.identifier
                      ? 'bg-blue-100 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {choice.value}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 
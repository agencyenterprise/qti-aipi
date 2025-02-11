import React, { useState, useEffect } from 'react';
import type { ChoiceInteractionType, QTIChoice } from '../../../types/interactions';
import { BaseInteractionProps, BaseInteractionComponent } from './base';

interface ChoiceInteractionProps extends Omit<BaseInteractionProps, 'interaction' | 'value' | 'onResponseChange'> {
  /**
   * The choice interaction data
   */
  interaction: ChoiceInteractionType;

  /**
   * Callback when the response changes
   * For choice interactions, response is always string[]
   */
  onResponseChange: (response: string[]) => void;

  /**
   * The current response value(s)
   * For choice interactions, value is always string[]
   */
  value?: string[];
}

/**
 * Component for displaying QTI choice interactions
 */
export const ChoiceInteractionDisplay: React.FC<ChoiceInteractionProps> = ({
  interaction,
  onResponseChange,
  disabled = false,
  reviewMode = false,
  value = [],
  showFeedback = false,
  isCorrect,
  className,
  lang,
  label
}) => {
  const [selectedChoices, setSelectedChoices] = useState<string[]>(value);

  useEffect(() => {
    setSelectedChoices(value);
  }, [value]);

  const handleChoiceClick = (choiceId: string) => {
    if (disabled || reviewMode) return;

    let newSelected: string[];
    if (interaction.maxChoices === 1) {
      // Single choice
      newSelected = [choiceId];
    } else {
      // Multiple choice
      if (selectedChoices.includes(choiceId)) {
        newSelected = selectedChoices.filter(id => id !== choiceId);
      } else {
        if (interaction.maxChoices && selectedChoices.length >= interaction.maxChoices) {
          return;
        }
        newSelected = [...selectedChoices, choiceId];
      }
    }

    setSelectedChoices(newSelected);
    onResponseChange(newSelected);
  };

  return (
    <div className="qti-choice-interaction">
      <BaseInteractionComponent
        interaction={interaction}
        onResponseChange={onResponseChange as BaseInteractionProps['onResponseChange']}
        disabled={disabled}
        reviewMode={reviewMode}
        value={value}
        showFeedback={showFeedback}
        isCorrect={isCorrect}
        className={className}
        lang={lang}
        label={label}
      />
      
      <div className={`qti-choices ${interaction.orientation === 'horizontal' ? 'flex gap-4' : 'flex flex-col gap-2'}`}>
        {interaction.choices.map((choice: QTIChoice) => (
          <div
            key={choice.identifier}
            className={`
              qti-choice p-4 border rounded cursor-pointer
              ${selectedChoices.includes(choice.identifier) ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}
              ${disabled || reviewMode ? 'opacity-75 cursor-not-allowed' : ''}
              ${reviewMode && interaction.correctResponse?.includes(choice.identifier) ? 'border-green-500' : ''}
            `}
            onClick={() => handleChoiceClick(choice.identifier)}
          >
            <div className="flex items-center gap-2">
              <div className={`
                w-4 h-4 border rounded-${interaction.maxChoices === 1 ? 'full' : 'sm'}
                ${selectedChoices.includes(choice.identifier) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}
              `} />
              <div dangerouslySetInnerHTML={{ __html: choice.value }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
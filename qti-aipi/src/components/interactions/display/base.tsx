import React from 'react';
import { BaseInteraction } from '../../../types/interactions';

export interface BaseInteractionProps {
  /**
   * The interaction data following QTI 3.0 specification
   */
  interaction: BaseInteraction;

  /**
   * Callback when the response changes
   * Response type must match the interaction's baseType and cardinality
   */
  onResponseChange: (response: string | string[] | string[][]) => void;

  /**
   * Whether the interaction is disabled
   * @qti optional. Corresponds to the disabled attribute in QTI 3.0
   */
  disabled?: boolean;

  /**
   * Whether the interaction is in review mode
   * @qti optional. Used when reviewing submitted responses
   */
  reviewMode?: boolean;

  /**
   * The current response value(s)
   * Must match the interaction's baseType and cardinality
   */
  value?: string | string[] | string[][];

  /**
   * Whether to show feedback
   * @qti optional. Controls visibility of modalFeedback
   */
  showFeedback?: boolean;

  /**
   * Whether the current response is correct
   * @qti optional. Used for feedback and scoring
   */
  isCorrect?: boolean;

  /**
   * Custom class name for styling
   * @qti optional. Maps to class attribute in QTI 3.0
   */
  className?: string;

  /**
   * Language code for the interaction
   * @qti optional. Maps to xml:lang in QTI 3.0
   */
  lang?: string;

  /**
   * Label for accessibility
   * @qti optional. Maps to label attribute in QTI 3.0
   */
  label?: string;
}

/**
 * Base component for displaying QTI interactions
 * Implements common QTI 3.0 interaction features
 */
export const BaseInteractionComponent: React.FC<BaseInteractionProps> = ({
  interaction,
  showFeedback = false,
  isCorrect,
  className = '',
  lang,
  label
}) => {
  return (
    <div 
      className={`qti-interaction ${className}`}
      lang={lang}
      aria-label={label}
      role="group"
    >
      {interaction.prompt && (
        <div 
          className="qti-prompt mb-4"
          dangerouslySetInnerHTML={{ __html: interaction.prompt }}
        />
      )}
      
      {showFeedback && interaction.feedback && (
        <div 
          className={`qti-feedback mt-4 p-4 rounded ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}
          role="alert"
          aria-live="polite"
        >
          {isCorrect ? interaction.feedback.correct : interaction.feedback.incorrect}
        </div>
      )}
    </div>
  );
}; 
/**
 * Base type for all QTI interaction types
 */
export type BaseType = 'identifier' | 'boolean' | 'integer' | 'float' | 'string' | 'point' | 'pair' | 'directedPair' | 'duration' | 'file' | 'uri';

/**
 * Interface for feedback in QTI interactions
 */
export interface InteractionFeedback {
  /**
   * Feedback shown when the response is correct
   */
  correct: string;

  /**
   * Feedback shown when the response is incorrect
   */
  incorrect: string;
}

/**
 * Base interface for all QTI 3.0 interactions
 */
export interface BaseInteraction {
  /**
   * The type of interaction
   * @qti Required. Identifies the specific interaction type
   */
  type: string;

  /**
   * A unique identifier for the interaction
   * @qti Required. Must be unique within the scope of its containing assessmentItem
   */
  responseIdentifier: string;

  /**
   * Whether a response is required
   */
  required?: boolean;

  /**
   * The prompt or question text shown to the candidate
   * @qti optional. HTML content that provides instructions or context
   */
  prompt?: string;

  /**
   * The base type of the response
   */
  baseType?: BaseType;

  /**
   * Pre-conditions that must be met before this interaction is available
   */
  preConditions?: string[];

  /**
   * The expected correct response(s)
   * @qti optional. Array of values that represent correct answers. Note: Some interaction types may override this type
   */
  correctResponse?: string[] | string[][];

  /**
   * Optional feedback to show based on the response
   */
  feedback?: InteractionFeedback;
} 
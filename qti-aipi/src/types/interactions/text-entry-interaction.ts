import { BaseInteraction } from './base-interaction';

export interface TextEntryInteraction extends BaseInteraction {
  type: 'textEntryInteraction';
  
  /**
   * The base type of the response
   * @qti Required. Must be one of: string, integer, float
   */
  base: 'string' | 'integer' | 'float';

  /**
   * The expected length of the response in characters
   * @qti optional
   */
  expectedLength?: number;

  /**
   * Pattern mask for validating input
   * @qti optional
   */
  patternMask?: string;

  /**
   * Placeholder text shown when input is empty
   * @qti optional
   */
  placeholderText?: string;

  /**
   * The format of the text input
   * @qti optional
   */
  format?: 'plain' | 'preformatted';

  /**
   * Whether the response is case sensitive
   * @qti optional
   */
  caseSensitive?: boolean;

  /**
   * The maximum length of the response in characters
   * @qti optional
   */
  maxLength?: number;

  /**
   * The minimum length of the response in characters
   * @qti optional
   */
  minLength?: number;
} 
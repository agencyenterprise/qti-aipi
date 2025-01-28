import { BaseInteraction } from './base-interaction';

/**
 * Represents a QTI 3.0 Extended Text Interaction
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.3rdcrjn
 */
export interface ExtendedTextInteraction extends BaseInteraction {
  type: 'extendedTextInteraction';

  // Required attributes from QTI spec
  responseIdentifier: string;

  // Optional attributes from QTI spec
  /**
   * The format of the text input
   * @qti optional. Can be 'plain' (default) or 'preformatted'
   */
  format?: 'plain' | 'preformatted' | 'xhtml' | 'base64';

  /**
   * The expected length of the response in characters
   * @qti optional. Provides a hint to the candidate
   */
  expectedLength?: number;

  /**
   * The maximum length of the response in characters
   * @qti optional. Must be greater than 0
   */
  maxLength?: number;

  /**
   * The minimum length of the response in characters
   * @qti optional. Must be greater than or equal to 0
   */
  minLength?: number;

  /**
   * The maximum number of lines of text allowed
   * @qti optional. Must be greater than 0
   */
  maxStrings?: number;

  /**
   * The minimum number of lines of text required
   * @qti optional. Must be greater than or equal to 0
   */
  minStrings?: number;

  /**
   * Pattern mask for validating input
   * @qti optional. Regular expression pattern for input validation
   */
  patternMask?: string;

  /**
   * Placeholder text shown when input is empty
   * @qti optional. Provides a hint about expected input
   */
  placeholderText?: string;
} 
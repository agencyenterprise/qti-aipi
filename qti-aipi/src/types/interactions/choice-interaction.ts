import { BaseInteraction } from './base-interaction';

/**
 * Represents a choice in a QTI choice interaction
 * @see https://www.imsglobal.org/sites/default/files/spec/qti/v3/info/index.html#element-simpleChoice
 */
export interface QTIChoice {
  /**
   * A unique identifier for the choice
   * @qti Required. Must be unique within the scope of its containing interaction
   */
  identifier: string;

  /**
   * The content/text of the choice
   * @qti Required. The actual content shown to the candidate
   */
  value: string;

  /**
   * Whether the choice is fixed in position
   * @qti optional. If true, the choice will not be shuffled
   */
  fixed?: boolean;

  /**
   * Template identifier for templated choices
   * @qti optional. Used for template-driven choice generation
   */
  templateIdentifier?: string;

  /**
   * Controls visibility of the choice
   * @qti optional. Can be 'show' or 'hide'
   */
  showHide?: 'show' | 'hide';

  /**
   * Group identifier for matching choices
   * @qti optional. Used in match interactions
   */
  matchGroup?: string;

  /**
   * Maximum number of times this choice can be matched
   * @qti optional. Must be greater than 0
   */
  matchMax?: number;

  /**
   * Minimum number of times this choice must be matched
   * @qti optional. Must be greater than or equal to 0 and less than or equal to matchMax
   */
  matchMin?: number;

  /**
   * CSS class name(s) for styling
   * @qti optional
   */
  class?: string;

  /**
   * Language code for the choice content
   * @qti optional. BCP 47 language tag
   */
  lang?: string;

  /**
   * Label for accessibility
   * @qti optional
   */
  label?: string;
}

/**
 * Represents a QTI choiceInteraction
 * @see https://www.imsglobal.org/sites/default/files/spec/qti/v3/info/index.html#element-choiceInteraction
 */
export interface ChoiceInteraction extends BaseInteraction {
  /**
   * Required: The type of interaction
   */
  type: 'choiceInteraction';
  
  /**
   * Required: The identifier for the response variable
   */
  responseIdentifier: string;

  /**
   * The available choices for the interaction
   * @qti Required. Array of QTIChoice objects
   */
  choices: QTIChoice[];

  /**
   * Maximum number of choices that can be selected
   * @qti optional. Must be greater than 0 and less than or equal to the number of choices
   */
  maxChoices?: number;

  /**
   * Minimum number of choices that must be selected
   * @qti optional. Must be greater than or equal to 0 and less than or equal to maxChoices
   */
  minChoices?: number;

  /**
   * Whether the choices should be randomly ordered
   * @qti optional. If true, choices without fixed=true will be shuffled
   */
  shuffle?: boolean;

  /**
   * The orientation of the choices
   * @qti optional. Can be 'horizontal' or 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Optional: The prompt/question text
   */
  prompt?: string;

  /**
   * Required: The correct response(s)
   */
  correctResponse: string[];

  /**
   * CSS class name(s) for styling the interaction container
   * @qti optional
   */
  class?: string;

  /**
   * Language code for the interaction
   * @qti optional. BCP 47 language tag
   */
  lang?: string;

  /**
   * Label for accessibility
   * @qti optional
   */
  label?: string;

  /**
   * Data-* attributes for custom data
   * @qti optional. Key-value pairs for custom data attributes
   */
  data?: Record<string, string>;
} 
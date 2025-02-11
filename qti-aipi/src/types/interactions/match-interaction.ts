import { BaseInteraction } from './base-interaction';

/**
 * Represents a choice in a QTI match interaction
 * @see https://www.imsglobal.org/sites/default/files/spec/qti/v3/info/index.html#element-simpleMatchSet
 */
export interface QTIMatchChoice {
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
}

/**
 * Represents a QTI matchInteraction
 * @see https://www.imsglobal.org/sites/default/files/spec/qti/v3/info/index.html#element-matchInteraction
 */
export interface MatchInteraction extends BaseInteraction {
  /**
   * Required: The type of interaction
   */
  type: 'matchInteraction';

  /**
   * Required: The identifier for the response variable
   */
  responseIdentifier: string;

  /**
   * The first set of choices to match from
   * @qti Required. Array of QTIMatchChoice objects
   */
  sourceChoices: QTIMatchChoice[];

  /**
   * The second set of choices to match to
   * @qti Required. Array of QTIMatchChoice objects
   */
  targetChoices: QTIMatchChoice[];

  /**
   * Maximum number of associations that can be made
   * @qti optional. Must be greater than 0
   */
  maxAssociations?: number;

  /**
   * Minimum number of associations that must be made
   * @qti optional. Must be greater than or equal to 0
   */
  minAssociations?: number;

  /**
   * Whether the choices should be randomly ordered
   * @qti optional. If true, choices without fixed=true will be shuffled
   */
  shuffle?: boolean;

  /**
   * Required: The correct response(s) as pairs of identifiers
   */
  correctResponse: string[][];
} 
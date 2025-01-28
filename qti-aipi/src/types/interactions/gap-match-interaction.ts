import { BaseInteraction } from './base-interaction';

/**
 * Interface for a gap choice in a gap match interaction
 * @qti Represents a choice that can be matched to a gap in the text
 */
export interface QTIGapChoice {
  /**
   * Required identifier for the gap choice
   * @qti required
   */
  identifier: string;

  /**
   * The content of the gap choice
   * @qti required
   */
  value: string;

  /**
   * Maximum number of times this choice can be matched
   * @qti required
   */
  matchMax: number;

  /**
   * Minimum number of times this choice must be matched
   * @qti optional
   */
  matchMin?: number;

  /**
   * Whether the choice is fixed and cannot be matched
   * @qti optional
   */
  fixed?: boolean;

  /**
   * Identifier used when the choice is part of a template
   * @qti optional
   */
  templateIdentifier?: string;

  /**
   * Controls visibility of the choice
   * @qti optional
   */
  showHide?: 'show' | 'hide';

  /**
   * Defines which match group this choice belongs to
   * @qti optional
   */
  matchGroup?: string;
}

/**
 * Interface for a gap in a gap match interaction
 * @qti Represents a gap in the text where choices can be placed
 */
export interface QTIGap {
  /**
   * Required identifier for the gap
   * @qti required
   */
  identifier: string;

  /**
   * Whether the gap is fixed in position
   * @qti optional
   */
  fixed?: boolean;

  /**
   * Required number of matches for this gap
   * @qti optional
   */
  required?: boolean;
}

/**
 * Interface for a gap match interaction
 * @qti Represents a gap match interaction where candidates associate choices with gaps in a piece of text
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.3rdcrjn
 */
export interface GapMatchInteraction extends BaseInteraction {
  /**
   * The type of interaction
   * @qti required
   */
  type: 'gapMatchInteraction';

  /**
   * The text content containing gaps
   * @qti required
   */
  content: string;

  /**
   * The available choices to match with gaps
   * @qti required
   */
  choices: QTIGapChoice[];

  /**
   * The gaps in the text
   * @qti required
   */
  gaps: QTIGap[];

  /**
   * Whether the choices should be shuffled
   * @qti optional
   */
  shuffle?: boolean;

  /**
   * The base type of the response, must be 'directedPair'
   * @qti required
   */
  baseType: 'directedPair';

  /**
   * The cardinality of the response, must be 'multiple'
   * @qti required
   */
  cardinality: 'multiple';

  /**
   * The correct response pairs (choice identifier, gap identifier)
   * @qti required
   */
  correctResponse: string[][];

  /**
   * The prompt for the interaction
   * @qti optional
   */
  prompt?: string;
} 

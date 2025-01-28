/**
 * QTI 3.0 Core Types
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl
 */

/**
 * Base types for variables and responses
 * @qti These are the fundamental data types in QTI
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.baseType
 */
export type BaseType = 
  | 'identifier'  // A string identifier
  | 'boolean'     // true/false
  | 'integer'     // Whole numbers
  | 'float'       // Decimal numbers
  | 'string'      // Text strings
  | 'point'       // 2D coordinates
  | 'pair'        // Two identifiers
  | 'directedPair' // Ordered pair of identifiers
  | 'duration'    // Time duration
  | 'file'        // File reference
  | 'uri';        // URI reference

/**
 * Cardinality defines how many values a variable can hold
 * @qti Specifies the number of values that can be stored
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.cardinality
 */
export type Cardinality = 
  | 'single'    // One value
  | 'multiple'  // Unordered set of values
  | 'ordered'   // Ordered set of values
  | 'record';   // Key-value pairs

/**
 * Common attributes shared by many QTI elements
 * @qti These attributes appear on multiple element types
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.commonAttributes
 */
export interface CommonAttributes {
  /**
   * Unique identifier within the scope of its containing object
   * @qti required
   */
  identifier: string;

  /**
   * Human-readable title
   * @qti optional
   */
  title?: string;

  /**
   * Label for display purposes
   * @qti optional
   */
  label?: string;

  /**
   * Language code (e.g., 'en-US')
   * @qti optional
   */
  lang?: string;

  /**
   * Base URI for resolving relative URIs
   * @qti optional
   */
  base?: string;
}

/**
 * View types for content visibility
 * @qti Controls when content is visible
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.view
 */
export type View = 
  | 'author'      // Visible in authoring
  | 'candidate'   // Visible to test taker
  | 'proctor'     // Visible to proctor
  | 'scorer'      // Visible to scorer
  | 'testConstructor' // Visible in test construction
  | 'tutor';      // Visible to tutor

/**
 * Navigation modes for test parts
 * @qti Controls how candidates can move between items
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.navigationMode
 */
export type NavigationMode = 
  | 'linear'     // Items must be done in sequence
  | 'nonlinear'; // Items can be done in any order

/**
 * Submission modes for test parts
 * @qti Controls how responses are submitted
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.submissionMode
 */
export type SubmissionMode = 
  | 'individual'    // Each item submitted separately
  | 'simultaneous'; // All items submitted together

/**
 * Show/Hide states for feedback
 * @qti Controls feedback visibility
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.showHide
 */
export type ShowHide = 'show' | 'hide';

/**
 * Orientation for display
 * @qti Controls layout direction
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.orientation
 */
export type Orientation = 'horizontal' | 'vertical';

/**
 * Text direction
 * @qti Controls text direction
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.textDirection
 */
export type TextDirection = 'ltr' | 'rtl' | 'auto';

/**
 * Response declaration for assessment items
 * @qti Defines how responses are processed
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.responseDeclaration
 */
export interface ResponseDeclaration {
  /**
   * Unique identifier for the response
   * @qti required
   */
  identifier: string;

  /**
   * The cardinality of the response
   * @qti required
   */
  cardinality: Cardinality;

  /**
   * The base type of the response
   * @qti required
   */
  baseType: BaseType;

  /**
   * The correct response values
   * @qti optional
   */
  correctResponse?: {
    /**
     * The interpretation of the value(s) depends on the baseType
     */
    value: string[];
    /**
     * The interpretation method for the values
     * @qti optional
     */
    interpretation?: string;
  };

  /**
   * The mapping of response values to scores
   * @qti optional
   */
  mapping?: {
    /**
     * Default value when no explicit mapping matches
     * @qti optional
     */
    defaultValue?: number;

    /**
     * Lower bound for mapped values
     * @qti optional
     */
    lowerBound?: number;

    /**
     * Upper bound for mapped values
     * @qti optional
     */
    upperBound?: number;

    /**
     * Mapping entries defining the score for each response
     * @qti required when mapping is used
     */
    mapEntries: Array<{
      /**
       * The response value to match
       * @qti required
       */
      mapKey: string;

      /**
       * The score to assign when matched
       * @qti required
       */
      mappedValue: number;

      /**
       * Whether case sensitivity should be considered
       * @qti optional
       */
      caseSensitive?: boolean;
    }>;
  };

  /**
   * Default value if no response is provided
   * @qti optional
   */
  defaultValue?: {
    /**
     * The interpretation of the value depends on the baseType
     */
    value: string[];
    /**
     * The interpretation method for the values
     * @qti optional
     */
    interpretation?: string;
  };

  /**
   * Template used for response processing
   * @qti optional
   * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.templateIdentifier
   */
  templateIdentifier?: string;

  /**
   * Whether the response should be included in response processing
   * @qti optional
   */
  choiceSequence?: boolean;
}

/**
 * Interaction types currently supported
 * @qti These are the interaction types we've implemented
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.interactions
 */
export type InteractionType =
  | 'choiceInteraction'
  | 'orderInteraction'
  | 'associateInteraction'
  | 'matchInteraction'
  | 'gapMatchInteraction'
  | 'inlineChoiceInteraction'
  | 'textEntryInteraction'
  | 'extendedTextInteraction'
  | 'hotTextInteraction'
  | 'hotspotInteraction'
  | 'selectPointInteraction'
  | 'graphicOrderInteraction'
  | 'graphicAssociateInteraction'
  | 'graphicGapMatchInteraction'
  | 'positionObjectInteraction'
  | 'sliderInteraction'
  | 'drawingInteraction'
  | 'uploadInteraction'
  | 'customInteraction'
  | 'endAttemptInteraction';

/**
 * Feedback configuration for interactions
 * @qti Defines feedback shown to candidates
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.feedbackElement
 */
export interface InteractionFeedback {
  /**
   * Feedback shown when the response is correct
   * @qti required when feedback is used
   */
  correct: string;

  /**
   * Feedback shown when the response is incorrect
   * @qti required when feedback is used
   */
  incorrect: string;

  /**
   * Identifier of the outcome variable that controls this feedback
   * @qti required
   */
  outcomeIdentifier: string;

  /**
   * Whether to show or hide the feedback
   * @qti required
   */
  showHide: ShowHide;

  /**
   * Template identifier for feedback processing
   * @qti optional
   */
  templateIdentifier?: string;

  /**
   * Conditions for showing feedback
   * @qti optional
   */
  showHideCondition?: string;
}

/**
 * Modal feedback configuration
 * @qti Defines modal feedback shown to candidates
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.modalFeedback
 */
export interface ModalFeedback {
  /**
   * Unique identifier for the feedback
   * @qti required
   */
  identifier: string;

  /**
   * Title of the feedback
   * @qti optional
   */
  title?: string;

  /**
   * Outcome variable that controls showing this feedback
   * @qti required
   */
  outcomeIdentifier: string;

  /**
   * Whether to show or hide based on the outcome
   * @qti required
   */
  showHide: ShowHide;

  /**
   * The feedback content
   * @qti required
   */
  content: string;
}

/**
 * Base interface for all QTI 3.0 interactions
 * @qti Common properties for all interaction types
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.interactions
 */
export interface BaseInteraction {
  /**
   * The type of interaction
   * @qti Required. Identifies the specific interaction type
   */
  type: InteractionType;

  /**
   * A unique identifier for the interaction
   * @qti Required. Must be unique within the scope of its containing assessmentItem
   */
  responseIdentifier: string;

  /**
   * Whether a response is required
   * @qti optional
   */
  required?: boolean;

  /**
   * The prompt or question text shown to the candidate
   * @qti optional. HTML content that provides instructions or context
   */
  prompt?: string;

  /**
   * The base type of the response
   * @qti Required for some interaction types
   */
  baseType?: BaseType;

  /**
   * The cardinality of the response
   * @qti Required for some interaction types
   */
  cardinality?: Cardinality;

  /**
   * Optional feedback to show based on the response
   * @qti optional
   */
  feedback?: InteractionFeedback;

  /**
   * Response processing template to use
   * @qti optional
   * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.templateIdentifier
   */
  responseProcessing?: {
    template: string;
  };

  /**
   * Class name for styling
   * @qti optional
   */
  class?: string;

  /**
   * Language code for the interaction
   * @qti optional
   */
  lang?: string;

  /**
   * Label for the interaction
   * @qti optional
   */
  label?: string;

  /**
   * Whether the interaction is printable
   * @qti optional
   */
  printable?: boolean;

  /**
   * Whether the interaction is searchable
   * @qti optional
   */
  searchable?: boolean;

  /**
   * XML base URI for resolving relative URIs
   * @qti optional
   */
  xmlBase?: string;

  /**
   * XML language for the interaction
   * @qti optional
   */
  xmlLang?: string;
}

/**
 * Area mapping for graphical interactions
 * @qti Maps areas to scores in graphical interactions
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.areaMapping
 */
export interface AreaMapping {
  /**
   * Default value when no explicit mapping matches
   * @qti optional
   */
  defaultValue?: number;

  /**
   * Lower bound for mapped values
   * @qti optional
   */
  lowerBound?: number;

  /**
   * Upper bound for mapped values
   * @qti optional
   */
  upperBound?: number;

  /**
   * Area mapping entries
   * @qti required when areaMapping is used
   */
  areaMapEntries: Array<{
    /**
     * Shape of the area
     * @qti required
     */
    shape: 'circle' | 'rect' | 'poly';

    /**
     * Coordinates defining the area
     * @qti required
     */
    coords: string;

    /**
     * Score when this area is matched
     * @qti required
     */
    mappedValue: number;
  }>;
}

/**
 * Time limits for test parts, sections, or items
 * @qti Defines time constraints
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.timeLimits
 */
export interface TimeLimits {
  /**
   * Minimum time allowed (in seconds)
   * @qti optional
   */
  minTime?: number;

  /**
   * Maximum time allowed (in seconds)
   * @qti optional
   */
  maxTime?: number;

  /**
   * Whether to allow late submission
   * @qti optional
   */
  allowLateSubmission?: boolean;
}

/**
 * Pre-condition for test navigation
 * @qti Defines conditions that must be met before proceeding
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.preCondition
 */
export interface PreCondition {
  /**
   * The expression to evaluate
   * @qti required
   */
  expression: string;
}

/**
 * Branch rule for test navigation
 * @qti Defines conditional branching in test flow
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.branchRule
 */
export interface BranchRule {
  /**
   * The expression to evaluate
   * @qti required
   */
  expression: string;

  /**
   * Target identifier to branch to
   * @qti required
   */
  target: string;
}
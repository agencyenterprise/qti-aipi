import { BaseInteraction } from './interactions/base-interaction';

/**
 * Content block types in itemBody
 * @qti Defines the types of content blocks allowed in itemBody
 */
export type ContentBlockType = 
  | 'html'           // Regular HTML content
  | 'feedbackBlock'  // Feedback to show based on outcomes
  | 'templateBlock'  // Content generated from templates
  | 'rubricBlock'    // Rubric information
  | 'mathBlock'      // Mathematical content
  | 'figureBlock'    // Figure with caption
  | 'tableBlock';    // Table with caption

/**
 * Base interface for all content blocks
 * @qti Common properties for content blocks
 */
export interface BaseContentBlock {
  /**
   * The type of content block
   * @qti required
   */
  type: ContentBlockType;

  /**
   * CSS class name(s) for styling
   * @qti optional
   */
  class?: string;

  /**
   * Language code for the content
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
 * HTML content block
 * @qti Regular HTML content
 */
export interface HTMLBlock extends BaseContentBlock {
  type: 'html';
  content: string;
}

/**
 * Feedback block configuration
 * @qti Defines feedback shown to candidates
 */
export interface FeedbackBlock extends BaseContentBlock {
  type: 'feedbackBlock';
  content: {
    /**
     * Unique identifier for the feedback
     * @qti required
     */
    identifier: string;

    /**
     * Outcome variable that controls showing this feedback
     * @qti required
     */
    outcomeIdentifier: string;

    /**
     * Whether to show or hide based on the outcome
     * @qti required
     */
    showHide: 'show' | 'hide';

    /**
     * The feedback content
     * @qti required
     */
    content: string;
  };
}

/**
 * Template block configuration
 * @qti Defines template-driven content
 */
export interface TemplateBlock extends BaseContentBlock {
  type: 'templateBlock';
  content: {
    /**
     * Unique identifier for the template
     * @qti required
     */
    identifier: string;

    /**
     * Template markup with variables
     * @qti required
     */
    markup: string;

    /**
     * Variables used in the template
     * @qti optional
     */
    variables?: Record<string, string>;
  };
}

/**
 * Rubric block configuration
 * @qti Defines rubric information
 */
export interface RubricBlock extends BaseContentBlock {
  type: 'rubricBlock';
  content: {
    /**
     * Unique identifier for the rubric
     * @qti required
     */
    identifier: string;

    /**
     * The view(s) this rubric is for
     * @qti required
     */
    view: ('author' | 'candidate' | 'proctor' | 'scorer' | 'testConstructor' | 'tutor')[];

    /**
     * The rubric content
     * @qti required
     */
    content: string;
  };
}

/**
 * Math block configuration
 * @qti Defines mathematical content
 */
export interface MathBlock extends BaseContentBlock {
  type: 'mathBlock';
  content: {
    /**
     * The math markup (e.g. MathML)
     * @qti required
     */
    markup: string;

    /**
     * The notation used
     * @qti optional
     */
    notation?: string;
  };
}

/**
 * Figure block configuration
 * @qti Defines a figure with caption
 */
export interface FigureBlock extends BaseContentBlock {
  type: 'figureBlock';
  content: {
    /**
     * The image source
     * @qti required
     */
    src: string;

    /**
     * The figure caption
     * @qti optional
     */
    caption?: string;

    /**
     * Alternative text
     * @qti optional
     */
    alt?: string;
  };
}

/**
 * Table block configuration
 * @qti Defines a table with caption
 */
export interface TableBlock extends BaseContentBlock {
  type: 'tableBlock';
  content: {
    /**
     * The table data
     * @qti required
     */
    data: string[][];

    /**
     * The table caption
     * @qti optional
     */
    caption?: string;

    /**
     * Table summary for accessibility
     * @qti optional
     */
    summary?: string;
  };
}

/**
 * Union type for all content block types
 */
export type ContentBlock = 
  | HTMLBlock 
  | FeedbackBlock 
  | TemplateBlock 
  | RubricBlock 
  | MathBlock 
  | FigureBlock 
  | TableBlock;

/**
 * Represents a QTI 3.0 itemBody
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.3rdcrjn
 */
export interface ItemBody {
  /**
   * Unique identifier for the itemBody
   * @qti Required. Must be unique within the containing assessmentItem
   */
  identifier: string;

  /**
   * Optional class attribute for styling
   * @qti optional
   */
  class?: string;

  /**
   * Optional language code
   * @qti optional
   */
  lang?: string;

  /**
   * Optional label for the itemBody
   * @qti optional
   */
  label?: string;

  /**
   * Optional text direction
   * @qti optional. Controls the base directionality of the text. Values: 'ltr' (left-to-right), 'rtl' (right-to-left), or 'auto'
   */
  dir?: 'ltr' | 'rtl' | 'auto';

  /**
   * Array of content blocks
   * @qti optional. Can contain HTML content, rubric blocks, template blocks, and feedback blocks
   */
  content: ContentBlock[];

  /**
   * Array of interactions
   * @qti optional. The interactions contained within this itemBody
   */
  interactions: BaseInteraction[];

  /**
   * Whether the content is printable
   * @qti optional
   */
  printable?: boolean;

  /**
   * Whether the content is searchable
   * @qti optional
   */
  searchable?: boolean;

  /**
   * XML base URI for resolving relative URIs
   * @qti optional
   */
  xmlBase?: string;
} 
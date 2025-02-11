import type { CommonAttributes, TimeLimits, PreCondition, BranchRule } from './qti-types';
import type { AssessmentItem } from './assessment-item';

/**
 * Item session control for test parts and sections
 * @qti Controls how candidates interact with items
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.itemSessionControl
 */
export interface ItemSessionControl {
  /**
   * Maximum number of attempts allowed
   * @qti optional
   */
  maxAttempts?: number;

  /**
   * Whether to show feedback during attempts
   * @qti optional
   */
  showFeedback?: boolean;

  /**
   * Whether to allow review of responses
   * @qti optional
   */
  allowReview?: boolean;

  /**
   * Whether to show solution during review
   * @qti optional
   */
  showSolution?: boolean;

  /**
   * Whether responses can be validated
   * @qti optional
   */
  validateResponses?: boolean;
}

/**
 * Test part in an assessment test
 * @qti A major division of a test
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.testPart
 */
export interface TestPart extends CommonAttributes {
  /**
   * Navigation mode for this part
   * @qti required
   */
  navigationMode: 'linear' | 'nonlinear';

  /**
   * Submission mode for this part
   * @qti required
   */
  submissionMode: 'individual' | 'simultaneous';

  /**
   * Pre-conditions for attempting this part
   * @qti optional
   */
  preConditions?: PreCondition[];

  /**
   * Branch rules for this part
   * @qti optional
   */
  branchRules?: BranchRule[];

  /**
   * Item session control settings
   * @qti optional
   */
  itemSessionControl?: ItemSessionControl;

  /**
   * Time limits for this part
   * @qti optional
   */
  timeLimits?: TimeLimits;

  /**
   * Sections in this part
   * @qti required
   */
  sections: Section[];
}

/**
 * QTI 3.0 Section
 * @qti A section groups together items in a test
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.section
 */
export interface Section extends CommonAttributes {
  /**
   * Whether items can be skipped
   * @qti optional
   */
  required?: boolean;

  /**
   * Whether items can be reviewed
   * @qti optional
   */
  allowReview?: boolean;

  /**
   * Whether items can be viewed before starting
   * @qti optional
   */
  allowPreview?: boolean;

  /**
   * Pre-conditions for attempting this section
   * @qti optional
   */
  preConditions?: PreCondition[];

  /**
   * Branch rules for this section
   * @qti optional
   */
  branchRules?: BranchRule[];

  /**
   * Item session control settings
   * @qti optional
   */
  itemSessionControl?: ItemSessionControl;

  /**
   * Time limits for this section
   * @qti optional
   */
  timeLimits?: TimeLimits;

  /**
   * The items in this section
   * @qti required
   */
  items: AssessmentItem[];
}

/**
 * QTI 3.0 Assessment Test
 * @qti The root element for a QTI assessment test
 * @see https://www.imsglobal.org/spec/qti/v3p0/impl#h.assessmentTest
 */
export interface AssessmentTest extends CommonAttributes {
  /**
   * The test parts in this test
   * @qti required
   */
  testParts: TestPart[];

  /**
   * Tool name that created this test
   * @qti optional
   */
  toolName?: string;

  /**
   * Tool version that created this test
   * @qti optional
   */
  toolVersion?: string;

  /**
   * Time limits for the entire test
   * @qti optional
   */
  timeLimits?: TimeLimits;

  /**
   * Item session control defaults
   * @qti optional
   */
  itemSessionControl?: ItemSessionControl;
} 
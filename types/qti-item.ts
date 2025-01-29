/** MongoDB ObjectId type */
export type ObjectId = { $oid: string };

/** MongoDB ISODate type */
export type ISODate = { $date: string };

/** QTI value type with base type information */
export type QtiValue = {
  _: string;
  "base-type": string;
};

/**
 * QTI Response Declaration
 * Defines how a candidate's response should be captured during the test
 */
export type QtiResponseDeclaration = {
  identifier: string;
  cardinality: "single" | "multiple" | "ordered";
  "base-type": string;
  "qti-correct-response"?: { "qti-value": string | string[] };
  "qti-mapping"?: {
    "default-value"?: string;
    "lower-bound"?: string;
    "upper-bound"?: string;
    "qti-map-entry"?: { "map-key": string; "mapped-value": string }[];
  };
};

/**
 * QTI Outcome Declaration
 * Defines variables to store the outcomes of response processing
 */
export type QtiOutcomeDeclaration = {
  identifier: string;
  cardinality: "single" | "multiple" | "ordered";
  "base-type": string;
  "normal-maximum"?: string;
  "normal-minimum"?: string;
  "qti-default-value"?: { "qti-value": string | string[] };
};

/**
 * QTI Template Declaration
 * Defines variables used in template processing
 */
export type QtiTemplateDeclaration = {
  identifier: string;
  cardinality: "single" | "multiple";
  "base-type": string;
  "param-variable"?: string;
  "math-variable"?: string;
};

/**
 * QTI Template Processing
 * Defines how template variables are processed before item presentation
 */
export type QtiTemplateProcessing = {
  "qti-set-template-value": {
    identifier: string;
    "qti-random-integer"?: { min: string; max: string };
    "qti-divide"?: Record<string, unknown>;
    "qti-round"?: Record<string, unknown>;
  }[];
};

/**
 * QTI Feedback Inline
 * Defines inline feedback to be shown based on response processing
 */
export type QtiFeedbackInline = {
  _: string;
  id: string;
  "show-hide": string;
  "outcome-identifier": string;
  identifier: string;
};

/**
 * QTI Interaction
 * Base type for all interaction types (choice, text, etc.)
 */
export type QtiInteraction = {
  "response-identifier": string;
  "expected-length"?: string;
  "expected-lines"?: string;
  "shuffle"?: string;
  "max-choices"?: string;
  "qti-inline-choice"?: { _: string; identifier: string }[];
  "qti-prompt"?: string;
  "qti-simple-choice"?: { _: string; identifier: string }[];
};

/**
 * QTI Item Body
 * Contains the actual content of the item including text and interactions
 */
export type QtiItemBody = {
  p?: string | { _: string; "qti-printed-variable"?: { identifier: string }[] }[];
  div?: { class: string; "qti-text-entry-interaction"?: QtiInteraction[]; "qti-feedback-inline"?: QtiFeedbackInline }[];
  blockquote?: { p: string | string[] };
  "qti-choice-interaction"?: QtiInteraction;
  "qti-extended-text-interaction"?: QtiInteraction;
  "qti-match-interaction"?: QtiInteraction;
  "qti-associate-interaction"?: QtiInteraction;
  "qti-select-point-interaction"?: {
    "response-identifier": string;
    "max-choices": string;
    "qti-prompt": string;
    object: { _: string; type: string; width: string; height: string; data: string };
  };
};

/**
 * QTI Response Processing
 * Defines how responses are processed to produce outcomes
 */
export type QtiResponseProcessing = {
  "qti-response-condition": {
    "qti-response-if"?: Record<string, unknown>;
    "qti-response-else"?: Record<string, unknown>;
    "qti-response-else-if"?: Record<string, unknown>;
  };
};

/**
 * QTI Item Content
 * The complete content of a QTI item including all declarations and processing rules
 */
export type QtiItemContent = {
  xmlns?: string;
  "xmlns:xsi"?: string;
  "xsi:schemaLocation"?: string;
  identifier: string;
  title: string;
  adaptive: string;
  "time-dependent": string;
  "qti-response-declaration": QtiResponseDeclaration | QtiResponseDeclaration[];
  "qti-outcome-declaration": QtiOutcomeDeclaration | QtiOutcomeDeclaration[];
  "qti-template-declaration"?: QtiTemplateDeclaration[];
  "qti-template-processing"?: QtiTemplateProcessing;
  "qti-item-body": QtiItemBody;
  "qti-response-processing"?: QtiResponseProcessing;
};

/**
 * QTI Item
 * The complete QTI item including metadata and content
 */
export type QtiItem = {
  _id: ObjectId;
  identifier: string;
  title: string;
  type: "qti-assessment-item";
  content: QtiItemContent;
  createdAt: ISODate;
  updatedAt: ISODate;
};
```typescript
export interface QTIAssessmentTest {
  identifier: string;
  title: string;
  toolVersion?: string;
  toolName?: string;
  "qti-test-part": QTITestPart[];
  "qti-outcome-declaration"?: QTIOutcomeDeclaration[];
}

export interface QTITestPart {
  identifier: string;
  "qti-assessment-section": QTISection[];
  submissionMode: "individual" | "simultaneous";
  navigationMode: "linear" | "nonlinear";
}

export interface QTISection {
  identifier: string;
  title: string;
  visible: boolean;
  // Optional attributes from QTI 3.0 spec
  required?: boolean;
  fixed?: boolean;
  class?: string[];
  "keep-together"?: boolean;
  sequence?: number;
  "qti-assessment-item-ref"?: QTIItemRef[];
}

export interface QTIItemRef {
  identifier: string;
  href: string;
  required?: boolean;
  fixed?: boolean;
  class?: string[];
  category?: string[];
}

export interface QTIAssessmentItem {
  identifier: string;
  title: string;
  adaptive: boolean;
  timeDependent: boolean;
  responses: QTIResponseDeclaration[];
  outcomes: QTIOutcomeDeclaration[];
  itemBody: QTIItemBody;
}

export interface QTIResponseDeclaration {
  identifier: string;
  cardinality: "single" | "multiple" | "ordered";
  baseType: string;
  correctResponse?: any;
}

export interface QTIOutcomeDeclaration {
  identifier: string;
  cardinality: string;
  baseType: string;
  normalMaximum?: number;
  normalMinimum?: number;
  defaultValue?: {
    value: string | number;
  };
}

export interface QTIItemBody {
  elements: QTIElement[];
}

export interface QTIElement {
  type: "text" | "interaction" | "math" | "feedback";
  content: string;
  identifier?: string;
  responseIdentifier?: string;
}

/**
 * Valid QTI 3.0 interaction types
 */
export type QTIInteractionType =
  | "choice"
  | "text-entry"
  | "extended-text"
  | "inline-choice"
  | "match"
  | "order"
  | "associate"
  | "select-point"
  | "graphic-order"
  | "graphic-associate"
  | "graphic-gap-match"
  | "hotspot"
  | "slider"
  | "drawing"
  | "media"
  | "custom"
  | "upload";

/**
 * Interface for QTI object attributes
 */
export interface QTIObjectAttributes {
  data: string;
  height: number;
  width: number;
  type: string;
  mediaType: string; // added for drawing interaction - might need to make optional
}

/**
 * Interface for interaction-specific data
 */
export interface QTIInteraction {
  type: QTIInteractionType;
  responseIdentifier: string;
  attributes?: Record<string, string | number | boolean>;
  questionStructure?: {
    prompt?: string;
    object?: QTIObjectAttributes;
    [key: string]: any;
  };
  shuffle?: boolean;
  maxChoices?: number;
  minChoices?: number;
  maxAssociations?: number;
  // Slider-specific properties
  "lower-bound"?: number;
  "upper-bound"?: number;
  step?: number;
  orientation?: "horizontal" | "vertical";
  // Media-specific properties
  minPlays?: number;
  maxPlays?: number;
  autostart?: boolean;
  loop?: boolean;
}

export interface QTIAssessmentItem {
  identifier: string;
  title: string;
  type: string;
  content: any;
  rawXml: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Curriculum {
  identifier: string;
  title: string;
  subject: string;
  gradeLevel: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type for creating a new curriculum
export interface CreateCurriculumInput {
  identifier: string;
  title: string;
  subject: string;
  gradeLevel: string;
  description?: string;
  metadata?: Record<string, any>;
}

// Type for updating an existing curriculum
export interface UpdateCurriculumInput {
  title?: string;
  subject?: string;
  gradeLevel?: string;
  description?: string;
  metadata?: Record<string, any>;
}

// Curriculum Assessment Test relationship
export interface CurriculumAssessmentTest {
  curriculumId: string;
  assessmentTestId: string;
  sequence: number;
  required: boolean;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type for creating a new curriculum-assessment test relationship
export interface CreateCurriculumAssessmentTestInput {
  curriculumId: string;
  assessmentTestId: string;
  sequence: number;
  required?: boolean;
  metadata?: Record<string, any>;
}

// Type for updating an existing curriculum-assessment test relationship
export interface UpdateCurriculumAssessmentTestInput {
  sequence?: number;
  required?: boolean;
  metadata?: Record<string, any>;
}
```

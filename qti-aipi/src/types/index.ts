// Base types for QTI attributes
export type BaseType = 'identifier' | 'boolean' | 'integer' | 'float' | 'string' | 'point' | 'pair' | 'directedPair' | 'duration' | 'file' | 'uri';
export type Cardinality = 'single' | 'multiple' | 'ordered' | 'record';
export type Navigation = 'linear' | 'nonlinear';
export type Submission = 'individual' | 'simultaneous';
export type Visibility = 'true' | 'false';
export type ShowHide = 'show' | 'hide';
export type Shape = 'circle' | 'rect' | 'poly' | 'default';
export type Orientation = 'horizontal' | 'vertical';

// Common attributes interface
export interface CommonAttributes {
  identifier: string;
  title?: string;
  label?: string;
  timeDependent?: boolean;
  lang?: string;
  base?: string;
}

export interface QTIAssessmentTest extends CommonAttributes {
  toolName?: string;
  toolVersion?: string;
  navigationMode?: 'linear' | 'nonlinear';
  submissionMode?: 'individual' | 'simultaneous';
  testParts?: QTITestPart[];
  adaptive?: boolean;
  preConditions?: string[];
  timeLimits?: TimeLimits;
  outcomeDeclaration?: {
    identifier: string;
    cardinality: 'single' | 'multiple' | 'ordered';
    baseType: 'float' | 'integer' | 'string' | 'identifier';
    defaultValue?: string | number;
  };
  questions: QTIQuestion[];
}

export interface QTITestPart extends CommonAttributes {
  navigationMode: 'linear' | 'nonlinear';
  submissionMode: 'individual' | 'simultaneous';
  sections: QTISection[];
  preConditions?: string[];
  branchRules?: string[];
  itemSessionControl?: ItemSessionControl;
  timeLimits?: TimeLimits;
}

export interface QTISection extends CommonAttributes {
  visible: 'true' | 'false';
  sections?: QTISection[];
  items?: QTIAssessmentItem[];
  selection?: number;
  ordering?: 'random' | 'sequential';
  preConditions?: string[];
  branchRules?: string[];
  itemSessionControl?: ItemSessionControl;
  timeLimits?: TimeLimits;
}

export interface ItemSessionControl {
  maxAttempts?: number;
  showFeedback?: boolean;
  allowReview?: boolean;
  showSolution?: boolean;
  allowComment?: boolean;
  allowSkipping?: boolean;
  validateResponses?: boolean;
}

export interface TimeLimits {
  minTime?: number;
  maxTime?: number;
  allowLateSubmission?: boolean;
}

export interface TemplateDefault {
  identifier: string;
  value: string | number | boolean;
}

export interface QTIAssessmentItem extends CommonAttributes {
  adaptive?: boolean;
  timeDependent?: boolean;
  questions: QTIQuestion[];
  preConditions?: string[];
  templateDefaults?: Record<string, TemplateDefault>;
  responseProcessing?: string;
  stylesheets?: QTIStylesheet[];
}

export interface QTIStylesheet {
  href: string;
  type: string;
  media?: string;
  title?: string;
}

export interface QTIQuestion {
  identifier: string;
  type: QuestionType;
  prompt: string;
  responseIdentifier?: string;
  required?: boolean;
  fixed?: boolean;
  preConditions?: string[];
  templateDefaults?: Record<string, TemplateDefault>;

  // Text entry specific attributes
  baseType?: 'string' | 'integer' | 'float';
  pattern?: string;
  format?: 'plain' | 'preformatted' | 'xhtml' | 'rtf';
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  caseSensitive?: boolean;

  // Extended text specific attributes
  expectedLength?: number;
  minStrings?: number;
  maxStrings?: number;
  rubricBlock?: string;

  // Choice-based interactions
  choices?: QTIChoice[];
  shuffle?: boolean;
  maxChoices?: number;
  minChoices?: number;

  // Order interaction
  orderItems?: string[];
  orientation?: Orientation;

  // Match interaction
  matchItems?: {
    source: QTIChoice[];
    target: QTIChoice[];
  };
  maxAssociations?: number;
  minAssociations?: number;

  // Inline choice
  inlineChoices?: QTIChoice[];

  // Gap match
  gaps?: string[];
  gapTexts?: QTIChoice[];

  // Hotspot and graphic gap match
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  hotspots?: QTIHotspot[];
  backgroundColor?: string;

  // Slider
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    orientation: Orientation;
    reverse?: boolean;
    stepLabel?: boolean;
  };

  // Drawing
  drawingConfig?: {
    width: number;
    height: number;
    tools: DrawingTool[];
    background?: string;
    grid?: boolean;
    gridSize?: number;
  };

  // Response processing
  correctResponse: string[];
  mapping?: ResponseMapping;
  areaMapping?: AreaMapping;
  feedback: {
    correct: string;
    incorrect: string;
  };
}

export interface QTIChoice {
  identifier: string;
  value: string;
  fixed?: boolean;
  templateIdentifier?: string;
  showHide?: ShowHide;
  matchMax?: number;
  matchMin?: number;
}

export interface QTIHotspot {
  identifier: string;
  shape: Shape;
  coords: string;
  value?: string;
  hotspotLabel?: string;
  fixed?: boolean;
  templateIdentifier?: string;
  showHide?: ShowHide;
  matchMax?: number;
  matchMin?: number;
}

export interface ResponseMapping {
  lowerBound?: number;
  upperBound?: number;
  defaultValue?: number;
  mappingEntries: {
    mapKey: string;
    mappedValue: number;
    caseSensitive?: boolean;
  }[];
}

export interface AreaMapping {
  lowerBound?: number;
  upperBound?: number;
  defaultValue?: number;
  areaMapEntries: {
    shape: Shape;
    coords: string;
    mappedValue: number;
  }[];
}

export type QuestionType =
  | 'choiceInteraction'
  | 'textEntryInteraction'
  | 'extendedTextInteraction'
  | 'orderInteraction'
  | 'matchInteraction'
  | 'inlineChoiceInteraction'
  | 'uploadInteraction'
  | 'gapMatchInteraction'
  | 'hotspotInteraction'
  | 'graphicGapMatchInteraction'
  | 'sliderInteraction'
  | 'drawingInteraction';

export type DrawingTool = 'pen' | 'eraser' | 'shapes';

export interface QTIFeedback {
  identifier: string;
  content: string;
  showHide: 'show' | 'hide';
  outcomeIdentifier: string;
}
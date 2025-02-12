export type QTIInteractionType =
  | 'choice'
  | 'text-entry'
  | 'extended-text'
  | 'inline-choice'
  | 'match'
  | 'order'
  | 'associate'
  | 'select-point'
  | 'graphic-order'
  | 'graphic-associate'
  | 'graphic-gap-match'
  | 'hotspot'
  | 'slider'
  | 'drawing'
  | 'media'
  | 'custom'
  | 'upload';

export interface QTIInteraction {
  type: QTIInteractionType;
  prompt: string;
  responseIdentifier: string;
  questionStructure: {
    prompt: string;
    choices?: Array<{
      identifier: string;
      content: string;
      text: string;
    }>;
  };
  shuffle?: boolean;
  maxChoices?: number;
  minChoices?: number;
  maxAssociations?: number;
  // Slider-specific properties
  'lower-bound'?: number;
  'upper-bound'?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
  // Media-specific properties
  minPlays?: number;
  maxPlays?: number;
  autostart?: boolean;
  loop?: boolean;
}

export interface QTIResponseDeclaration {
  identifier: string;
  cardinality: 'single' | 'multiple' | 'ordered';
  baseType: 'identifier' | 'string' | 'integer' | 'float' | 'point' | 'pair' | 'directedPair' | 'duration' | 'file' | 'uri';
  correctResponse?: {
    value: string[];
  };
  mapping?: {
    [key: string]: number;
  };
}

export interface QTIAssessmentItem {
  identifier: string;
  title: string;
  type: QTIInteractionType;
  interaction: QTIInteraction;
  responseDeclaration: QTIResponseDeclaration;
  metadata?: Record<string, any>;
  rawXml: string;
  content: Record<string, any>;
}

export interface QTISection {
  identifier: string;
  title: string;
  visible: boolean;
  required?: boolean;
  fixed?: boolean;
  'keep-together'?: boolean;
  'qti-assessment-item-ref'?: Array<{
    identifier: string;
    href: string;
  }>;
}

export interface QTIAssessmentTest {
  identifier: string;
  title: string;
  'qti-test-part': Array<{
    identifier: string;
    navigationMode: 'linear' | 'nonlinear';
    submissionMode: 'individual' | 'simultaneous';
    'qti-assessment-section': QTISection[];
  }>;
}

export interface QTICurriculum {
  identifier: string;
  title: string;
  subject: string;
  gradeLevel: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
} 
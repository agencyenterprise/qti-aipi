// assessment-test.ts
import { Navigation, Submission } from './base-types';
import { CommonAttributes } from './common-attributes';
import { TimeLimits } from './time-limits';
import { QTITestPart } from './test-part';
import { QTIQuestion } from './question';
import { Question } from './question';

export interface QTIAssessmentTest extends CommonAttributes {
  toolName?: string;
  toolVersion?: string;
  navigationMode?: Navigation;
  submissionMode?: Submission;
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

export interface AssessmentTest {
  identifier: string;
  title: string;
  toolName?: string;
  toolVersion?: string;
  testParts: TestPart[];
  outcomeProcessing?: OutcomeProcessing;
  testFeedback?: TestFeedback[];
  metadata?: AssessmentMetadata;
}

export interface AssessmentSection {
  identifier: string;
  title: string;
  visible: boolean;
  navigationMode?: Navigation;
  submissionMode?: 'individual' | 'simultaneous';
  items: Question[];
  preConditions?: string[];
  branchRules?: string[];
  itemSessionControl?: {
    maxAttempts?: number;
    showFeedback?: boolean;
    allowReview?: boolean;
    showSolution?: boolean;
  };
  selection?: {
    select: number;
    withReplacement: boolean;
  };
  ordering?: {
    shuffle: boolean;
  };
}

export interface OutcomeProcessing {
  cutScore?: number;
  outcomeRules: OutcomeRule[];
}

export interface OutcomeRule {
  condition: string;
  outcomeValue: string;
  action: 'set' | 'add' | 'subtract' | 'multiply' | 'divide';
}

export interface TestFeedback {
  identifier: string;
  title?: string;
  content: string;
  showCondition: 'always' | 'onPass' | 'onFail';
  access: 'during' | 'atEnd';
}

export interface AssessmentMetadata {
  subject?: string;
  gradeLevel?: string;
  educationalObjective?: string;
  keywords: string[];
  author?: string;
  organization?: string;
  dateCreated: string;
  dateModified: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
  license?: string;
  timeLimit?: number;
  passingScore?: number;
  maxAttempts?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedDuration?: number;
  prerequisites?: string[];
  adaptiveAssessment?: boolean;
  randomization?: {
    sectionOrder?: boolean;
    questionOrder?: boolean;
    answerOrder?: boolean;
  };
  accessibility?: {
    textToSpeech?: boolean;
    highContrast?: boolean;
    fontSize?: 'normal' | 'large' | 'extraLarge';
    colorBlindSupport?: boolean;
  };
}

export interface QTIMetadata {
  itemTemplate?: boolean;
  timeDependent?: boolean;
  composite?: boolean;
  interactionType?: string;
  feedbackType?: string;
  solutionAvailable?: boolean;
  scoringMode?: string;
  toolName?: string;
  toolVersion?: string;
  toolVendor?: string;
}

export interface TestPart {
  identifier: string;
  navigationMode: 'linear' | 'nonlinear';
  submissionMode: 'individual' | 'simultaneous';
  preConditions?: string[];
  branchRules?: string[];
  itemSessionControl?: {
    maxAttempts?: number;
    showFeedback?: boolean;
    allowReview?: boolean;
    showSolution?: boolean;
    allowComment?: boolean;
    allowSkipping?: boolean;
    validateResponses?: boolean;
  };
  timeLimits?: {
    minTime?: number;
    maxTime?: number;
    allowLateSubmission?: boolean;
  };
  assessmentSections: AssessmentSection[];
}

export interface AssessmentSection {
  id: string;
  title: string;
  visible?: boolean;
  required?: boolean;
  fixed?: boolean;
  items: string[];
  preConditions?: string[];
  branchRules?: string[];
  itemSessionControl?: TestPart['itemSessionControl'];
  timeLimits?: TestPart['timeLimits'];
}

export interface AssessmentTest {
  id: string;
  title: string;
  qtiVersion: string;
  testParts: TestPart[];
  outcomeDeclarations: Array<{
    identifier: string;
    cardinality: 'single' | 'multiple' | 'ordered' | 'record';
    baseType: string;
    defaultValue?: any;
  }>;
  metadata: QTIMetadata;
}

export interface AssessmentItem {
  id: string;
  title: string;
  qtiVersion: string;
  itemBody: {
    elements: any[];
    interactions: Array<{
      type: string;
      prompt: string;
      [key: string]: any;
    }>;
  };
  responseDeclarations: Array<{
    identifier: string;
    cardinality: 'single' | 'multiple' | 'ordered' | 'record';
    baseType: string;
    correctResponse?: any;
  }>;
  outcomeDeclarations: Array<{
    identifier: string;
    cardinality: 'single' | 'multiple' | 'ordered' | 'record';
    baseType: string;
    defaultValue?: any;
  }>;
  templateDeclarations: any[];
  metadata: QTIMetadata;
} 
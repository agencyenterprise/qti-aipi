// test-part.ts
import { Navigation } from './base-types';
import { AssessmentSection } from './assessment-test';

export interface TestPart {
  identifier: string;
  title?: string;
  navigationMode: Navigation;
  submissionMode: 'individual' | 'simultaneous';
  assessmentSections?: AssessmentSection[];
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
  testFeedback?: {
    showAtEnd?: boolean;
    feedbackContent?: string;
  };
}

export interface TestPartMetadata {
  difficulty: 'easy' | 'medium' | 'hard';
  keywords: string[];
  subject?: string;
  gradeLevel?: string;
  author?: string;
  lastModified?: string;
  version?: string;
  status: 'draft' | 'published' | 'archived';
}

export interface TestPartStatistics {
  totalQuestions: number;
  totalPoints: number;
  estimatedDuration: number;
  averageScore?: number;
  completionRate?: number;
  difficultyIndex?: number;
  discriminationIndex?: number;
  reliabilityCoefficient?: number;
}

export interface TestPartValidation {
  minSections?: number;
  maxSections?: number;
  requiredSectionTypes?: string[];
  balancedContent?: boolean;
  difficultyDistribution?: {
    easy: number;
    medium: number;
    hard: number;
  };
}


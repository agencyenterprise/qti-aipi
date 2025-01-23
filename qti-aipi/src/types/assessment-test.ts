// assessment-test.ts
import { Navigation, Submission } from './base-types';
import { CommonAttributes } from './common-attributes';
import { TimeLimits } from './time-limits';
import { QTITestPart } from './test-part';
import { QTIQuestion } from './question';

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

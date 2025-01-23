
// test-part.ts
import { Navigation, Submission } from './base-types';
import { CommonAttributes } from './common-attributes';
import { QTISection } from './section';
import { ItemSessionControl } from './item-session-control';
import { TimeLimits } from './time-limits';

export interface QTITestPart extends CommonAttributes {
  navigationMode: Navigation;
  submissionMode: Submission;
  sections: QTISection[];
  preConditions?: string[];
  branchRules?: string[];
  itemSessionControl?: ItemSessionControl;
  timeLimits?: TimeLimits;
}


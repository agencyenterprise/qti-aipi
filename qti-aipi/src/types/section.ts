// section.ts
import { Visibility } from './base-types';
import { CommonAttributes } from './common-attributes';
import { QTIAssessmentItem } from './assessment-item';
import { ItemSessionControl } from './item-session-control';
import { TimeLimits } from './time-limits';

export interface QTISection extends CommonAttributes {
  visible: Visibility;
  sections?: QTISection[];
  items?: QTIAssessmentItem[];
  selection?: number;
  ordering?: 'random' | 'sequential';
  preConditions?: string[];
  branchRules?: string[];
  itemSessionControl?: ItemSessionControl;
  timeLimits?: TimeLimits;
}


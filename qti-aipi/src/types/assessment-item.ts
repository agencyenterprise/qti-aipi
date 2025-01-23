// assessment-item.ts
import { CommonAttributes } from './common-attributes';
import { QTIQuestion } from './question';
import { TemplateDefault } from './template-default';
import { QTIStylesheet } from './stylesheet';

export interface QTIAssessmentItem extends CommonAttributes {
  adaptive?: boolean;
  timeDependent?: boolean;
  questions: QTIQuestion[];
  preConditions?: string[];
  templateDefaults?: Record<string, TemplateDefault>;
  responseProcessing?: string;
  stylesheets?: QTIStylesheet[];
}


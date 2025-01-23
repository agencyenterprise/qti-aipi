// feedback.ts
import { ShowHide } from './base-types';

export interface QTIFeedback {
  identifier: string;
  content: string;
  showHide: ShowHide;
  outcomeIdentifier: string;
}
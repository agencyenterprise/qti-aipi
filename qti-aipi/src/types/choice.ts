// choice.ts
import { ShowHide } from './base-types';

export interface QTIChoice {
  identifier: string;
  value: string;
  fixed?: boolean;
  templateIdentifier?: string;
  showHide?: ShowHide;
  matchMax?: number;
  matchMin?: number;
}


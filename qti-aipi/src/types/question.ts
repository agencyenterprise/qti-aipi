// question.ts
import { BaseType, QuestionType, Orientation, DrawingTool } from './base-types';
import { QTIChoice } from './choice';
import { QTIHotspot } from './hotspot';
import { ResponseMapping } from './response-mapping';
import { AreaMapping } from './area-mapping';
import { TemplateDefault } from './template-default';

export interface QTIQuestion {
  identifier: string;
  type: QuestionType;
  prompt: string;
  responseIdentifier?: string;
  required?: boolean;
  fixed?: boolean;
  preConditions?: string[];
  templateDefaults?: Record<string, TemplateDefault>;
  baseType?: BaseType;
  pattern?: string;
  format?: 'plain' | 'preformatted' | 'xhtml' | 'rtf';
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  caseSensitive?: boolean;
  expectedLength?: number;
  minStrings?: number;
  maxStrings?: number;
  rubricBlock?: string;
  choices?: QTIChoice[];
  shuffle?: boolean;
  maxChoices?: number;
  minChoices?: number;
  orderItems?: string[];
  orientation?: Orientation;
  matchItems?: {
    source: QTIChoice[];
    target: QTIChoice[];
  };
  maxAssociations?: number;
  minAssociations?: number;
  inlineChoices?: QTIChoice[];
  gaps?: string[];
  gapTexts?: QTIChoice[];
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  hotspots?: QTIHotspot[];
  backgroundColor?: string;
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    orientation: Orientation;
    reverse?: boolean;
    stepLabel?: boolean;
  };
  drawingConfig?: {
    width: number;
    height: number;
    tools: DrawingTool[];
    background?: string;
    grid?: boolean;
    gridSize?: number;
  };
  correctResponse: string[];
  mapping?: ResponseMapping;
  areaMapping?: AreaMapping;
  feedback: {
    correct: string;
    incorrect: string;
  };
}


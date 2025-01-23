// question.ts
import { BaseType, QuestionType, Orientation, DrawingTool } from './base-types';
import { SimpleChoice } from './choice-interaction';
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
  choices?: SimpleChoice[];
  shuffle?: boolean;
  maxChoices?: number;
  minChoices?: number;
  orderItems?: string[];
  orientation?: Orientation;
  matchItems?: {
    source: SimpleChoice[];
    target: SimpleChoice[];
  };
  maxAssociations?: number;
  minAssociations?: number;
  inlineChoices?: SimpleChoice[];
  gaps?: string[];
  gapTexts?: SimpleChoice[];
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

  // Extended Text Interaction specific properties (QTI 3.0 Section 5.48)
  base?: number;  // Default: 10
  stringIdentifier?: string;
  patternMask?: string;
  patternMaskMessage?: string;
  placeholderText?: string;
  expectedLines?: number;

  // Gap Match Interaction specific properties (QTI 3.0 Section 5.57)
  minSelectionsMessage?: string;  // data-min-selections-message
  maxSelectionsMessage?: string;  // data-max-selections-message
  choicesContainerWidth?: number; // data-choices-container-width

  // Associate Interaction (QTI 3.0 Section 4.4.2)
  associableChoices?: SimpleChoice[];
  associableHotspots?: QTIHotspot[];

  // Custom Interaction (QTI 3.0 Section 4.4.4)
  customNamespace?: string;
  customElement?: string;
  customProperties?: Record<string, string | number | boolean | null>;

  // End Attempt Interaction (QTI 3.0 Section 4.4.5)
  title?: string;

  // Graphic Order Interaction (QTI 3.0 Section 4.4.8)
  orderableHotspots?: QTIHotspot[];

  // Position Object Interaction (QTI 3.0 Section 4.4.13)
  centerPoint?: boolean;
  objects?: Array<{
    type: 'image' | 'text';
    value: string;
    width?: number;
    height?: number;
  }>;

  // Select Point Interaction (QTI 3.0 Section 4.4.15)
  maxPoints?: number;
  minPoints?: number;

  // Match Interaction specific properties (QTI 3.0 Section 5.89)
  firstColumnHeader?: string;  // data-first-column-header
}


// base-types.ts
export type BaseType =
  | 'identifier'
  | 'boolean'
  | 'integer'
  | 'float'
  | 'string'
  | 'point'
  | 'pair'
  | 'directedPair'
  | 'duration'
  | 'file'
  | 'uri'
  | 'intOrIdentifier'
  | 'coordinate';
export type Cardinality = 'single' | 'multiple' | 'ordered' | 'record';
export type Navigation = 'linear' | 'nonlinear';
export type Submission = 'individual' | 'simultaneous';
export type Visibility = 'true' | 'false';
export type ShowHide = 'show' | 'hide';
export type Shape = 'circle' | 'rect' | 'poly' | 'default';
export type Orientation = 'horizontal' | 'vertical';
export type QuestionType =
  | 'choiceInteraction'
  | 'textEntryInteraction'
  | 'extendedTextInteraction'
  | 'orderInteraction'
  | 'matchInteraction'
  | 'inlineChoiceInteraction'
  | 'gapMatchInteraction'
  | 'hotspotInteraction'
  | 'graphicGapMatchInteraction'
  | 'sliderInteraction'
  | 'drawingInteraction'
  | 'uploadInteraction'
  | 'associateInteraction'
  | 'customInteraction'
  | 'endAttemptInteraction'
  | 'graphicAssociateInteraction'
  | 'graphicOrderInteraction'
  | 'positionObjectInteraction'
  | 'selectPointInteraction';
export type DrawingTool = 'pen' | 'eraser' | 'shapes';

export interface BaseValue {
  baseType: BaseType;
  value: string | number | boolean;
}

export interface ResponseDeclaration {
  identifier: string;
  cardinality: Cardinality;
  baseType: BaseType;
  correctResponse?: {
    value: BaseValue[];
  };
  mapping?: {
    defaultValue: number;
    lowerBound?: number;
    upperBound?: number;
    mapEntries: {
      mapKey: string;
      mappedValue: number;
    }[];
  };
  areaMapping?: {
    defaultValue: number;
    lowerBound?: number;
    upperBound?: number;
    areaMapEntries: {
      shape: 'circle' | 'ellipse' | 'poly' | 'rect';
      coords: string;
      mappedValue: number;
    }[];
  };
}

export interface OutcomeDeclaration {
  identifier: string;
  cardinality: Cardinality;
  baseType: BaseType;
  defaultValue?: BaseValue;
  normalMaximum?: number;
  normalMinimum?: number;
  masteryValue?: number;
}

export interface TemplateDeclaration {
  identifier: string;
  cardinality: Cardinality;
  baseType: BaseType;
  defaultValue?: BaseValue;
  mathVariable?: string;
  paramVariable?: string;
}

export interface Variable {
  identifier: string;
  cardinality: Cardinality;
  baseType: BaseType;
  value?: BaseValue;
}

export interface ResponseValidation {
  patternMask?: string;
  minConstraint?: number;
  maxConstraint?: number;
  expectedLength?: number;
}


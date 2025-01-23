// base-types.ts
export type BaseType = 'identifier' | 'boolean' | 'integer' | 'float' | 'string' | 'point' | 'pair' | 'directedPair' | 'duration' | 'file' | 'uri';
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


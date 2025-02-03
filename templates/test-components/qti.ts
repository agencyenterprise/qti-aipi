export interface Choice {
  identifier: string;
  content: string | React.ReactNode;
  fixed?: boolean;
}

export interface Interaction {
  type: 'choiceInteraction' | 'textEntryInteraction' | 'inlineChoiceInteraction';
  responseIdentifier: string;
  choices?: Choice[];
  prompt?: string;
}

export interface QtiVariable {
  identifier: string;
  baseType?: string;
  cardinality: 'single' | 'multiple' | 'ordered' | 'record';
  value: any;
  defaultValue?: any;
  correctResponse?: any;
}

export interface QtiOutcome extends QtiVariable {
  interpretation?: string;
  normalMaximum?: number;
  normalMinimum?: number;
  masteryValue?: number;
}

export interface QtiResponse extends QtiVariable {
  mapping?: QtiMapping;
  areaMapping?: QtiAreaMapping;
}

export interface QtiMapping {
  defaultValue: number;
  lowerBound?: number;
  upperBound?: number;
  entries: QtiMapEntry[];
}

export interface QtiMapEntry {
  mapKey: string;
  mappedValue: number;
  caseSensitive?: boolean;
}

export interface QtiAreaMapping {
  defaultValue: number;
  lowerBound?: number;
  upperBound?: number;
  entries: QtiAreaMapEntry[];
}

export interface QtiAreaMapEntry {
  shape: 'circle' | 'rect' | 'poly';
  coords: number[];
  mappedValue: number;
}

export interface QtiItem {
  identifier: string;
  title?: string;
  adaptive: boolean;
  timeDependent: boolean;
  outcomes: Record<string, QtiOutcome>;
  responses: Record<string, QtiResponse>;
  template?: Record<string, QtiVariable>;
  responseRules?: ProcessingRule[];
}

export interface ProcessingRule {
  type: string;
  identifier: string;
  value?: any;
  condition?: string;
  rules?: ProcessingRule[];
}
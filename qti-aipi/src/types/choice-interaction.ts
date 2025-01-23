// choice.ts
import { ShowHide } from './base-types';

// As per QTI 3.0 spec Table 5.30.7
export interface SimpleChoice {
  identifier: string; // Required, unique identifier for the choice
  value: string; // The text/content of the choice
  fixed?: boolean; // Optional, if true this choice's position is fixed when shuffle is true
  showHide?: ShowHide; // Optional, controls visibility
  templateIdentifier?: string; // Optional, used for templating
  matchMax?: number; // Optional, maximum number of times this choice can be matched
}

// As per QTI 3.0 spec Table 5.30
export interface ChoiceInteractionType {
  // Base attributes (inherited from BasePromptInteraction)
  id?: string;
  class?: string;
  lang?: string;
  language?: string; // deprecated
  label?: string;
  base?: string;
  responseIdentifier: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  'data-catalog-idref'?: string;
  'data-qti-suppress-tts'?: 'computer-read-aloud' | 'screen-reader' | 'all';
  dataExtension?: { [key: string]: string };
  qtiPrompt?: string;

  // Choice-specific attributes
  shuffle?: boolean; // Optional, default = false
  maxChoices?: number; // Optional, default = 1
  minChoices?: number; // Optional, default = 0
  orientation?: 'horizontal' | 'vertical'; // Optional, default = vertical
  'data-min-selections-message'?: string; // Optional, custom message for min selections violation
  'data-max-selections-message'?: string; // Optional, custom message for max selections violation
  choices?: SimpleChoice[]; // Required, array of simple choices
  correctResponse: string[]; // Array of choice identifiers that are correct
}


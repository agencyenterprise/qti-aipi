// BasePromptInteraction Attributes
export interface BasePromptInteractionType {
  id?: string; // UniqueIdentifier, optional
  class?: string; // StringList, optional
  lang?: string; // NormalizedString, optional
  language?: string; // Language, optional (deprecated)
  label?: string; // NormalizedString, optional
  base?: string; // URI, optional
  responseIdentifier: string; // Required
  dir?: 'ltr' | 'rtl' | 'auto'; // Optional, default = "auto"
  'data-catalog-idref'?: string; // IDREF, optional
  'data-qti-suppress-tts'?: 'computer-read-aloud' | 'screen-reader' | 'all'; // Optional
  dataExtension?: { [key: string]: string }; // Custom attributes
  qtiPrompt?: string; // Optional prompt
}
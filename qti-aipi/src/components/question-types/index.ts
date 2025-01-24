export { ChoiceInteraction } from './qti-choice-interaction';
export { TextEntryInteraction } from './qti-text-entry-interaction';
export { ExtendedTextInteraction } from './qti-extended-text-interaction';
export { OrderInteraction } from './qti-order-interaction';
export { MatchInteraction } from './qti-match-interaction';
export { InlineChoiceInteraction } from './qti-inline-choice-interaction';
export { GapMatchInteraction } from './qti-gap-match-interaction';
export { HotspotInteraction } from './qti-hotspot-interaction';
export { GraphicGapMatchInteraction } from './qti-graphic-gap-match-interaction';
export { SliderInteraction } from './qti-slider-interaction';
export { DrawingInteraction } from './qti-drawing-interaction';
export { UploadInteraction } from './qti-upload-interaction';
export { AssociateInteraction } from './qti-associate-interaction';
export { CustomInteraction } from './qti-custom-interaction';
export { GraphicAssociateInteraction } from './qti-graphic-associate-interaction';
export { GraphicOrderInteraction } from './qti-graphic-order-interaction';
export { PositionObjectInteraction } from './qti-position-object-interaction';
export { SelectPointInteraction } from './qti-select-point-interaction';

export { default as MultipleChoiceQuestion } from './MultipleChoiceQuestion';
export { default as TextEntryQuestion } from './TextEntryQuestion';
export { default as ExtendedTextQuestion } from './ExtendedTextQuestion';
export { default as MatchingQuestion } from './MatchingQuestion';

export type QuestionType = 'multipleChoice' | 'textEntry' | 'extendedText' | 'matching';

export const questionTypeLabels: Record<QuestionType, string> = {
  multipleChoice: 'Multiple Choice',
  textEntry: 'Text Entry',
  extendedText: 'Extended Text',
  matching: 'Matching',
}; 
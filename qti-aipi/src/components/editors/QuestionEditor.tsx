import { QTIQuestion, QTIHotspot, QTIAssessmentTest, ItemSessionControl, TimeLimits } from '../../types';
import { Dispatch } from 'react';
import {
  ChoiceInteraction,
  TextEntryInteraction,
  ExtendedTextInteraction,
  OrderInteraction,
  MatchInteraction,
  InlineChoiceInteraction,
  GapMatchInteraction,
  HotspotInteraction,
  GraphicGapMatchInteraction,
  SliderInteraction,
  DrawingInteraction,
  UploadInteraction
} from '../question-types';

interface ExtendedQTIAssessmentItem extends QTIAssessmentTest {
  itemSessionControl?: ItemSessionControl;
  timeLimits?: TimeLimits;
}

interface State {
  assessment: ExtendedQTIAssessmentItem;
  isSubmitting: boolean;
}

interface Action {
  type: 'UPDATE_ASSESSMENT' | 'START_SUBMISSION' | 'END_SUBMISSION';
  payload?: Partial<ExtendedQTIAssessmentItem>;
}

interface QuestionEditorProps {
  question: QTIQuestion;
  qIndex: number;
  updateQuestion: (qIndex: number, field: keyof QTIQuestion, value: string | number | boolean | string[] | undefined) => void;
  updateChoice: (qIndex: number, cIndex: number, value: string) => void;
  addChoice: (qIndex: number) => void;
  updateOrderItem: (qIndex: number, itemIndex: number, value: string) => void;
  addOrderItem: (qIndex: number) => void;
  updateMatchItem: (qIndex: number, type: 'source' | 'target', itemIndex: number, value: string) => void;
  addMatchItem: (qIndex: number, type: 'source' | 'target') => void;
  updateGapText: (qIndex: number, gapIndex: number, value: string) => void;
  addGapText: (qIndex: number) => void;
  updateHotspot: (qIndex: number, hotspotIndex: number, updates: Partial<QTIHotspot>) => void;
  addHotspot: (qIndex: number) => void;
  state: State;
  dispatch: Dispatch<Action>;
}

export const QuestionEditor = ({
  question,
  qIndex,
  updateQuestion,
  updateChoice,
  addChoice,
  updateOrderItem,
  addOrderItem,
  updateMatchItem,
  addMatchItem,
  updateGapText,
  addGapText,
  updateHotspot,
  addHotspot,
  state,
  dispatch
}: QuestionEditorProps) => {
  switch (question.type) {
    case 'choiceInteraction':
      return (
        <ChoiceInteraction
          question={question}
          qIndex={qIndex}
          updateQuestion={updateQuestion}
          updateChoice={updateChoice}
          addChoice={addChoice}
          state={state}
          dispatch={dispatch}
        />
      );

    case 'textEntryInteraction':
      return (
        <TextEntryInteraction
          question={question}
          qIndex={qIndex}
          updateQuestion={updateQuestion}
          state={state}
          dispatch={dispatch}
        />
      );

    case 'extendedTextInteraction':
      return (
        <ExtendedTextInteraction
          question={question}
          qIndex={qIndex}
          updateQuestion={updateQuestion}
          state={state}
          dispatch={dispatch}
        />
      );

    case 'orderInteraction':
      return (
        <OrderInteraction
          question={question}
          qIndex={qIndex}
          updateQuestion={updateQuestion}
          updateOrderItem={updateOrderItem}
          addOrderItem={addOrderItem}
          state={state}
          dispatch={dispatch}
        />
      );

    case 'matchInteraction':
      return (
        <MatchInteraction
          question={question}
          qIndex={qIndex}
          updateQuestion={updateQuestion}
          updateMatchItem={updateMatchItem}
          addMatchItem={addMatchItem}
          state={state}
          dispatch={dispatch}
        />
      );

    case 'inlineChoiceInteraction':
      return (
        <InlineChoiceInteraction
          question={question}
          qIndex={qIndex}
          updateQuestion={updateQuestion}
          state={state}
          dispatch={dispatch}
        />
      );

    case 'gapMatchInteraction':
      return (
        <GapMatchInteraction
          question={question}
          qIndex={qIndex}
          updateQuestion={updateQuestion}
          updateGapText={updateGapText}
          addGapText={addGapText}
          state={state}
          dispatch={dispatch}
        />
      );

    case 'hotspotInteraction':
      return (
        <HotspotInteraction
          question={question}
          qIndex={qIndex}
          updateQuestion={updateQuestion}
          updateHotspot={updateHotspot}
          addHotspot={addHotspot}
          state={state}
          dispatch={dispatch}
        />
      );

    case 'graphicGapMatchInteraction':
      return (
        <GraphicGapMatchInteraction
          question={question}
          qIndex={qIndex}
          updateQuestion={updateQuestion}
          updateHotspot={updateHotspot}
          addHotspot={addHotspot}
          state={state}
          dispatch={dispatch}
        />
      );

    case 'sliderInteraction':
      return (
        <SliderInteraction
          question={question}
          qIndex={qIndex}
          updateQuestion={updateQuestion}
          state={state}
          dispatch={dispatch}
        />
      );

    case 'drawingInteraction':
      return (
        <DrawingInteraction
          question={question}
          qIndex={qIndex}
          updateQuestion={updateQuestion}
          state={state}
          dispatch={dispatch}
        />
      );

    case 'uploadInteraction':
      return (
        <UploadInteraction
          question={question}
          qIndex={qIndex}
          updateQuestion={updateQuestion}
          state={state}
          dispatch={dispatch}
        />
      );

    default:
      return null;
  }
}; 
import { Box, Paper, Typography } from '@mui/material';
import {
  MultipleChoiceQuestion,
  TextEntryQuestion,
  ExtendedTextQuestion,
  MatchingQuestion,
  QuestionType,
} from './question-types';
import { QTIAssessmentItem } from '../types/assessment-item';

interface QuestionPreviewProps {
  question: QTIAssessmentItem;
  onAnswerChange?: (answer: any) => void;
}

export default function QuestionPreview({ question, onAnswerChange }: QuestionPreviewProps) {
  const renderQuestion = () => {
    const commonProps = {
      editable: false,
      onChange: onAnswerChange,
    };

    switch (question.questiontype as QuestionType) {
      case 'multipleChoice':
        return (
          <MultipleChoiceQuestion
            {...commonProps}
            value={{
              prompt: question.prompt || '',
              choices: question.choices || [],
              correctResponse: question.correctResponse || '',
            }}
          />
        );
      case 'textEntry':
        return (
          <TextEntryQuestion
            {...commonProps}
            value={{
              prompt: question.prompt || '',
              correctResponses: question.correctResponses || [],
              caseSensitive: question.caseSensitive || false,
            }}
          />
        );
      case 'extendedText':
        return (
          <ExtendedTextQuestion
            {...commonProps}
            value={{
              prompt: question.prompt || '',
              maxLength: question.maxLength || 1000,
              expectedLength: question.expectedLength || 500,
              format: question.format || 'plain',
            }}
          />
        );
      case 'matching':
        return (
          <MatchingQuestion
            {...commonProps}
            value={{
              prompt: question.prompt || '',
              pairs: question.pairs || [],
              shuffleOptions: question.shuffleOptions || true,
            }}
          />
        );
      default:
        return (
          <Typography color="error">
            Unknown question type: {question.questiontype}
          </Typography>
        );
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Question {question.identifier}
        </Typography>
      </Box>
      {renderQuestion()}
    </Paper>
  );
} 
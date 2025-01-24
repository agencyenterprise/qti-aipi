import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addAssessment } from '../store/slices/assessmentSlice';
import { QuestionType, questionTypeLabels } from '../components/question-types';
import QuestionPreview from '../components/QuestionPreview';

const steps = ['Basic Information', 'Questions', 'Review'];

interface AssessmentForm {
  title: string;
  description: string;
  timeLimit?: number;
  passingScore?: number;
  questions: any[];
}

export default function AssessmentEditor() {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [assessment, setAssessment] = useState<AssessmentForm>({
    title: '',
    description: '',
    questions: [],
  });
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType>('multipleChoice');

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinish = () => {
    // TODO: Implement assessment submission
    dispatch(addAssessment({
      identifier: `assessment-${Date.now()}`,
      title: assessment.title,
      description: assessment.description,
      timeLimit: assessment.timeLimit,
      passingScore: assessment.passingScore,
      questions: assessment.questions,
    }));
  };

  const handleQuestionTypeChange = (event: SelectChangeEvent<QuestionType>) => {
    setSelectedQuestionType(event.target.value as QuestionType);
  };

  const renderBasicInfo = () => (
    <Box sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Assessment Title"
        value={assessment.title}
        onChange={(e) => setAssessment({ ...assessment, title: e.target.value })}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Description"
        value={assessment.description}
        onChange={(e) => setAssessment({ ...assessment, description: e.target.value })}
        margin="normal"
        multiline
        rows={3}
      />
      <TextField
        fullWidth
        type="number"
        label="Time Limit (minutes)"
        value={assessment.timeLimit || ''}
        onChange={(e) => setAssessment({ ...assessment, timeLimit: Number(e.target.value) })}
        margin="normal"
      />
      <TextField
        fullWidth
        type="number"
        label="Passing Score (%)"
        value={assessment.passingScore || ''}
        onChange={(e) => setAssessment({ ...assessment, passingScore: Number(e.target.value) })}
        margin="normal"
      />
    </Box>
  );

  const renderQuestions = () => (
    <Box sx={{ mt: 2 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Question Type</InputLabel>
        <Select
          value={selectedQuestionType}
          onChange={handleQuestionTypeChange}
          label="Question Type"
        >
          {Object.entries(questionTypeLabels).map(([type, label]) => (
            <MenuItem key={type} value={type}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Questions
        </Typography>
        {assessment.questions.map((question, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <QuestionPreview question={question} />
          </Box>
        ))}
      </Box>
    </Box>
  );

  const renderReview = () => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Assessment Review
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1">Title: {assessment.title}</Typography>
        <Typography variant="subtitle1">Description: {assessment.description}</Typography>
        <Typography variant="subtitle1">Time Limit: {assessment.timeLimit} minutes</Typography>
        <Typography variant="subtitle1">Passing Score: {assessment.passingScore}%</Typography>
        <Typography variant="subtitle1">Questions: {assessment.questions.length}</Typography>
      </Paper>
    </Box>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderQuestions();
      case 2:
        return renderReview();
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create Assessment
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mt: 3, mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3 }}>
        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleFinish : handleNext}
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
} 
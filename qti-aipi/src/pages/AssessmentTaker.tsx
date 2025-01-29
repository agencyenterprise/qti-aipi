import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import { assessmentTestsApi } from '../services/api';

interface Question {
  id: string;
  type: 'multiple_choice' | 'short_answer' | 'essay' | 'true_false';
  prompt: string;
  options?: string[];
  points: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface Answer {
  questionId: string;
  answer: string;
}

export default function AssessmentTaker() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch assessment
  const { data: assessment, isLoading } = useQuery(
    ['assessment', id],
    () => assessmentTestsApi.getById(id!),
    {
      enabled: !!id,
      onError: (error: Error) => {
        setSnackbar({
          open: true,
          message: error.message,
          severity: 'error',
        });
      },
    }
  );

  // Submit answers mutation
  const { mutate: submitAssessment, isLoading: isSubmitting } = useMutation(
    async (data: { assessmentId: string; answers: Answer[] }) => {
      // TODO: Implement submission endpoint in API
      console.log('Submitting answers:', data);
      return Promise.resolve(); // Temporary
    },
    {
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: 'Assessment submitted successfully',
          severity: 'success',
        });
        navigate('/');
      },
      onError: (error: Error) => {
        setSnackbar({
          open: true,
          message: error.message,
          severity: 'error',
        });
      },
    }
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (answer: string) => {
    if (!assessment) return;
    
    const currentQuestion = assessment.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex(
        (a) => a.questionId === currentQuestion.id
      );
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = {
          questionId: currentQuestion.id,
          answer,
        };
        return newAnswers;
      }
      return [...prev, { questionId: currentQuestion.id, answer }];
    });
  };

  const getCurrentAnswer = () => {
    if (!assessment) return '';
    
    const currentQuestion = assessment.questions[currentQuestionIndex];
    if (!currentQuestion) return '';
    
    return (
      answers.find((a) => a.questionId === currentQuestion.id)?.answer || ''
    );
  };

  const handleNext = () => {
    if (!assessment) return;
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (!assessment || !id) return;
    submitAssessment({ assessmentId: id, answers });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography>Loading assessment...</Typography>
        </Box>
      </Container>
    );
  }

  if (!assessment) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography>Assessment not found</Typography>
        </Box>
      </Container>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / assessment.questions.length) * 100;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5">{assessment.title}</Typography>
            <Typography variant="h6" color="primary">
              Time Remaining: {formatTime(timeRemaining)}
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ mb: 3 }} />
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Question {currentQuestionIndex + 1} of {assessment.questions.length}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, mb: 3 }}>
              {currentQuestion.prompt}
            </Typography>

            {currentQuestion.type === 'multiple_choice' && (
              <FormControl component="fieldset">
                <RadioGroup
                  value={getCurrentAnswer()}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                >
                  {currentQuestion.options?.map((option: string, index: number) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            {currentQuestion.type === 'true_false' && (
              <FormControl component="fieldset">
                <RadioGroup
                  value={getCurrentAnswer()}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                >
                  <FormControlLabel value="true" control={<Radio />} label="True" />
                  <FormControlLabel value="false" control={<Radio />} label="False" />
                </RadioGroup>
              </FormControl>
            )}

            {(currentQuestion.type === 'short_answer' ||
              currentQuestion.type === 'essay') && (
              <TextField
                fullWidth
                multiline
                rows={currentQuestion.type === 'essay' ? 4 : 2}
                value={getCurrentAnswer()}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Enter your answer here..."
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            {currentQuestionIndex === assessment.questions.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenSubmitDialog(true)}
              >
                Submit
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </Box>

      <Dialog
        open={openSubmitDialog}
        onClose={() => setOpenSubmitDialog(false)}
      >
        <DialogTitle>Submit Assessment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit your assessment? You won't be able to change your answers after submission.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubmitDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 

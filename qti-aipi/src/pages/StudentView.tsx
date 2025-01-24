import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Flag as FlagIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';

const mockAssessment = {
  title: 'Sample Math Quiz',
  totalQuestions: 10,
  timeLimit: 30, // minutes
  questions: [
    {
      id: 1,
      type: 'multiple-choice',
      prompt: 'What is 2 + 2?',
      choices: ['3', '4', '5', '6'],
      correctAnswer: '4',
    },
    {
      id: 2,
      type: 'short-answer',
      prompt: 'What is the capital of France?',
      correctAnswer: 'Paris',
    },
    // Add more questions as needed
  ],
};

const StudentView = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(mockAssessment.timeLimit * 60);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value,
    });
  };

  const handleFlag = () => {
    if (flagged.includes(currentQuestion)) {
      setFlagged(flagged.filter((q) => q !== currentQuestion));
    } else {
      setFlagged([...flagged, currentQuestion]);
    }
  };

  const handleSubmit = () => {
    // TODO: Implement submission logic
    setShowSubmitDialog(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {mockAssessment.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Question {currentQuestion + 1} of {mockAssessment.totalQuestions}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimerIcon fontSize="small" />
            <Typography variant="body2">{formatTime(timeRemaining)}</Typography>
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(currentQuestion + 1) / mockAssessment.totalQuestions * 100}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Question {currentQuestion + 1}
            </Typography>
            <Typography>
              {mockAssessment.questions[currentQuestion].prompt}
            </Typography>
          </Box>

          {mockAssessment.questions[currentQuestion].type === 'multiple-choice' ? (
            <FormControl component="fieldset">
              <RadioGroup
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
              >
                {mockAssessment.questions[currentQuestion].choices?.map((choice) => (
                  <FormControlLabel
                    key={choice}
                    value={choice}
                    control={<Radio />}
                    label={choice}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ) : (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Enter your answer here..."
            />
          )}
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<PrevIcon />}
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FlagIcon color={flagged.includes(currentQuestion) ? 'error' : 'inherit'} />}
            onClick={handleFlag}
          >
            {flagged.includes(currentQuestion) ? 'Unflag' : 'Flag'}
          </Button>
          {currentQuestion === mockAssessment.totalQuestions - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowSubmitDialog(true)}
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              endIcon={<NextIcon />}
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>

      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
        <DialogTitle>Submit Assessment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit your assessment?
            {Object.keys(answers).length < mockAssessment.totalQuestions &&
              ` You have ${mockAssessment.totalQuestions - Object.keys(answers).length} unanswered questions.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentView; 
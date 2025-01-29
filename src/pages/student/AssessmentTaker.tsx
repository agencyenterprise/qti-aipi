import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  getStudentAssessmentDetails,
  startAssessment,
  submitAssessmentResponse,
  finishAssessment,
} from '../../services/api';
import { showSnackbar } from '../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';
import { AxiosResponse } from 'axios';

interface QTIChoice {
  identifier: string;
  value: string;
}

interface QTIInteraction {
  type: 'choiceInteraction' | 'textEntryInteraction' | 'inlineChoiceInteraction' | 'matchInteraction';
  responseIdentifier: string;
  prompt: string;
  choices?: QTIChoice[];
}

interface QTIItem {
  identifier: string;
  title: string;
  itemBody: {
    interactions: QTIInteraction[];
  };
}

interface QTISection {
  identifier: string;
  title: string;
  items: QTIItem[];
}

interface QTIAssessment {
  identifier: string;
  title: string;
  timeLimit: number;
  testParts: Array<{
    identifier: string;
    navigationMode: 'linear' | 'nonlinear';
    submissionMode: 'individual' | 'simultaneous';
    assessmentSections: QTISection[];
  }>;
}

interface AssessmentResponse {
  data: QTIAssessment;
}

interface StartAssessmentResponse {
  data: {
    timeRemaining: number;
  };
}

const AssessmentTaker: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [partIndex, setPartIndex] = useState(0);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [confirmFinish, setConfirmFinish] = useState(false);

  // Fetch assessment details
  const { data: assessmentResponse, isLoading } = useQuery<AxiosResponse<AssessmentResponse>>({
    queryKey: ['studentAssessment', assessmentId],
    queryFn: async () => {
      if (!assessmentId) throw new Error('Assessment ID is required');
      return await getStudentAssessmentDetails(assessmentId);
    }
  });

  const assessment = assessmentResponse?.data.data;

  // Start assessment mutation
  const startMutation = useMutation<AxiosResponse<StartAssessmentResponse>>({
    mutationFn: async () => {
      if (!assessmentId) throw new Error('Assessment ID is required');
      return await startAssessment(assessmentId);
    },
    onSuccess: (response) => {
      setTimeRemaining(response.data.data.timeRemaining);
    }
  });

  // Submit response mutation
  const submitResponseMutation = useMutation({
    mutationFn: (data: { itemIdentifier: string; responseIdentifier: string; response: string | string[] }) =>
      assessmentId ? submitAssessmentResponse(assessmentId, data) : Promise.reject()
  });

  // Finish assessment mutation
  const finishMutation = useMutation({
    mutationFn: () => assessmentId ? finishAssessment(assessmentId) : Promise.reject(),
    onSuccess: () => {
      dispatch(
        showSnackbar({
          message: 'Assessment submitted successfully',
          severity: 'success'
        })
      );
      navigate('/student/assessments');
    }
  });

  useEffect(() => {
    if (assessment && !timeRemaining) {
      startMutation.mutate();
    }
  }, [assessment]);

  useEffect(() => {
    if (timeRemaining !== null) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const getCurrentItem = () => {
    if (!assessment) return null;
    const part = assessment.testParts[partIndex];
    const section = part.assessmentSections[sectionIndex];
    return section.items[itemIndex];
  };

  const handleResponse = (itemIdentifier: string, responseIdentifier: string, response: string | string[]) => {
    setResponses((prev) => ({
      ...prev,
      [responseIdentifier]: response
    }));

    submitResponseMutation.mutate({
      itemIdentifier,
      responseIdentifier,
      response
    });
  };

  const handleNext = () => {
    if (!assessment) return;
    const part = assessment.testParts[partIndex];
    const section = part.assessmentSections[sectionIndex];

    if (itemIndex < section.items.length - 1) {
      setItemIndex(itemIndex + 1);
    } else if (sectionIndex < part.assessmentSections.length - 1) {
      setSectionIndex(sectionIndex + 1);
      setItemIndex(0);
    } else if (partIndex < assessment.testParts.length - 1) {
      setPartIndex(partIndex + 1);
      setSectionIndex(0);
      setItemIndex(0);
    } else {
      setConfirmFinish(true);
    }
  };

  const handlePrevious = () => {
    if (!assessment) return;
    const part = assessment.testParts[partIndex];

    if (itemIndex > 0) {
      setItemIndex(itemIndex - 1);
    } else if (sectionIndex > 0) {
      setSectionIndex(sectionIndex - 1);
      const previousSection = part.assessmentSections[sectionIndex - 1];
      setItemIndex(previousSection.items.length - 1);
    } else if (partIndex > 0) {
      const previousPartIndex = partIndex - 1;
      const previousPart = assessment.testParts[previousPartIndex];
      const lastSectionIndex = previousPart.assessmentSections.length - 1;
      const lastSection = previousPart.assessmentSections[lastSectionIndex];
      
      setPartIndex(previousPartIndex);
      setSectionIndex(lastSectionIndex);
      setItemIndex(lastSection.items.length - 1);
    }
  };

  const handleFinish = () => {
    finishMutation.mutate();
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  const item = getCurrentItem();
  if (!item) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {assessment?.title}
        </Typography>
        {timeRemaining !== null && (
          <Alert
            severity={timeRemaining < 300 ? 'warning' : 'info'}
            sx={{ mb: 2 }}
          >
            Time Remaining: {formatTime(timeRemaining)}
          </Alert>
        )}
        <LinearProgress
          variant="determinate"
          value={(itemIndex + 1) / item.itemBody.interactions.length * 100}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {item.title}
        </Typography>

        {item.itemBody.interactions.map((interaction: QTIInteraction, index: number) => (
          <Box key={interaction.responseIdentifier} sx={{ mb: 4 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 2 }}>{interaction.prompt}</FormLabel>
              {interaction.type === 'choiceInteraction' && interaction.choices && (
                <RadioGroup
                  value={responses[interaction.responseIdentifier] || ''}
                  onChange={(e) => handleResponse(item.identifier, interaction.responseIdentifier, e.target.value)}
                >
                  {interaction.choices.map((choice: QTIChoice) => (
                    <FormControlLabel
                      key={choice.identifier}
                      value={choice.identifier}
                      control={<Radio />}
                      label={choice.value}
                    />
                  ))}
                </RadioGroup>
              )}
              {interaction.type === 'textEntryInteraction' && (
                <TextField
                  multiline
                  rows={4}
                  value={responses[interaction.responseIdentifier] || ''}
                  onChange={(e) => handleResponse(item.identifier, interaction.responseIdentifier, e.target.value)}
                  fullWidth
                />
              )}
            </FormControl>
          </Box>
        ))}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={!assessment || (partIndex === 0 && sectionIndex === 0 && itemIndex === 0)}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!assessment}
        >
          {assessment && (() => {
            const part = assessment.testParts[partIndex];
            const section = part.assessmentSections[sectionIndex];
            const isLastItem = itemIndex === section.items.length - 1;
            const isLastSection = sectionIndex === part.assessmentSections.length - 1;
            const isLastPart = partIndex === assessment.testParts.length - 1;

            return isLastPart && isLastSection && isLastItem ? 'Finish' : 'Next';
          })()}
        </Button>
      </Box>

      <Dialog
        open={confirmFinish}
        onClose={() => setConfirmFinish(false)}
      >
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to finish and submit this assessment?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmFinish(false)}>Cancel</Button>
          <Button onClick={handleFinish} variant="contained" color="primary">
            Submit Assessment
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssessmentTaker; 

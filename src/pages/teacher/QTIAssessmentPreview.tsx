import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
} from '@mui/icons-material';
import { getQTIAssessment } from '../../services/api';

interface QTIAssessmentItem {
  identifier: string;
  title: string;
  adaptive: boolean;
  timeDependent: boolean;
  interactionType: string;
  questionText: string;
  correctResponse: string;
}

interface QTIAssessmentSection {
  identifier: string;
  title: string;
  visible: boolean;
  assessmentItems: QTIAssessmentItem[];
}

interface QTITestPart {
  identifier: string;
  navigationMode: 'linear' | 'nonlinear';
  submissionMode: 'individual' | 'simultaneous';
  assessmentSections: QTIAssessmentSection[];
}

interface QTIAssessment {
  identifier: string;
  title: string;
  testParts: QTITestPart[];
}

const QTIAssessmentPreview: React.FC = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});

  // Fetch assessment
  const { data: response, isLoading } = useQuery({
    queryKey: ['qtiAssessment', assessmentId],
    queryFn: () => getQTIAssessment(assessmentId!),
  });

  const assessment = response?.data as QTIAssessment;

  const handleBack = () => {
    navigate('/teacher/assessments');
  };

  const handlePrevious = () => {
    setActiveStep((prevStep) => Math.max(0, prevStep - 1));
  };

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(getTotalSteps() - 1, prevStep + 1));
  };

  const getTotalSteps = () => {
    if (!assessment) return 0;
    return assessment.testParts.reduce((total, part) => {
      return total + part.assessmentSections.reduce((sectionTotal, section) => {
        return sectionTotal + section.assessmentItems.length;
      }, 0);
    }, 0);
  };

  const getCurrentItem = () => {
    if (!assessment) return null;
    let currentStep = activeStep;
    
    for (const part of assessment.testParts) {
      for (const section of part.assessmentSections) {
        for (const item of section.assessmentItems) {
          if (currentStep === 0) {
            return {
              item,
              part,
              section,
            };
          }
          currentStep--;
        }
      }
    }
    return null;
  };

  const handleResponseChange = (itemIdentifier: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [itemIdentifier]: value,
    }));
  };

  const renderInteraction = (item: QTIAssessmentItem) => {
    const response = responses[item.identifier] || '';

    const renderMatchInteraction = () => {
      const [sources, targets] = item.correctResponse.split(';').map(group => group.split('|'));
      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">{item.questionText}</FormLabel>
          <List>
            {sources.map((source, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText primary={source} />
                  <Select
                    value={response.split(';')[index] || ''}
                    onChange={(e) => {
                      const newResponses = response.split(';');
                      newResponses[index] = e.target.value;
                      handleResponseChange(item.identifier, newResponses.join(';'));
                    }}
                    sx={{ minWidth: 200 }}
                  >
                    {targets.map((target, targetIndex) => (
                      <MenuItem key={targetIndex} value={target}>
                        {target}
                      </MenuItem>
                    ))}
                  </Select>
                </ListItem>
                {index < sources.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </FormControl>
      );
    };

    switch (item.interactionType) {
      case 'choiceInteraction':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{item.questionText}</FormLabel>
            <RadioGroup
              value={response}
              onChange={(e) => handleResponseChange(item.identifier, e.target.value)}
            >
              {item.correctResponse.split('|').map((choice, index) => (
                <FormControlLabel
                  key={index}
                  value={choice}
                  control={<Radio />}
                  label={choice}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'textEntryInteraction':
        return (
          <FormControl fullWidth>
            <FormLabel>{item.questionText}</FormLabel>
            <TextField
              value={response}
              onChange={(e) => handleResponseChange(item.identifier, e.target.value)}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
          </FormControl>
        );

      case 'inlineChoiceInteraction':
        return (
          <FormControl fullWidth>
            <FormLabel>{item.questionText}</FormLabel>
            <Select
              value={response}
              onChange={(e) => handleResponseChange(item.identifier, e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            >
              {item.correctResponse.split('|').map((choice, index) => (
                <MenuItem key={index} value={choice}>
                  {choice}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'matchInteraction':
        return renderMatchInteraction();

      default:
        return (
          <Typography color="error">
            Unsupported interaction type: {item.interactionType}
          </Typography>
        );
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!assessment) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Assessment not found</Typography>
      </Box>
    );
  }

  const currentContext = getCurrentItem();

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<BackIcon />}
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Back to Assessments
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {assessment.title}
        </Typography>

        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {assessment.testParts.map((part) => (
            <Step key={part.identifier}>
              <StepLabel>{part.identifier}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {currentContext && (
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Part: {currentContext.part.identifier} |
                Section: {currentContext.section.identifier} |
                Item: {currentContext.item.identifier}
              </Typography>

              <Box sx={{ my: 3 }}>
                {renderInteraction(currentContext.item)}
              </Box>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  startIcon={<PrevIcon />}
                  onClick={handlePrevious}
                  disabled={activeStep === 0}
                >
                  Previous
                </Button>
                <Button
                  endIcon={<NextIcon />}
                  onClick={handleNext}
                  disabled={activeStep === getTotalSteps() - 1}
                >
                  Next
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Box>
  );
};

export default QTIAssessmentPreview; 

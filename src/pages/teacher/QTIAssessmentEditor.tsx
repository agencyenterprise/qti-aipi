import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import {
  getQTIAssessment,
  createQTIAssessment,
  updateQTIAssessment,
} from '../../services/api';
import { showSnackbar } from '../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';
import QuestionBank from '../../components/QuestionBank';

interface AssessmentItem {
  identifier: string;
  title: string;
  adaptive: boolean;
  timeDependent: boolean;
  interactionType: string;
  questionText: string;
  correctResponse: string;
}

interface AssessmentSection {
  identifier: string;
  title: string;
  visible: boolean;
  keepTogether: boolean;
  items: AssessmentItem[];
}

interface TestPart {
  identifier: string;
  navigationMode: 'linear' | 'nonlinear';
  submissionMode: 'individual' | 'simultaneous';
  assessmentSections: AssessmentSection[];
}

interface Assessment {
  identifier: string;
  title: string;
  testParts: TestPart[];
}

const QTIAssessmentEditor: React.FC = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const isNewAssessment = !assessmentId;

  const [assessment, setAssessment] = useState<Assessment>({
    identifier: '',
    title: '',
    testParts: [{
      identifier: 'part-1',
      navigationMode: 'linear',
      submissionMode: 'individual',
      assessmentSections: [{
        identifier: 'section-1',
        title: 'Section 1',
        visible: true,
        keepTogether: true,
        items: []
      }]
    }]
  });

  // Fetch assessment if editing
  const { data: existingAssessment, isLoading } = useQuery({
    queryKey: ['qtiAssessment', assessmentId],
    queryFn: () => getQTIAssessment(assessmentId!),
    enabled: !isNewAssessment,
  });

  // Update assessment when data is loaded
  useEffect(() => {
    if (existingAssessment) {
      setAssessment(existingAssessment.data);
    }
  }, [existingAssessment]);

  // Create assessment mutation
  const createMutation = useMutation({
    mutationFn: createQTIAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qtiAssessments'] });
      dispatch(
        showSnackbar({
          message: 'Assessment created successfully',
          severity: 'success'
        })
      );
      navigate('/teacher/assessments');
    },
    onError: (error: any) => {
      dispatch(
        showSnackbar({
          message: error.response?.data?.message || 'Error creating assessment',
          severity: 'error'
        })
      );
    }
  });

  // Update assessment mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => updateQTIAssessment(assessmentId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qtiAssessments'] });
      queryClient.invalidateQueries({ queryKey: ['qtiAssessment', assessmentId] });
      dispatch(
        showSnackbar({
          message: 'Assessment updated successfully',
          severity: 'success'
        })
      );
      navigate('/teacher/assessments');
    },
    onError: (error: any) => {
      dispatch(
        showSnackbar({
          message: error.response?.data?.message || 'Error updating assessment',
          severity: 'error'
        })
      );
    }
  });

  const handleAddTestPart = () => {
    setAssessment(prev => ({
      ...prev,
      testParts: [
        ...prev.testParts,
        {
          identifier: `part-${prev.testParts.length + 1}`,
          navigationMode: 'linear',
          submissionMode: 'individual',
          assessmentSections: [],
        },
      ],
    }));
  };

  const handleAddSection = (partIndex: number) => {
    const updatedTestParts = [...assessment.testParts];
    updatedTestParts[partIndex].assessmentSections.push({
      identifier: `section-${updatedTestParts[partIndex].assessmentSections.length + 1}`,
      title: 'New Section',
      visible: true,
      keepTogether: true,
      items: [],
    });
    setAssessment(prev => ({
      ...prev,
      testParts: updatedTestParts,
    }));
  };

  const handleAddItem = (partIndex: number, sectionIndex: number) => {
    const updatedTestParts = [...assessment.testParts];
    updatedTestParts[partIndex].assessmentSections[sectionIndex].items.push({
      identifier: `item-${updatedTestParts[partIndex].assessmentSections[sectionIndex].items.length + 1}`,
      title: 'New Item',
      adaptive: false,
      timeDependent: false,
      interactionType: 'choiceInteraction',
      questionText: '',
      correctResponse: '',
    });
    setAssessment(prev => ({
      ...prev,
      testParts: updatedTestParts,
    }));
  };

  const handleAddQuestionFromBank = (question: any, partIndex: number, sectionIndex: number) => {
    const updatedTestParts = [...assessment.testParts];
    updatedTestParts[partIndex].assessmentSections[sectionIndex].items.push({
      identifier: `item-${Date.now()}`,
      title: question.title,
      adaptive: false,
      timeDependent: false,
      interactionType: question.type,
      questionText: question.content,
      correctResponse: question.correctAnswer || '',
    });
    setAssessment(prev => ({
      ...prev,
      testParts: updatedTestParts,
    }));
  };

  const handleSave = () => {
    if (!assessment.identifier || !assessment.title) {
      dispatch(
        showSnackbar({
          message: 'Please fill in all required fields',
          severity: 'error'
        })
      );
      return;
    }

    if (assessment.testParts.length === 0) {
      dispatch(
        showSnackbar({
          message: 'Please add at least one test part',
          severity: 'error'
        })
      );
      return;
    }

    // Validate test parts
    for (const part of assessment.testParts) {
      if (!part.identifier || !part.navigationMode || !part.submissionMode) {
        dispatch(
          showSnackbar({
            message: 'Please fill in all test part fields',
            severity: 'error'
          })
        );
        return;
      }

      // Validate sections
      for (const section of part.assessmentSections) {
        if (!section.identifier || !section.title) {
          dispatch(
            showSnackbar({
              message: 'Please fill in all section fields',
              severity: 'error'
            })
          );
          return;
        }
      }
    }

    if (isNewAssessment) {
      createMutation.mutate(assessment);
    } else {
      updateMutation.mutate(assessment);
    }
  };

  const handlePreview = () => {
    if (assessmentId) {
      navigate(`/teacher/assessments/${assessmentId}/preview`);
    } else {
      dispatch(
        showSnackbar({
          message: 'Please save the assessment first to preview it',
          severity: 'info'
        })
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

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h4">
                {isNewAssessment ? 'Create QTI Assessment' : 'Edit QTI Assessment'}
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<PreviewIcon />}
                  onClick={handlePreview}
                  sx={{ mr: 1 }}
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Assessment Title"
                  value={assessment.title}
                  onChange={(e) => setAssessment(prev => ({ ...prev, title: e.target.value }))}
                  required
                  error={!assessment.title}
                  helperText={!assessment.title && 'Title is required'}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Assessment Identifier"
                  value={assessment.identifier}
                  onChange={(e) => setAssessment(prev => ({ ...prev, identifier: e.target.value }))}
                  required
                  error={!assessment.identifier}
                  helperText={!assessment.identifier ? 'Identifier is required' : 'Unique identifier for this assessment'}
                  disabled={!isNewAssessment}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Test Parts</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddTestPart}
                >
                  Add Test Part
                </Button>
              </Box>

              {assessment.testParts.map((part, partIndex) => (
                <Paper key={part.identifier} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Part {partIndex + 1}</Typography>
                    <IconButton onClick={() => {
                      const updatedParts = assessment.testParts.filter((_, index) => index !== partIndex);
                      setAssessment(prev => ({ ...prev, testParts: updatedParts }));
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Navigation Mode</InputLabel>
                        <Select
                          value={part.navigationMode}
                          label="Navigation Mode"
                          onChange={(e) => {
                            const updatedParts = [...assessment.testParts];
                            updatedParts[partIndex].navigationMode = e.target.value as 'linear' | 'nonlinear';
                            setAssessment(prev => ({ ...prev, testParts: updatedParts }));
                          }}
                        >
                          <MenuItem value="linear">Linear</MenuItem>
                          <MenuItem value="nonlinear">Non-linear</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Submission Mode</InputLabel>
                        <Select
                          value={part.submissionMode}
                          label="Submission Mode"
                          onChange={(e) => {
                            const updatedParts = [...assessment.testParts];
                            updatedParts[partIndex].submissionMode = e.target.value as 'individual' | 'simultaneous';
                            setAssessment(prev => ({ ...prev, testParts: updatedParts }));
                          }}
                        >
                          <MenuItem value="individual">Individual</MenuItem>
                          <MenuItem value="simultaneous">Simultaneous</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1">Sections</Typography>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddSection(partIndex)}
                      >
                        Add Section
                      </Button>
                    </Box>

                    {part.assessmentSections.map((section, sectionIndex) => (
                      <Paper key={section.identifier} sx={{ p: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle2">Section {sectionIndex + 1}</Typography>
                          <Box>
                            <Button
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => handleAddItem(partIndex, sectionIndex)}
                              sx={{ mr: 1 }}
                            >
                              Add Item
                            </Button>
                            <IconButton
                              size="small"
                              onClick={() => {
                                const updatedParts = [...assessment.testParts];
                                updatedParts[partIndex].assessmentSections = updatedParts[partIndex].assessmentSections
                                  .filter((_, index) => index !== sectionIndex);
                                setAssessment(prev => ({ ...prev, testParts: updatedParts }));
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>

                        <List>
                          {section.items.map((item, itemIndex) => (
                            <ListItem key={item.identifier}>
                              <ListItemText
                                primary={item.title}
                                secondary={`Type: ${item.interactionType}`}
                              />
                              <ListItemSecondaryAction>
                                <IconButton
                                  edge="end"
                                  onClick={() => {
                                    const updatedParts = [...assessment.testParts];
                                    updatedParts[partIndex].assessmentSections[sectionIndex].items =
                                      updatedParts[partIndex].assessmentSections[sectionIndex].items
                                        .filter((_, index) => index !== itemIndex);
                                    setAssessment(prev => ({ ...prev, testParts: updatedParts }));
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    ))}
                  </Box>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <QuestionBank
            onSelectQuestion={(question) => {
              if (assessment.testParts.length === 0) {
                handleAddTestPart();
              }
              if (assessment.testParts[0].assessmentSections.length === 0) {
                handleAddSection(0);
              }
              handleAddQuestionFromBank(question, 0, 0);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default QTIAssessmentEditor; 

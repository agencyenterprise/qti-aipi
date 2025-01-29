import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { assessmentTestsApi } from '../services/api';
import { convertToQtiXml } from '../utils/qti-converter';

interface Question {
  id: string;
  type: 'multiple_choice' | 'short_answer' | 'essay' | 'true_false';
  prompt: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

const questionTypes = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'essay', label: 'Essay' },
  { value: 'true_false', label: 'True/False' },
];

export default function AssessmentCreator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const assessmentId = searchParams.get('id');

  const [assessment, setAssessment] = useState<Assessment>({
    id: assessmentId || Date.now().toString(),
    title: '',
    description: '',
    questions: [],
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch assessment if editing
  const { data: fetchedAssessment, isLoading } = useQuery(
    ['assessment', assessmentId],
    () => assessmentTestsApi.getById(assessmentId!),
    {
      enabled: !!assessmentId,
      onError: (error: Error) => {
        setSnackbar({
          open: true,
          message: error.message,
          severity: 'error',
        });
      },
    }
  );

  // Create/Update mutation
  const { mutate: saveAssessment, isLoading: isSaving } = useMutation(
    async (xml: string) => {
      if (assessmentId) {
        return assessmentTestsApi.update(assessmentId, xml);
      }
      return assessmentTestsApi.create(xml);
    },
    {
      onSuccess: () => {
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
    if (fetchedAssessment) {
      setAssessment(fetchedAssessment);
    }
  }, [fetchedAssessment]);

  const handleSave = async () => {
    try {
      const assessmentData = {
        id: assessment.id,
        title: assessment.title,
        description: assessment.description,
        questions: assessment.questions
      };
      
      const xmlString = convertToQtiXml(assessmentData);
      console.log('XML to be sent:', xmlString); // Debug log
      await saveAssessment(xmlString);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to save assessment',
        severity: 'error'
      });
    }
  };

  const handleAddQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      prompt: '',
      points: 1,
      options: type === 'multiple_choice' ? ['', '', '', ''] : undefined,
      correctAnswer: type === 'true_false' ? 'true' : '',
    };
    setAssessment({
      ...assessment,
      questions: [...assessment.questions, newQuestion],
    });
    setAnchorEl(null);
  };

  const handleQuestionChange = (
    questionId: string,
    field: keyof Question,
    value: string | number | string[] | undefined
  ) => {
    setAssessment({
      ...assessment,
      questions: assessment.questions.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      ),
    });
  };

  const handleOptionChange = (questionId: string, index: number, value: string) => {
    setAssessment({
      ...assessment,
      questions: assessment.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((opt, i) => (i === index ? value : opt)),
            }
          : q
      ),
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const questions = Array.from(assessment.questions);
    const [reorderedQuestion] = questions.splice(result.source.index, 1);
    questions.splice(result.destination.index, 0, reorderedQuestion);

    setAssessment({
      ...assessment,
      questions,
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    setAssessment({
      ...assessment,
      questions: assessment.questions.filter((q) => q.id !== questionId),
    });
    setSelectedQuestionId(null);
    setAnchorEl(null);
  };

  const renderQuestionEditor = (question: Question) => {
    return (
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Question Prompt"
          value={question.prompt}
          onChange={(e) => handleQuestionChange(question.id, 'prompt', e.target.value)}
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />
        {question.type === 'multiple_choice' && question.options && (
          <Box sx={{ mb: 2 }}>
            {question.options.map((option, index) => (
              <TextField
                key={index}
                fullWidth
                label={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(question.id, index, e.target.value)}
                sx={{ mb: 1 }}
              />
            ))}
            <FormControl fullWidth>
              <InputLabel>Correct Answer</InputLabel>
              <Select
                value={question.correctAnswer || ''}
                onChange={(e) => handleQuestionChange(question.id, 'correctAnswer', e.target.value)}
                label="Correct Answer"
              >
                {question.options.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option || `Option ${index + 1}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
        {question.type === 'true_false' && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Correct Answer</InputLabel>
            <Select
              value={question.correctAnswer}
              onChange={(e) => handleQuestionChange(question.id, 'correctAnswer', e.target.value)}
              label="Correct Answer"
            >
              <MenuItem value="true">True</MenuItem>
              <MenuItem value="false">False</MenuItem>
            </Select>
          </FormControl>
        )}
        {(question.type === 'short_answer' || question.type === 'essay') && (
          <TextField
            fullWidth
            label="Sample Answer"
            value={question.correctAnswer || ''}
            onChange={(e) => handleQuestionChange(question.id, 'correctAnswer', e.target.value)}
            multiline
            rows={question.type === 'essay' ? 4 : 2}
            sx={{ mb: 2 }}
          />
        )}
        <TextField
          type="number"
          label="Points"
          value={question.points}
          onChange={(e) => handleQuestionChange(question.id, 'points', parseInt(e.target.value, 10))}
          InputProps={{ inputProps: { min: 1 } }}
        />
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Typography>Loading assessment...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs>
            <Typography variant="h4" component="h1">
              {assessmentId ? 'Edit Assessment' : 'Create Assessment'}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save & Exit'}
            </Button>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, mb: 3 }}>
          <TextField
            fullWidth
            label="Assessment Title"
            value={assessment.title}
            onChange={(e) => setAssessment({ ...assessment, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={assessment.description}
            onChange={(e) => setAssessment({ ...assessment, description: e.target.value })}
            multiline
            rows={3}
          />
        </Paper>

        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            Add Question
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {questionTypes.map((type) => (
              <MenuItem
                key={type.value}
                onClick={() => handleAddQuestion(type.value as Question['type'])}
              >
                {type.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {assessment.questions.map((question, index) => (
                  <Draggable
                    key={question.id}
                    draggableId={question.id}
                    index={index}
                  >
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{ mb: 2 }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <div {...provided.dragHandleProps}>
                              <DragIndicatorIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            </div>
                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                              Question {index + 1} - {questionTypes.find(t => t.value === question.type)?.label}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                setSelectedQuestionId(question.id);
                                setAnchorEl(e.currentTarget);
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                          <Divider sx={{ mb: 2 }} />
                          {renderQuestionEditor(question)}
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl) && Boolean(selectedQuestionId)}
          onClose={() => {
            setAnchorEl(null);
            setSelectedQuestionId(null);
          }}
        >
          <MenuItem
            onClick={() => selectedQuestionId && handleDeleteQuestion(selectedQuestionId)}
            sx={{ color: 'error.main' }}
          >
            Delete Question
          </MenuItem>
        </Menu>

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
      </Box>
    </Container>
  );
} 

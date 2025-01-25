import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { RootState } from '../store';

interface Question {
  id: string;
  type: string;
  content: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number;
  passingScore?: number;
}

const AssessmentEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentAssessment, loading } = useSelector(
    (state: RootState) => state.assessments
  );

  const [assessment, setAssessment] = useState<Assessment>({
    id: '',
    title: '',
    description: '',
    questions: [],
    timeLimit: 60,
    passingScore: 70,
  });

  const [questionBankOpen, setQuestionBankOpen] = useState(false);

  useEffect(() => {
    if (id) {
      // TODO: Fetch assessment data
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentAssessment) {
      setAssessment(currentAssessment);
    }
  }, [currentAssessment]);

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Save assessment:', assessment);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const questions = Array.from(assessment.questions);
    const [reorderedQuestion] = questions.splice(result.source.index, 1);
    questions.splice(result.destination.index, 0, reorderedQuestion);

    setAssessment({ ...assessment, questions });
  };

  const handleRemoveQuestion = (index: number) => {
    const questions = [...assessment.questions];
    questions.splice(index, 1);
    setAssessment({ ...assessment, questions });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">
          {id ? 'Edit Assessment' : 'Create Assessment'}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <TextField
              fullWidth
              label="Title"
              value={assessment.title}
              onChange={(e) =>
                setAssessment({ ...assessment, title: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={assessment.description}
              onChange={(e) =>
                setAssessment({ ...assessment, description: e.target.value })
              }
            />
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">Questions</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setQuestionBankOpen(true)}
              >
                Add Question
              </Button>
            </Box>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <List {...provided.droppableProps} ref={provided.innerRef}>
                    {assessment.questions.map((question, index) => (
                      <Draggable
                        key={question.id}
                        draggableId={question.id}
                        index={index}
                      >
                        {(provided) => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <DragIcon sx={{ mr: 2, color: 'text.secondary' }} />
                            <ListItemText
                              primary={question.content}
                              secondary={`${question.type} - ${question.points} points`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                color="error"
                                onClick={() => handleRemoveQuestion(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </DragDropContext>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Settings
            </Typography>
            <TextField
              fullWidth
              type="number"
              label="Time Limit (minutes)"
              value={assessment.timeLimit}
              onChange={(e) =>
                setAssessment({
                  ...assessment,
                  timeLimit: parseInt(e.target.value),
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="number"
              label="Passing Score (%)"
              value={assessment.passingScore}
              onChange={(e) =>
                setAssessment({
                  ...assessment,
                  passingScore: parseInt(e.target.value),
                })
              }
            />
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={questionBankOpen}
        onClose={() => setQuestionBankOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Questions</DialogTitle>
        <DialogContent>
          {/* TODO: Implement question bank selection */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuestionBankOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary">
            Add Selected
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentEditor; 
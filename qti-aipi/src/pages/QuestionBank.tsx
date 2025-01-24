import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addQuestion, deleteQuestion } from '../store/slices/questionBankSlice';
import { QuestionType, questionTypeLabels } from '../components/question-types';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { RootState } from '../store';

interface QuestionForm {
  title: string;
  type: QuestionType;
  prompt: string;
}

export default function QuestionBank() {
  const dispatch = useDispatch();
  const questions = useSelector((state: RootState) => state.questionBank.questions);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [newQuestion, setNewQuestion] = useState<QuestionForm>({
    title: '',
    type: 'multipleChoice',
    prompt: '',
  });

  const handleOpenDialog = (question?: any) => {
    if (question) {
      setSelectedQuestion(question);
      setNewQuestion({
        title: question.title || '',
        type: question.type || 'multipleChoice',
        prompt: question.prompt || '',
      });
    } else {
      setSelectedQuestion(null);
      setNewQuestion({
        title: '',
        type: 'multipleChoice',
        prompt: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedQuestion(null);
    setNewQuestion({
      title: '',
      type: 'multipleChoice',
      prompt: '',
    });
  };

  const handleSaveQuestion = () => {
    const questionData = {
      identifier: selectedQuestion?.identifier || `q-${Date.now()}`,
      title: newQuestion.title,
      type: newQuestion.type,
      prompt: newQuestion.prompt,
    };

    dispatch(addQuestion(questionData));
    handleCloseDialog();
  };

  const handleDeleteQuestion = (identifier: string) => {
    dispatch(deleteQuestion(identifier));
  };

  const handleTypeChange = (event: SelectChangeEvent<QuestionType>) => {
    setNewQuestion({
      ...newQuestion,
      type: event.target.value as QuestionType,
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Question Bank</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Question
        </Button>
      </Box>

      <Paper>
        <List>
          {questions.map((question) => (
            <ListItem key={question.identifier}>
              <ListItemText
                primary={question.title}
                secondary={`Type: ${questionTypeLabels[question.type as QuestionType] || question.type}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleOpenDialog(question)} sx={{ mr: 1 }}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDeleteQuestion(question.identifier)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedQuestion ? 'Edit Question' : 'Add New Question'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Question Title"
            value={newQuestion.title}
            onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Question Type</InputLabel>
            <Select
              value={newQuestion.type}
              onChange={handleTypeChange}
              label="Question Type"
            >
              {Object.entries(questionTypeLabels).map(([type, label]) => (
                <MenuItem key={type} value={type}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Question Prompt"
            value={newQuestion.prompt}
            onChange={(e) => setNewQuestion({ ...newQuestion, prompt: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveQuestion} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 
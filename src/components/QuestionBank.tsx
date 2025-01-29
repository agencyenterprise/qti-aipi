import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
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
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';

interface Question {
  id: string;
  type: 'choiceInteraction' | 'textEntryInteraction' | 'inlineChoiceInteraction' | 'matchInteraction';
  title: string;
  content: string;
  points: number;
  options?: string[];
  correctAnswer?: string;
}

interface QuestionBankProps {
  onSelectQuestion: (question: Question) => void;
}

const QuestionBank: React.FC<QuestionBankProps> = ({ onSelectQuestion }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: '',
    type: 'choiceInteraction',
    title: '',
    content: '',
    points: 1,
    options: [],
    correctAnswer: '',
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingQuestion(null);
    setNewQuestion({
      id: '',
      type: 'choiceInteraction',
      title: '',
      content: '',
      points: 1,
      options: [],
      correctAnswer: '',
    });
  };

  const handleSaveQuestion = () => {
    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === editingQuestion.id ? newQuestion : q));
    } else {
      setQuestions([...questions, { ...newQuestion, id: Date.now().toString() }]);
    }
    handleCloseDialog();
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestion(question);
    setDialogOpen(true);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleDuplicateQuestion = (question: Question) => {
    const duplicate = {
      ...question,
      id: Date.now().toString(),
      title: `Copy of ${question.title}`,
    };
    setQuestions([...questions, duplicate]);
  };

  return (
    <Box>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Question Bank</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Add Question
          </Button>
        </Box>

        <List>
          {questions.map((question) => (
            <ListItem key={question.id}>
              <ListItemText
                primary={question.title}
                secondary={`Type: ${question.type} | Points: ${question.points}`}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => onSelectQuestion(question)}>
                  <CopyIcon />
                </IconButton>
                <IconButton onClick={() => handleEditQuestion(question)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteQuestion(question.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingQuestion ? 'Edit Question' : 'Add Question'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Question Title"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Question Type</InputLabel>
                <Select
                  value={newQuestion.type}
                  label="Question Type"
                  onChange={(e) => setNewQuestion({
                    ...newQuestion,
                    type: e.target.value as Question['type']
                  })}
                >
                  <MenuItem value="choiceInteraction">Multiple Choice</MenuItem>
                  <MenuItem value="textEntryInteraction">Text Entry</MenuItem>
                  <MenuItem value="inlineChoiceInteraction">Inline Choice</MenuItem>
                  <MenuItem value="matchInteraction">Matching</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Points"
                value={newQuestion.points}
                onChange={(e) => setNewQuestion({
                  ...newQuestion,
                  points: parseInt(e.target.value) || 1
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Question Content"
                value={newQuestion.content}
                onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
              />
            </Grid>
          </Grid>
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
};

export default QuestionBank; 
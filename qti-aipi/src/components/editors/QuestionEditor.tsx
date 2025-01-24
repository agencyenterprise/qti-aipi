import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Question } from '../../types/question';

interface QuestionEditorProps {
  question: Question;
  onChange: (question: Question) => void;
  onDelete: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onChange,
  onDelete,
}) => {
  const [questionText, setQuestionText] = useState(question.prompt || '');
  const [options, setOptions] = useState(question.choices || []);
  const [correctAnswer, setCorrectAnswer] = useState(question.correctResponse || '');
  const [points, setPoints] = useState(question.points || 1);

  const handleQuestionTextChange = (value: string) => {
    setQuestionText(value);
    onChange({
      ...question,
      prompt: value,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    onChange({
      ...question,
      choices: newOptions,
    });
  };

  const handleAddOption = () => {
    const newOptions = [...options, ''];
    setOptions(newOptions);
    onChange({
      ...question,
      choices: newOptions,
    });
  };

  const handleDeleteOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    onChange({
      ...question,
      choices: newOptions,
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newOptions = Array.from(options);
    const [reorderedItem] = newOptions.splice(result.source.index, 1);
    newOptions.splice(result.destination.index, 0, reorderedItem);

    setOptions(newOptions);
    onChange({
      ...question,
      choices: newOptions,
    });
  };

  const handlePointsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPoints = parseInt(event.target.value) || 1;
    setPoints(newPoints);
    onChange({
      ...question,
      points: newPoints,
    });
  };

  const handleCorrectAnswerChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setCorrectAnswer(value);
    onChange({
      ...question,
      correctResponse: value,
    });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Question
        </Typography>
        <ReactQuill
          value={questionText}
          onChange={handleQuestionTextChange}
          theme="snow"
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image', 'formula'],
              ['clean'],
            ],
          }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Options
        </Typography>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="options">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {options.map((option, index) => (
                  <Draggable
                    key={index.toString()}
                    draggableId={index.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{ mb: 2 }}
                      >
                        <Grid item>
                          <IconButton {...provided.dragHandleProps}>
                            <DragIcon />
                          </IconButton>
                        </Grid>
                        <Grid item xs>
                          <TextField
                            fullWidth
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                          />
                        </Grid>
                        <Grid item>
                          <IconButton
                            onClick={() => handleDeleteOption(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddOption}
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Add Option
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Correct Answer</InputLabel>
            <Select
              value={correctAnswer}
              onChange={handleCorrectAnswerChange}
              label="Correct Answer"
            >
              {options.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Points"
            value={points}
            onChange={handlePointsChange}
            inputProps={{ min: 1 }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onDelete}
        >
          Delete Question
        </Button>
      </Box>
    </Paper>
  );
};

export default QuestionEditor; 
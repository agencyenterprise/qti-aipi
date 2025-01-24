import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  Grid,
  Button,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AssessmentSection } from '../../types/assessment-test';
import { QuestionEditor } from './QuestionEditor';

interface SectionEditorProps {
  section: AssessmentSection;
  onUpdate: (section: AssessmentSection) => void;
  onDelete: () => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  onUpdate,
  onDelete,
}) => {
  const handleChange = (field: keyof AssessmentSection, value: any) => {
    onUpdate({
      ...section,
      [field]: value,
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(section.items);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdate({
      ...section,
      items,
    });
  };

  const handleDeleteQuestion = (index: number) => {
    const newItems = section.items.filter((_, i) => i !== index);
    onUpdate({
      ...section,
      items: newItems,
    });
  };

  const handleUpdateQuestion = (index: number, updatedQuestion: any) => {
    const newItems = [...section.items];
    newItems[index] = updatedQuestion;
    onUpdate({
      ...section,
      items: newItems,
    });
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Section Title"
            value={section.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Navigation Mode</InputLabel>
            <Select
              value={section.navigationMode || 'linear'}
              onChange={(e) => handleChange('navigationMode', e.target.value)}
              label="Navigation Mode"
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
              value={section.submissionMode || 'individual'}
              onChange={(e) => handleChange('submissionMode', e.target.value)}
              label="Submission Mode"
            >
              <MenuItem value="individual">Individual</MenuItem>
              <MenuItem value="simultaneous">Simultaneous</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={section.visible}
                onChange={(e) => handleChange('visible', e.target.checked)}
              />
            }
            label="Visible to Students"
          />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Questions
      </Typography>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {section.items.map((question, index) => (
                <Draggable
                  key={question.identifier}
                  draggableId={question.identifier}
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
                          <IconButton {...provided.dragHandleProps}>
                            <DragIcon />
                          </IconButton>
                          <Typography variant="subtitle1" sx={{ flex: 1 }}>
                            Question {index + 1}
                          </Typography>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteQuestion(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <QuestionEditor
                          question={question}
                          onChange={(updatedQuestion) =>
                            handleUpdateQuestion(index, updatedQuestion)
                          }
                          onDelete={() => handleDeleteQuestion(index)}
                        />
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

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onDelete}
        >
          Delete Section
        </Button>
      </Box>
    </Box>
  );
};

export default SectionEditor; 
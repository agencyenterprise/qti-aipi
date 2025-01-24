import { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  TextField,
  IconButton,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface Choice {
  identifier: string;
  content: string;
  isCorrect: boolean;
}

interface MultipleChoiceValue {
  prompt: string;
  choices: Choice[];
  correctResponse: string;
}

interface MultipleChoiceQuestionProps {
  value: MultipleChoiceValue;
  onChange: (value: MultipleChoiceValue) => void;
  editable?: boolean;
}

export default function MultipleChoiceQuestion({
  value,
  onChange,
  editable = true,
}: MultipleChoiceQuestionProps) {
  const [selectedChoice, setSelectedChoice] = useState<string>('');

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      prompt: event.target.value,
    });
  };

  const handleChoiceChange = (index: number, content: string) => {
    const newChoices = [...value.choices];
    newChoices[index] = {
      ...newChoices[index],
      content,
    };
    onChange({
      ...value,
      choices: newChoices,
    });
  };

  const handleAddChoice = () => {
    const newChoice: Choice = {
      identifier: `choice-${value.choices.length + 1}`,
      content: '',
      isCorrect: false,
    };
    onChange({
      ...value,
      choices: [...value.choices, newChoice],
    });
  };

  const handleDeleteChoice = (index: number) => {
    const newChoices = value.choices.filter((_, i) => i !== index);
    onChange({
      ...value,
      choices: newChoices,
    });
  };

  const handleCorrectAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const choiceId = event.target.value;
    setSelectedChoice(choiceId);
    onChange({
      ...value,
      correctResponse: choiceId,
      choices: value.choices.map((choice) => ({
        ...choice,
        isCorrect: choice.identifier === choiceId,
      })),
    });
  };

  return (
    <Box>
      {editable ? (
        <TextField
          fullWidth
          label="Question Prompt"
          value={value.prompt}
          onChange={handlePromptChange}
          multiline
          rows={2}
          margin="normal"
        />
      ) : (
        <Typography variant="body1" gutterBottom>
          {value.prompt}
        </Typography>
      )}

      <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
        <FormLabel component="legend">Choices</FormLabel>
        <RadioGroup
          value={editable ? value.correctResponse : selectedChoice}
          onChange={handleCorrectAnswerChange}
        >
          {value.choices.map((choice, index) => (
            <Box
              key={choice.identifier}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                my: 1,
              }}
            >
              <Radio value={choice.identifier} />
              {editable ? (
                <TextField
                  fullWidth
                  value={choice.content}
                  onChange={(e) => handleChoiceChange(index, e.target.value)}
                  placeholder={`Choice ${index + 1}`}
                />
              ) : (
                <Typography>{choice.content}</Typography>
              )}
              {editable && (
                <IconButton
                  onClick={() => handleDeleteChoice(index)}
                  disabled={value.choices.length <= 2}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
        </RadioGroup>
        {editable && (
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddChoice}
            sx={{ mt: 1 }}
          >
            Add Choice
          </Button>
        )}
      </FormControl>
    </Box>
  );
} 
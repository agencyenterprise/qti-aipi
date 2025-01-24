import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  Chip,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

interface TextEntryQuestionProps {
  value: {
    prompt: string;
    correctResponses: string[];
    caseSensitive: boolean;
  };
  onChange: (value: TextEntryValue) => void;
  editable?: boolean;
}

interface TextEntryValue {
  prompt: string;
  correctResponses: string[];
  caseSensitive: boolean;
}

export default function TextEntryQuestion({
  value,
  onChange,
  editable = true,
}: TextEntryQuestionProps) {
  const [newResponse, setNewResponse] = useState('');

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      prompt: event.target.value,
    });
  };

  const handleAddResponse = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && newResponse.trim()) {
      onChange({
        ...value,
        correctResponses: [...value.correctResponses, newResponse.trim()],
      });
      setNewResponse('');
    }
  };

  const handleDeleteResponse = (index: number) => {
    onChange({
      ...value,
      correctResponses: value.correctResponses.filter((_, i) => i !== index),
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
        <FormLabel component="legend">Correct Answers</FormLabel>
        <Box sx={{ mt: 1 }}>
          {value.correctResponses.map((response, index) => (
            <Chip
              key={index}
              label={response}
              onDelete={editable ? () => handleDeleteResponse(index) : undefined}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
        {editable && (
          <TextField
            fullWidth
            label="Add correct answer (press Enter)"
            value={newResponse}
            onChange={(e) => setNewResponse(e.target.value)}
            onKeyPress={handleAddResponse}
            margin="normal"
            helperText="Press Enter to add a new correct answer"
          />
        )}
      </FormControl>

      {!editable && (
        <TextField
          fullWidth
          label="Your Answer"
          margin="normal"
          variant="outlined"
        />
      )}
    </Box>
  );
} 
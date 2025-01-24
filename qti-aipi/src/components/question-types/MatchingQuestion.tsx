import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  IconButton,
  Button,
  Paper,
  Grid,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface MatchPair {
  id: string;
  premise: string;
  response: string;
}

interface MatchingValue {
  prompt: string;
  pairs: MatchPair[];
  shuffleOptions: boolean;
}

interface MatchingQuestionProps {
  value: MatchingValue;
  onChange: (value: MatchingValue) => void;
  editable?: boolean;
}

interface StudentMatch {
  premiseId: string;
  selectedResponseId: string;
}

export default function MatchingQuestion({
  value,
  onChange,
  editable = true,
}: MatchingQuestionProps) {
  const [studentMatches, setStudentMatches] = useState<StudentMatch[]>([]);

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      prompt: event.target.value,
    });
  };

  const handlePairChange = (index: number, field: 'premise' | 'response', content: string) => {
    const newPairs = [...value.pairs];
    newPairs[index] = {
      ...newPairs[index],
      [field]: content,
    };
    onChange({
      ...value,
      pairs: newPairs,
    });
  };

  const handleAddPair = () => {
    const newPair: MatchPair = {
      id: `pair-${value.pairs.length + 1}`,
      premise: '',
      response: '',
    };
    onChange({
      ...value,
      pairs: [...value.pairs, newPair],
    });
  };

  const handleDeletePair = (index: number) => {
    const newPairs = value.pairs.filter((_, i) => i !== index);
    onChange({
      ...value,
      pairs: newPairs,
    });
  };

  const handleStudentMatch = (premiseId: string, event: SelectChangeEvent) => {
    const selectedResponseId = event.target.value;
    setStudentMatches((prev) => {
      const existing = prev.find((match) => match.premiseId === premiseId);
      if (existing) {
        return prev.map((match) =>
          match.premiseId === premiseId
            ? { ...match, selectedResponseId }
            : match
        );
      }
      return [...prev, { premiseId, selectedResponseId }];
    });
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const responses = value.shuffleOptions
    ? shuffleArray(value.pairs.map((pair) => ({ id: pair.id, text: pair.response })))
    : value.pairs.map((pair) => ({ id: pair.id, text: pair.response }));

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
        <FormLabel component="legend">Matching Pairs</FormLabel>
        <Box sx={{ mt: 2 }}>
          {value.pairs.map((pair, index) => (
            <Paper key={pair.id} sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={editable ? 5 : 6}>
                  {editable ? (
                    <TextField
                      fullWidth
                      label="Premise"
                      value={pair.premise}
                      onChange={(e) => handlePairChange(index, 'premise', e.target.value)}
                    />
                  ) : (
                    <Typography>{pair.premise}</Typography>
                  )}
                </Grid>
                <Grid item xs={editable ? 5 : 6}>
                  {editable ? (
                    <TextField
                      fullWidth
                      label="Response"
                      value={pair.response}
                      onChange={(e) => handlePairChange(index, 'response', e.target.value)}
                    />
                  ) : (
                    <Select
                      fullWidth
                      value={studentMatches.find((match) => match.premiseId === pair.id)?.selectedResponseId || ''}
                      onChange={(e) => handleStudentMatch(pair.id, e)}
                    >
                      <MenuItem value="">
                        <em>Select a match</em>
                      </MenuItem>
                      {responses.map((response) => (
                        <MenuItem key={response.id} value={response.id}>
                          {response.text}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </Grid>
                {editable && (
                  <Grid item xs={2}>
                    <IconButton
                      onClick={() => handleDeletePair(index)}
                      disabled={value.pairs.length <= 2}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </Paper>
          ))}
        </Box>
        {editable && (
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddPair}
            sx={{ mt: 1 }}
          >
            Add Matching Pair
          </Button>
        )}
      </FormControl>
    </Box>
  );
} 
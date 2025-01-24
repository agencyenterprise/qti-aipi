import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  Slider,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

interface ExtendedTextQuestionProps {
  value: {
    prompt: string;
    maxLength: number;
    expectedLength: number;
    format: 'plain' | 'preformatted' | 'xhtml';
  };
  onChange: (value: ExtendedTextValue) => void;
  editable?: boolean;
}

interface ExtendedTextValue {
  prompt: string;
  maxLength: number;
  expectedLength: number;
  format: 'plain' | 'preformatted' | 'xhtml';
}

export default function ExtendedTextQuestion({
  value,
  onChange,
  editable = true,
}: ExtendedTextQuestionProps) {
  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      prompt: event.target.value,
    });
  };

  const handleMaxLengthChange = (_: Event, newValue: number | number[]) => {
    onChange({
      ...value,
      maxLength: newValue as number,
    });
  };

  const handleExpectedLengthChange = (_: Event, newValue: number | number[]) => {
    onChange({
      ...value,
      expectedLength: newValue as number,
    });
  };

  const handleFormatChange = (event: SelectChangeEvent<'plain' | 'preformatted' | 'xhtml'>) => {
    onChange({
      ...value,
      format: event.target.value as 'plain' | 'preformatted' | 'xhtml',
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

      {editable && (
        <Box sx={{ mt: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel>Maximum Length (characters)</FormLabel>
            <Slider
              value={value.maxLength}
              onChange={handleMaxLengthChange}
              min={100}
              max={10000}
              step={100}
              marks={[
                { value: 100, label: '100' },
                { value: 5000, label: '5000' },
                { value: 10000, label: '10000' },
              ]}
              valueLabelDisplay="auto"
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel>Expected Length (characters)</FormLabel>
            <Slider
              value={value.expectedLength}
              onChange={handleExpectedLengthChange}
              min={50}
              max={value.maxLength}
              step={50}
              marks={[
                { value: 50, label: '50' },
                { value: value.maxLength / 2, label: `${value.maxLength / 2}` },
                { value: value.maxLength, label: `${value.maxLength}` },
              ]}
              valueLabelDisplay="auto"
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Text Format</InputLabel>
            <Select value={value.format} onChange={handleFormatChange} label="Text Format">
              <MenuItem value="plain">Plain Text</MenuItem>
              <MenuItem value="preformatted">Preformatted</MenuItem>
              <MenuItem value="xhtml">XHTML</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      {!editable && (
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Your Answer"
          margin="normal"
          variant="outlined"
          inputProps={{
            maxLength: value.maxLength,
          }}
          helperText={`Expected length: ${value.expectedLength} characters. Maximum length: ${value.maxLength} characters.`}
        />
      )}
    </Box>
  );
} 
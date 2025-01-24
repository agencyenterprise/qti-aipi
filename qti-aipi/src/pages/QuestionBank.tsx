import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import { setFilters } from '../store/slices/questionsSlice';
import { QuestionEditor } from '../components/editors/QuestionEditor';

const QuestionBank = () => {
  const dispatch = useDispatch();
  const { items: questions, filters } = useSelector((state: RootState) => state.questions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  const handleSearch = () => {
    dispatch(setFilters({
      ...filters,
      search: searchTerm,
    }));
  };

  const handleFilterChange = () => {
    dispatch(setFilters({
      ...filters,
      type: selectedType || undefined,
      difficulty: selectedDifficulty as 'easy' | 'medium' | 'hard' | undefined,
    }));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Question Bank
        </Typography>
        <Typography color="text.secondary">
          Manage and organize your assessment questions
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Question Type</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              label="Question Type"
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
              <MenuItem value="short-answer">Short Answer</MenuItem>
              <MenuItem value="essay">Essay</MenuItem>
              <MenuItem value="matching">Matching</MenuItem>
              <MenuItem value="hotspot">Hotspot</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              label="Difficulty"
            >
              <MenuItem value="">All Difficulties</MenuItem>
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={handleFilterChange}
        >
          Apply Filters
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* TODO: Implement new question creation */}}
        >
          New Question
        </Button>
      </Box>

      <Grid container spacing={3}>
        {questions.map((question) => (
          <Grid item xs={12} key={question.identifier}>
            <Card>
              <CardContent>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ flex: 1 }}>
                    {question.title}
                  </Typography>
                  <Chip
                    label={question.type}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    label={question.metadata?.difficulty || 'medium'}
                    color={
                      question.metadata?.difficulty === 'easy'
                        ? 'success'
                        : question.metadata?.difficulty === 'hard'
                        ? 'error'
                        : 'warning'
                    }
                    size="small"
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  dangerouslySetInnerHTML={{ __html: question.prompt }}
                  sx={{ mb: 2 }}
                />
                {question.metadata?.tags && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {question.metadata.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default QuestionBank; 
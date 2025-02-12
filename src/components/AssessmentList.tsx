'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
  Stack,
  Chip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import type { QTIAssessmentTest } from '@/types/qti';

export default function AssessmentList() {
  const router = useRouter();
  const [localTests, setLocalTests] = useState<QTIAssessmentTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTests = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching tests...');
      const response = await apiClient.get('/assessment-tests');
      console.log('Raw API response:', response);
      console.log('Response data:', response.data);
      setLocalTests(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error('Error fetching assessments:', err);
      console.error('Error response:', err.response);
      setError(err?.response?.data?.error || 'Failed to fetch assessments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleDelete = async (identifier: string) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    try {
      await apiClient.delete(`/assessment-tests/${identifier}`);
      await fetchTests();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to delete assessment');
      console.error('Error deleting assessment:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <TextField
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchTests()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Button
            variant="outlined"
            onClick={fetchTests}
            sx={{ ml: 1 }}
          >
            Refresh
          </Button>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/assessments/create')}
        >
          Create Assessment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {!localTests || localTests.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" textAlign="center">
              No assessments found. Create one to get started!
            </Typography>
          </Grid>
        ) : (
          localTests.map((test) => (
            <Grid item xs={12} sm={6} md={4} key={test.identifier}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {test.title}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip
                      icon={<AssignmentIcon />}
                      label={`${test['qti-test-part'][0]['qti-assessment-section'].length} Sections`}
                      size="small"
                    />
                    <Chip
                      label={test['qti-test-part'][0].navigationMode}
                      size="small"
                    />
                  </Stack>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                      size="small"
                      onClick={() => router.push(`/assessments/${test.identifier}/edit`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(test.identifier)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
} 
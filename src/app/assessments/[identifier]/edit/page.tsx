'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import AssessmentTestForm from '@/components/AssessmentTestForm';
import apiClient from '@/lib/api/client';
import type { QTIAssessmentTest } from '@/types/qti';

export default function EditAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const [test, setTest] = useState<QTIAssessmentTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await apiClient.get(`/assessment-tests/${params.identifier}`);
        setTest(response.data);
      } catch (err: any) {
        setError('Failed to load assessment test');
        console.error('Error loading test:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [params.identifier]);

  const handleSubmit = async (values: QTIAssessmentTest) => {
    try {
      await apiClient.put(`/assessment-tests/${params.identifier}`, values);
      router.push('/assessments');
    } catch (err: any) {
      throw new Error('Failed to update assessment test');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !test) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography color="error">{error || 'Assessment test not found'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Navigation />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          pt: { xs: 8, sm: 9 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Assessment Test
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Modify the QTI assessment test
          </Typography>

          <AssessmentTestForm
            initialValues={test}
            onSubmit={handleSubmit}
          />
        </Container>
      </Box>
    </Box>
  );
} 
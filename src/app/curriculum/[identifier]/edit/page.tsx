'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import CurriculumForm from '../../CurriculumForm';
import { curriculumService } from '@/lib/api/services';
import type { QTICurriculum } from '@/types/qti';

export default function EditCurriculumPage() {
  const params = useParams();
  const router = useRouter();
  const [curriculum, setCurriculum] = useState<QTICurriculum | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const response = await curriculumService.getById(params.identifier as string);
        setCurriculum(response.data);
      } catch (err) {
        setError('Failed to load curriculum');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculum();
  }, [params.identifier]);

  const handleSubmit = async (values: QTICurriculum) => {
    try {
      await curriculumService.update(params.identifier as string, values);
      router.push('/curriculum');
    } catch (err) {
      throw new Error('Failed to update curriculum');
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

  if (error || !curriculum) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography color="error">{error || 'Curriculum not found'}</Typography>
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
            Edit Curriculum
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Modify the educational curriculum
          </Typography>

          <CurriculumForm
            initialValues={curriculum}
            onSubmit={handleSubmit}
          />
        </Container>
      </Box>
    </Box>
  );
} 
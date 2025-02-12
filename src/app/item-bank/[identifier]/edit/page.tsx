'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ItemForm from '../../ItemForm';
import { assessmentItemService } from '@/lib/api/services';
import type { QTIAssessmentItem } from '@/types/qti';

export default function EditItemPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<QTIAssessmentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await assessmentItemService.getById(params.identifier as string);
        setItem(response.data);
      } catch (err) {
        setError('Failed to load item');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [params.identifier]);

  const handleSubmit = async (values: QTIAssessmentItem) => {
    try {
      await assessmentItemService.update(params.identifier as string, values);
      router.push('/item-bank');
    } catch (err) {
      throw new Error('Failed to update item');
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

  if (error || !item) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography color="error">{error || 'Item not found'}</Typography>
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
            Edit Assessment Item
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Modify the QTI assessment item
          </Typography>

          <ItemForm
            initialValues={item}
            onSubmit={handleSubmit}
          />
        </Container>
      </Box>
    </Box>
  );
} 
'use client';

import { Box, Container, Typography } from '@mui/material';
import Navigation from '@/components/Navigation';
import AssessmentForm from '../AssessmentForm';

export default function CreateAssessmentPage() {
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
            Create Assessment Test
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Create a new QTI 3.0 compliant assessment test
          </Typography>

          <AssessmentForm />
        </Container>
      </Box>
    </Box>
  );
} 
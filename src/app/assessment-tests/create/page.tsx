'use client';

import { Box, Container, Typography } from '@mui/material';
import Navigation from '@/components/Navigation';
import AssessmentTestForm from '@/components/AssessmentTestForm';

export default function CreateAssessmentTestPage() {
  return (
    <Box>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Assessment Test
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Create a new QTI assessment test and organize its sections
        </Typography>
        <AssessmentTestForm />
      </Container>
    </Box>
  );
} 
'use client';

import { Box, Container, Typography } from '@mui/material';
import Navigation from '@/components/Navigation';
import AssessmentList from '@/components/AssessmentList';

export default function HomePage() {
  return (
    <Box>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Assessment Tests
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Manage your QTI assessment tests
        </Typography>
        <AssessmentList />
      </Container>
    </Box>
  );
} 
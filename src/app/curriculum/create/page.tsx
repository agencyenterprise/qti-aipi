'use client';

import { Box, Container, Typography } from '@mui/material';
import Navigation from '@/components/Navigation';
import CurriculumForm from '../CurriculumForm';

export default function CreateCurriculumPage() {
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
            Create Curriculum
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Create a new educational curriculum
          </Typography>

          <CurriculumForm />
        </Container>
      </Box>
    </Box>
  );
} 
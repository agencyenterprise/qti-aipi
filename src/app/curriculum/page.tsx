'use client';

import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Navigation from '@/components/Navigation';
import CurriculumList from './CurriculumList';

export default function CurriculumPage() {
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
          <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Grid item xs>
              <Typography variant="h4" component="h1">
                Curriculum
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                Manage educational curricula and align assessments
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                href="/curriculum/create"
              >
                Create Curriculum
              </Button>
            </Grid>
          </Grid>

          <CurriculumList />
        </Container>
      </Box>
    </Box>
  );
} 
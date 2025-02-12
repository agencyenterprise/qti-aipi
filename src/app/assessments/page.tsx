'use client';

import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Navigation from '@/components/Navigation';
import AssessmentList from '@/components/AssessmentList';

export default function AssessmentsPage() {
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
                Assessment Tests
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                Create and manage QTI assessment tests
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                href="/assessment-tests/create"
              >
                Create Assessment
              </Button>
            </Grid>
          </Grid>

          <AssessmentList />
        </Container>
      </Box>
    </Box>
  );
} 
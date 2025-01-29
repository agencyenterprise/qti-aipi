import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { assessmentTestsApi } from '../services/api';
import { convertToQtiXml } from '../utils/qti-converter';

interface AssessmentResponse {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published';
  createdAt: string;
  questionsCount: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [newAssessment, setNewAssessment] = useState({ title: '', description: '' });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch assessments
  const { data, isLoading, error, refetch } = useQuery<AssessmentResponse[], Error>(
    'assessments',
    () => assessmentTestsApi.search(),
    {
      onError: (error: Error) => {
        setSnackbar({
          open: true,
          message: error.message,
          severity: 'error',
        });
      },
    }
  );

  // Ensure data is an array
  const assessments = Array.isArray(data) ? data : [];

  // Create assessment mutation
  const { mutate: createAssessment, isLoading: isCreating } = useMutation(
    async (data: { title: string; description: string }) => {
      const assessment = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        questions: [],
      };
      const qtiXml = convertToQtiXml(assessment);
      return assessmentTestsApi.create(qtiXml);
    },
    {
      onSuccess: (data) => {
        setSnackbar({
          open: true,
          message: 'Assessment created successfully',
          severity: 'success',
        });
        setOpenNewDialog(false);
        setNewAssessment({ title: '', description: '' });
        navigate(`/create-assessment?id=${data.id}`);
      },
      onError: (error: Error) => {
        setSnackbar({
          open: true,
          message: error.message,
          severity: 'error',
        });
      },
    }
  );

  // Delete assessment mutation
  const { mutate: deleteAssessment } = useMutation(
    (id: string) => assessmentTestsApi.delete(id),
    {
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: 'Assessment deleted successfully',
          severity: 'success',
        });
        refetch();
      },
      onError: (error: Error) => {
        setSnackbar({
          open: true,
          message: error.message,
          severity: 'error',
        });
      },
    }
  );

  const handleCreateAssessment = () => {
    if (!newAssessment.title) return;
    createAssessment(newAssessment);
  };

  const handleDeleteAssessment = (id: string) => {
    deleteAssessment(id);
  };

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            Failed to load assessments: {error.message}
          </Alert>
        </Box>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Typography>Loading assessments...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs>
            <Typography variant="h4" component="h1">
              My Assessments
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenNewDialog(true)}
            >
              Create New Assessment
            </Button>
          </Grid>
        </Grid>

        {assessments.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No assessments found. Create your first assessment by clicking the button above.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {assessments.map((assessment) => (
              <Grid item xs={12} md={6} key={assessment.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AssessmentIcon sx={{ mr: 1 }} />
                      <Typography variant="h6" component="div">
                        {assessment.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {assessment.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip
                        label={assessment.status}
                        color={assessment.status === 'published' ? 'success' : 'default'}
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {assessment.questionsCount} questions
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Created on {assessment.createdAt}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/create-assessment?id=${assessment.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                      <ShareIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteAssessment(assessment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Dialog open={openNewDialog} onClose={() => setOpenNewDialog(false)}>
        <DialogTitle>Create New Assessment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newAssessment.title}
            onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newAssessment.description}
            onChange={(e) => setNewAssessment({ ...newAssessment, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateAssessment}
            variant="contained"
            disabled={!newAssessment.title || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 
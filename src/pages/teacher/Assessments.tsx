import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  CardActions,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import { getTeacherAssessments, createAssessment, deleteAssessment } from '../../services/api';
import { showSnackbar } from '../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Assessments: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'quiz',
    timeLimit: 30,
    totalPoints: 100
  });

  // Fetch assessments
  const { data: assessments, isLoading } = useQuery({
    queryKey: ['teacherAssessments'],
    queryFn: getTeacherAssessments
  });

  // Create assessment mutation
  const createAssessmentMutation = useMutation({
    mutationFn: createAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherAssessments'] });
      handleClose();
      dispatch(
        showSnackbar({
          message: 'Assessment created successfully',
          severity: 'success'
        })
      );
    },
    onError: (error: any) => {
      dispatch(
        showSnackbar({
          message: error.response?.data?.message || 'Error creating assessment',
          severity: 'error'
        })
      );
    }
  });

  // Delete assessment mutation
  const deleteAssessmentMutation = useMutation({
    mutationFn: deleteAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherAssessments'] });
      dispatch(
        showSnackbar({
          message: 'Assessment deleted successfully',
          severity: 'success'
        })
      );
    },
    onError: (error: any) => {
      dispatch(
        showSnackbar({
          message: error.response?.data?.message || 'Error deleting assessment',
          severity: 'error'
        })
      );
    }
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: '',
      description: '',
      type: 'quiz',
      timeLimit: 30,
      totalPoints: 100
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAssessmentMutation.mutate(formData);
  };

  const handleDelete = (assessmentId: string) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      deleteAssessmentMutation.mutate(assessmentId);
    }
  };

  const handleEdit = (assessmentId: string) => {
    navigate(`/teacher/assessments/${assessmentId}/edit`);
  };

  const handleDuplicate = (assessment: any) => {
    const { id, createdAt, updatedAt, ...assessmentData } = assessment;
    setFormData({
      ...assessmentData,
      title: `Copy of ${assessmentData.title}`
    });
    setOpen(true);
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          Assessments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Create Assessment
        </Button>
      </Box>

      <Grid container spacing={3}>
        {assessments?.data.map((assessment: any) => (
          <Grid item xs={12} sm={6} md={4} key={assessment.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {assessment.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {assessment.description}
                </Typography>
                <Typography variant="body2">
                  Type: {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}
                </Typography>
                <Typography variant="body2">
                  Time Limit: {assessment.timeLimit} minutes
                </Typography>
                <Typography variant="body2">
                  Total Points: {assessment.totalPoints}
                </Typography>
              </CardContent>
              <CardActions>
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleEdit(assessment.id)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Duplicate">
                  <IconButton onClick={() => handleDuplicate(assessment)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDelete(assessment.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {formData.title.startsWith('Copy of') ? 'Duplicate Assessment' : 'Create Assessment'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="quiz">Quiz</MenuItem>
                <MenuItem value="test">Test</MenuItem>
                <MenuItem value="homework">Homework</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Time Limit (minutes)"
              type="number"
              fullWidth
              value={formData.timeLimit}
              onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
              required
              inputProps={{ min: 1 }}
            />
            <TextField
              margin="dense"
              label="Total Points"
              type="number"
              fullWidth
              value={formData.totalPoints}
              onChange={(e) => setFormData({ ...formData, totalPoints: parseInt(e.target.value) })}
              required
              inputProps={{ min: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createAssessmentMutation.isPending}
            >
              {formData.title.startsWith('Copy of') ? 'Duplicate' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Assessments; 
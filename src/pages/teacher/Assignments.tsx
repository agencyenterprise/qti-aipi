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
  Tooltip,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Assessment as GradeIcon
} from '@mui/icons-material';
import { getTeacherAssignments, createAssignment, deleteAssignment } from '../../services/api';
import { showSnackbar } from '../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const Assignments: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    dueDate: null,
    totalPoints: 100,
    assessmentId: ''
  });

  // Fetch assignments
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['teacherAssignments'],
    queryFn: getTeacherAssignments
  });

  // Create assignment mutation
  const createAssignmentMutation = useMutation({
    mutationFn: createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherAssignments'] });
      handleClose();
      dispatch(
        showSnackbar({
          message: 'Assignment created successfully',
          severity: 'success'
        })
      );
    },
    onError: (error: any) => {
      dispatch(
        showSnackbar({
          message: error.response?.data?.message || 'Error creating assignment',
          severity: 'error'
        })
      );
    }
  });

  // Delete assignment mutation
  const deleteAssignmentMutation = useMutation({
    mutationFn: deleteAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherAssignments'] });
      dispatch(
        showSnackbar({
          message: 'Assignment deleted successfully',
          severity: 'success'
        })
      );
    },
    onError: (error: any) => {
      dispatch(
        showSnackbar({
          message: error.response?.data?.message || 'Error deleting assignment',
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
      classId: '',
      dueDate: null,
      totalPoints: 100,
      assessmentId: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAssignmentMutation.mutate(formData);
  };

  const handleDelete = (assignmentId: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      deleteAssignmentMutation.mutate(assignmentId);
    }
  };

  const handleEdit = (assignmentId: string) => {
    navigate(`/teacher/assignments/${assignmentId}/edit`);
  };

  const handleGrade = (assignmentId: string) => {
    navigate(`/teacher/assignments/${assignmentId}/grade`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'closed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          Assignments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Create Assignment
        </Button>
      </Box>

      <Grid container spacing={3}>
        {assignments?.data.map((assignment: any) => (
          <Grid item xs={12} sm={6} md={4} key={assignment.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {assignment.title}
                  </Typography>
                  <Chip
                    label={assignment.status}
                    color={getStatusColor(assignment.status)}
                    size="small"
                  />
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {assignment.description}
                </Typography>
                <Typography variant="body2">
                  Class: {assignment.class.name}
                </Typography>
                <Typography variant="body2">
                  Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  Total Points: {assignment.totalPoints}
                </Typography>
                <Typography variant="body2">
                  Submissions: {assignment.submissionCount} / {assignment.totalStudents}
                </Typography>
              </CardContent>
              <CardActions>
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleEdit(assignment.id)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Grade">
                  <IconButton onClick={() => handleGrade(assignment.id)}>
                    <GradeIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDelete(assignment.id)}>
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
          <DialogTitle>Create Assignment</DialogTitle>
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
              <InputLabel>Class</InputLabel>
              <Select
                value={formData.classId}
                label="Class"
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                required
              >
                {assignments?.classes?.map((classItem: any) => (
                  <MenuItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DateTimePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={(newValue) => setFormData({ ...formData, dueDate: newValue })}
              sx={{ mt: 2, width: '100%' }}
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
            <FormControl fullWidth margin="dense">
              <InputLabel>Assessment (Optional)</InputLabel>
              <Select
                value={formData.assessmentId}
                label="Assessment (Optional)"
                onChange={(e) => setFormData({ ...formData, assessmentId: e.target.value })}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {assignments?.assessments?.map((assessment: any) => (
                  <MenuItem key={assessment.id} value={assessment.id}>
                    {assessment.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createAssignmentMutation.isPending}
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Assignments; 
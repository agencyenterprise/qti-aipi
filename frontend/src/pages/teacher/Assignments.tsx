import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import {
  getTeacherAssignments,
  createAssignment,
  getTeacherClasses
} from '../../services/api';
import { showSnackbar } from '../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  class: {
    id: string;
    name: string;
  };
  submissionCount: number;
}

interface Class {
  id: string;
  name: string;
}

const Assignments: React.FC = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    classId: ''
  });

  // Fetch teacher assignments and classes
  const { data: assignments, isLoading: isLoadingAssignments } = useQuery({
    queryKey: ['teacherAssignments'],
    queryFn: getTeacherAssignments
  });

  const { data: classes, isLoading: isLoadingClasses } = useQuery({
    queryKey: ['teacherClasses'],
    queryFn: getTeacherClasses
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      classId: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAssignmentMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  if (isLoadingAssignments || isLoadingClasses) {
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
        {assignments?.data.map((assignment: Assignment) => (
          <Grid item xs={12} sm={6} md={4} key={assignment.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {assignment.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Class: {assignment.class.name}
                </Typography>
                <Typography variant="body2" paragraph>
                  {assignment.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={`Due: ${format(new Date(assignment.dueDate), 'MMM d, yyyy')}`}
                    color="default"
                  />
                  <Chip
                    label={`${assignment.submissionCount} submissions`}
                    color="primary"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Submissions
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Create New Assignment</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              type="date"
              label="Due Date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Class</InputLabel>
              <Select
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                label="Class"
              >
                {classes?.data.map((classItem: Class) => (
                  <MenuItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
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
              disabled={createAssignmentMutation.isPending ||
                !formData.title ||
                !formData.description ||
                !formData.dueDate ||
                !formData.classId}
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
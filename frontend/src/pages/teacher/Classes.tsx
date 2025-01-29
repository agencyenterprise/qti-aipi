import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Grid,
  Paper,
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
  IconButton,
  Box,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import { getTeacherClasses, createClass } from '../../services/api';
import { showSnackbar } from '../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';

const Classes: React.FC = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Fetch classes
  const { data: classes, isLoading } = useQuery({
    queryKey: ['teacherClasses'],
    queryFn: getTeacherClasses
  });

  // Create class mutation
  const createClassMutation = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacherClasses'] });
      handleClose();
      dispatch(
        showSnackbar({
          message: 'Class created successfully',
          severity: 'success'
        })
      );
    },
    onError: (error: any) => {
      dispatch(
        showSnackbar({
          message: error.response?.data?.message || 'Error creating class',
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
    setFormData({ name: '', description: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createClassMutation.mutate(formData);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    dispatch(
      showSnackbar({
        message: 'Class code copied to clipboard',
        severity: 'success'
      })
    );
  };

  if (isLoading) {
    return (
      <Typography>Loading...</Typography>
    );
  }

  return (
    <>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          My Classes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Create Class
        </Button>
      </Box>

      <Grid container spacing={3}>
        {classes?.data.map((classItem: any) => (
          <Grid item xs={12} sm={6} md={4} key={classItem.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {classItem.name}
                </Typography>
                {classItem.description && (
                  <Typography color="textSecondary" gutterBottom>
                    {classItem.description}
                  </Typography>
                )}
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Class Code:
                  </Typography>
                  <Chip
                    label={classItem.code}
                    size="small"
                    onDelete={() => handleCopyCode(classItem.code)}
                    deleteIcon={<ContentCopyIcon />}
                  />
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {classItem._count.enrollments} students enrolled
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Create New Class</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Class Name"
              type="text"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              margin="dense"
              name="description"
              label="Description (Optional)"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createClassMutation.isPending}
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Classes; 
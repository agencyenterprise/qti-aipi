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
  Box,
  Divider
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { getEnrolledClasses, joinClass } from '../../services/api';
import { showSnackbar } from '../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';

const Classes: React.FC = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [classCode, setClassCode] = useState('');

  // Fetch enrolled classes
  const { data: classes, isLoading } = useQuery({
    queryKey: ['enrolledClasses'],
    queryFn: getEnrolledClasses
  });

  // Join class mutation
  const joinClassMutation = useMutation({
    mutationFn: joinClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolledClasses'] });
      handleClose();
      dispatch(
        showSnackbar({
          message: 'Successfully joined class',
          severity: 'success'
        })
      );
    },
    onError: (error: any) => {
      dispatch(
        showSnackbar({
          message: error.response?.data?.message || 'Error joining class',
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
    setClassCode('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    joinClassMutation.mutate(classCode);
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
          Join Class
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
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="textSecondary">
                  Teacher: {classItem.teacher.firstName} {classItem.teacher.lastName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Join a Class</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Enter the class code provided by your teacher to join the class.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Class Code"
              type="text"
              fullWidth
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              required
              placeholder="Enter class code"
              inputProps={{ maxLength: 6 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={joinClassMutation.isPending || !classCode}
            >
              Join
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Classes; 
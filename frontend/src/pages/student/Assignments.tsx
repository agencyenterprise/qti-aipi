import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  TextField
} from '@mui/material';
import { format, isPast } from 'date-fns';
import { getStudentAssignments, submitAssignment } from '../../services/api';
import { showSnackbar } from '../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  class: {
    name: string;
  };
  submitted: boolean;
}

const Assignments: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');

  // Fetch student assignments
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['studentAssignments'],
    queryFn: getStudentAssignments
  });

  const handleSubmit = async (assignmentId: string) => {
    try {
      await submitAssignment(assignmentId, submissionText);
      handleClose();
      dispatch(
        showSnackbar({
          message: 'Assignment submitted successfully',
          severity: 'success'
        })
      );
    } catch (error: any) {
      dispatch(
        showSnackbar({
          message: error.response?.data?.message || 'Error submitting assignment',
          severity: 'error'
        })
      );
    }
  };

  const handleOpen = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionText('');
  };

  const handleClose = () => {
    setSelectedAssignment(null);
    setSubmissionText('');
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        My Assignments
      </Typography>

      <Grid container spacing={3}>
        {assignments?.data.map((assignment: Assignment) => {
          const isPastDue = isPast(new Date(assignment.dueDate));
          
          return (
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
                      color={isPastDue ? 'error' : 'default'}
                    />
                    <Chip
                      label={assignment.submitted ? 'Submitted' : 'Not Submitted'}
                      color={assignment.submitted ? 'success' : 'warning'}
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleOpen(assignment)}
                    disabled={isPastDue || assignment.submitted}
                  >
                    Submit Assignment
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog
        open={Boolean(selectedAssignment)}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Submit Assignment: {selectedAssignment?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Class: {selectedAssignment?.class.name}
          </Typography>
          <Typography variant="body2" paragraph>
            Due: {selectedAssignment?.dueDate && 
              format(new Date(selectedAssignment.dueDate), 'MMM d, yyyy')}
          </Typography>
          <TextField
            label="Your Answer"
            multiline
            rows={6}
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            fullWidth
            required
            variant="outlined"
            placeholder="Type your answer here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => selectedAssignment && handleSubmit(selectedAssignment.id)}
            variant="contained"
            disabled={!submissionText.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Assignments; 
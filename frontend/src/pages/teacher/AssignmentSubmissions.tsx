import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip
} from '@mui/material';
import { format } from 'date-fns';
import {
  getAssignmentSubmissions,
  gradeSubmission,
  getAssignmentDetails
} from '../../services/api';
import { showSnackbar } from '../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';

interface Submission {
  id: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  submittedAt: string;
  content: string;
  grade: number | null;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  class: {
    name: string;
  };
}

const AssignmentSubmissions: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState<string>('');

  // Fetch assignment details and submissions
  const { data: assignment } = useQuery<{ data: Assignment }>({
    queryKey: ['assignment', assignmentId],
    queryFn: () => getAssignmentDetails(assignmentId as string),
    enabled: !!assignmentId
  });

  const { data: submissions, isLoading } = useQuery<{ data: Submission[] }>({
    queryKey: ['submissions', assignmentId],
    queryFn: () => getAssignmentSubmissions(assignmentId as string),
    enabled: !!assignmentId
  });

  // Grade submission mutation
  const gradeMutation = useMutation({
    mutationFn: ({ submissionId, grade }: { submissionId: string; grade: number }) =>
      gradeSubmission(submissionId, grade),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', assignmentId] });
      handleClose();
      dispatch(
        showSnackbar({
          message: 'Submission graded successfully',
          severity: 'success'
        })
      );
    },
    onError: (error: any) => {
      dispatch(
        showSnackbar({
          message: error.response?.data?.message || 'Error grading submission',
          severity: 'error'
        })
      );
    }
  });

  const handleOpen = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade?.toString() || '');
  };

  const handleClose = () => {
    setSelectedSubmission(null);
    setGrade('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubmission && grade) {
      gradeMutation.mutate({
        submissionId: selectedSubmission.id,
        grade: Number(grade)
      });
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {assignment?.data.title}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Class: {assignment?.data.class.name}
        </Typography>
        <Typography variant="body1" paragraph>
          {assignment?.data.description}
        </Typography>
        <Chip
          label={`Due: ${format(new Date(assignment?.data.dueDate || ''), 'MMM d, yyyy')}`}
          color="default"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions?.data.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  {submission.student.firstName} {submission.student.lastName}
                </TableCell>
                <TableCell>{submission.student.email}</TableCell>
                <TableCell>
                  {format(new Date(submission.submittedAt), 'MMM d, yyyy HH:mm')}
                </TableCell>
                <TableCell>
                  {submission.grade !== null ? (
                    <Chip
                      label={`${submission.grade}/100`}
                      color={submission.grade >= 60 ? 'success' : 'error'}
                    />
                  ) : (
                    <Chip label="Not graded" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpen(submission)}
                  >
                    {submission.grade !== null ? 'Update Grade' : 'Grade'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Boolean(selectedSubmission)} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            Grade Submission - {selectedSubmission?.student.firstName} {selectedSubmission?.student.lastName}
          </DialogTitle>
          <DialogContent>
            <Typography variant="subtitle2" gutterBottom>
              Submitted on: {selectedSubmission?.submittedAt &&
                format(new Date(selectedSubmission.submittedAt), 'MMM d, yyyy HH:mm')}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Student Answer:
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2">
                {selectedSubmission?.content}
              </Typography>
            </Paper>
            <TextField
              label="Grade (0-100)"
              type="number"
              value={grade}
              onChange={(e) => {
                const value = Math.max(0, Math.min(100, Number(e.target.value)));
                setGrade(value.toString());
              }}
              fullWidth
              required
              inputProps={{
                min: 0,
                max: 100
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={gradeMutation.isPending || !grade}
            >
              Submit Grade
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AssignmentSubmissions; 
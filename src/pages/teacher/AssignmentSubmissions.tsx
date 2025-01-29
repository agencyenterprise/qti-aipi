import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  CircularProgress,
  Chip
} from '@mui/material';
import { getAssignmentDetails, getAssignmentSubmissions, gradeSubmission } from '../../services/api';
import { showSnackbar } from '../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';

const AssignmentSubmissions: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Fetch assignment details
  const { data: assignment, isLoading: isLoadingAssignment } = useQuery({
    queryKey: ['assignmentDetails', assignmentId],
    queryFn: () => assignmentId ? getAssignmentDetails(assignmentId) : null,
    enabled: !!assignmentId
  });

  // Fetch submissions
  const { data: submissions, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ['assignmentSubmissions', assignmentId],
    queryFn: () => assignmentId ? getAssignmentSubmissions(assignmentId) : null,
    enabled: !!assignmentId
  });

  // Grade submission mutation
  const gradeMutation = useMutation({
    mutationFn: ({ submissionId, grade }: { submissionId: string; grade: number }) =>
      gradeSubmission(submissionId, grade),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignmentSubmissions', assignmentId] });
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

  const handleGrade = (submissionId: string, grade: number) => {
    if (grade < 0 || grade > (assignment?.data.totalPoints || 0)) {
      dispatch(
        showSnackbar({
          message: `Grade must be between 0 and ${assignment?.data.totalPoints}`,
          severity: 'error'
        })
      );
      return;
    }
    gradeMutation.mutate({ submissionId, grade });
  };

  if (isLoadingAssignment || isLoadingSubmissions) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {assignment?.data.title} - Submissions
        </Typography>
        <Typography color="textSecondary">
          {assignment?.data.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            Class: {assignment?.data.class.name}
          </Typography>
          <Typography variant="body1">
            Due Date: {new Date(assignment?.data.dueDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">
            Total Points: {assignment?.data.totalPoints}
          </Typography>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Submission Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Grade</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions?.data.map((submission: any) => (
              <TableRow key={submission.id}>
                <TableCell>
                  {submission.student.firstName} {submission.student.lastName}
                </TableCell>
                <TableCell>
                  {new Date(submission.submittedAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={submission.status}
                    color={
                      submission.status === 'GRADED'
                        ? 'success'
                        : submission.status === 'SUBMITTED'
                        ? 'warning'
                        : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {submission.status === 'GRADED' ? (
                    `${submission.grade} / ${assignment?.data.totalPoints}`
                  ) : (
                    <TextField
                      type="number"
                      size="small"
                      inputProps={{
                        min: 0,
                        max: assignment?.data.totalPoints
                      }}
                      sx={{ width: 100 }}
                      onChange={(e) => {
                        const gradeInput = e.target.value;
                        submission.tempGrade = gradeInput ? parseInt(gradeInput) : '';
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {submission.status !== 'GRADED' && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleGrade(submission.id, submission.tempGrade)}
                      disabled={!submission.tempGrade}
                    >
                      Grade
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AssignmentSubmissions; 
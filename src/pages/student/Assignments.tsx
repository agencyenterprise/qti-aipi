import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  CardActions,
  LinearProgress
} from '@mui/material';
import { Assignment as AssignmentIcon } from '@mui/icons-material';
import { getStudentAssignments } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Assignments: React.FC = () => {
  const navigate = useNavigate();
  
  // Fetch student assignments
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['studentAssignments'],
    queryFn: getStudentAssignments
  });

  const handleViewAssignment = (assignmentId: string) => {
    navigate(`/student/assignments/${assignmentId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'overdue':
        return 'error';
      case 'pending':
        return 'info';
      default:
        return 'default';
    }
  };

  const getProgress = (assignment: any) => {
    if (assignment.status === 'completed') return 100;
    if (assignment.status === 'in_progress') {
      return Math.round((assignment.completedQuestions / assignment.totalQuestions) * 100);
    }
    return 0;
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">
          My Assignments
        </Typography>
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
                    label={assignment.status.replace('_', ' ').toUpperCase()}
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
                {assignment.score !== undefined && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" color="primary">
                      Score: {assignment.score} / {assignment.totalPoints}
                    </Typography>
                  </Box>
                )}
                {assignment.status === 'in_progress' && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Progress
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={getProgress(assignment)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                )}
              </CardContent>
              {(assignment.status === 'pending' || assignment.status === 'in_progress') && (
                <CardActions>
                  <Button
                    startIcon={<AssignmentIcon />}
                    variant="contained"
                    fullWidth
                    onClick={() => handleViewAssignment(assignment.id)}
                  >
                    {assignment.status === 'in_progress' ? 'Continue Assignment' : 'Start Assignment'}
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Assignments; 
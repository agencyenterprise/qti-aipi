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
import { PlayArrow as StartIcon } from '@mui/icons-material';
import { getStudentAssessments } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface QTIAssessment {
  identifier: string;
  title: string;
  status: string;
  timeLimit: number;
  totalPoints: number;
  progress?: number;
  score?: number;
  dueDate?: string;
  class: {
    name: string;
  };
}

const Assessments: React.FC = () => {
  const navigate = useNavigate();
  
  // Fetch student assessments
  const { data: assessments, isLoading } = useQuery({
    queryKey: ['studentAssessments'],
    queryFn: getStudentAssessments
  });

  const handleStartAssessment = (assessmentId: string) => {
    navigate(`/student/assessments/${assessmentId}/take`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'not_started':
        return 'info';
      case 'expired':
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">
          My Assessments
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {assessments?.data.map((assessment: QTIAssessment) => (
          <Grid item xs={12} sm={6} md={4} key={assessment.identifier}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {assessment.title}
                  </Typography>
                  <Chip
                    label={assessment.status.replace('_', ' ')}
                    color={getStatusColor(assessment.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="body2">
                  Class: {assessment.class.name}
                </Typography>
                <Typography variant="body2">
                  Time Limit: {assessment.timeLimit} minutes
                </Typography>
                <Typography variant="body2">
                  Total Points: {assessment.totalPoints}
                </Typography>
                {assessment.dueDate && (
                  <Typography variant="body2">
                    Due: {new Date(assessment.dueDate).toLocaleDateString()}
                  </Typography>
                )}
                {assessment.score !== undefined && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" color="primary">
                      Score: {assessment.score} / {assessment.totalPoints}
                    </Typography>
                  </Box>
                )}
                {assessment.status === 'in_progress' && assessment.progress !== undefined && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Progress
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={assessment.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                )}
              </CardContent>
              {(assessment.status === 'not_started' || assessment.status === 'in_progress') && (
                <CardActions>
                  <Button
                    startIcon={<StartIcon />}
                    variant="contained"
                    fullWidth
                    onClick={() => handleStartAssessment(assessment.identifier)}
                  >
                    {assessment.status === 'in_progress' ? 'Continue Assessment' : 'Start Assessment'}
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

export default Assessments; 
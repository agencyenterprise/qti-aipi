import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: assessments, loading: assessmentsLoading } = useSelector(
    (state: RootState) => state.assessments
  );
  const { questions, loading: questionsLoading } = useSelector(
    (state: RootState) => state.questionBank
  );

  useEffect(() => {
    // TODO: Fetch initial data
  }, [dispatch]);

  const stats = [
    {
      title: 'Total Assessments',
      value: assessments.length,
      action: () => navigate('/assessments'),
      actionText: 'View All',
    },
    {
      title: 'Question Bank Items',
      value: questions.length,
      action: () => navigate('/question-bank'),
      actionText: 'Manage Questions',
    },
  ];

  if (assessmentsLoading || questionsLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h3" component="div">
                  {stat.value}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={stat.action}
                  sx={{ mt: 2 }}
                >
                  {stat.actionText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/assessments/new')}
            >
              Create New Assessment
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/question-bank/new')}
            >
              Add Question
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard; 
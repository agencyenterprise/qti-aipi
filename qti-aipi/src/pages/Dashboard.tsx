import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Container,
} from '@mui/material';
import {
  Add as AddIcon,
  Assessment as AssessmentIcon,
  QuestionAnswer as QuestionIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import { setLoading } from '../store/slices/assessmentsSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: assessments } = useSelector((state: RootState) => state.assessments);

  useEffect(() => {
    dispatch(setLoading(true));
    // TODO: Fetch dashboard data
    dispatch(setLoading(false));
  }, [dispatch]);

  const stats = [
    {
      title: 'Total Assessments',
      value: assessments.length,
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Questions in Bank',
      value: '150', // TODO: Get from question bank
      icon: <QuestionIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Active Students',
      value: '45', // TODO: Get from user management
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
  ];

  const quickActions = [
    {
      title: 'Create New Assessment',
      description: 'Start building a new assessment from scratch',
      action: () => navigate('/assessments/create'),
    },
    {
      title: 'Question Bank',
      description: 'Manage and create questions for your assessments',
      action: () => navigate('/question-bank'),
    },
    {
      title: 'View Reports',
      description: 'Check student performance and analytics',
      action: () => navigate('/reports'),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to QTI Assessment Platform
        </Typography>
        <Typography color="text.secondary">
          Manage your assessments, questions, and student progress
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.title}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ color: stat.color, mb: 2 }}>{stat.icon}</Box>
                <Typography variant="h5" component="div">
                  {stat.value}
                </Typography>
                <Typography color="text.secondary">{stat.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mb: 3 }}>
        Quick Actions
      </Typography>

      <Grid container spacing={3}>
        {quickActions.map((action) => (
          <Grid item xs={12} sm={4} key={action.title}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {action.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {action.description}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={action.action}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard; 
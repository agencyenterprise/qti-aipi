import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';

export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Create Assessment',
      description: 'Create a new assessment with various question types',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/assessments/create'),
    },
    {
      title: 'Question Bank',
      description: 'Manage and organize your question bank',
      icon: <QuizIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/question-bank'),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to QTI Assessment Platform
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Create and manage your assessments with our powerful tools
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={card.action}
            >
              {card.icon}
              <Typography variant="h6" sx={{ mt: 2 }}>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {card.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={card.action}
              >
                Get Started
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 
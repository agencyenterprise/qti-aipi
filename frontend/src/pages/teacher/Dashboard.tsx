import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import {
  getTeacherClasses,
  getTeacherAssessments,
  getClassAssignments
} from '../../services/api';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Fetch classes
  const classesQuery = useQuery({
    queryKey: ['teacherClasses'],
    queryFn: getTeacherClasses
  });

  // Fetch assessments
  const assessmentsQuery = useQuery({
    queryKey: ['teacherAssessments'],
    queryFn: getTeacherAssessments
  });

  // Fetch recent assignments for the first class
  const firstClassId = classesQuery.data?.data[0]?.id;
  const assignmentsQuery = useQuery({
    queryKey: ['classAssignments', firstClassId],
    queryFn: () => firstClassId ? getClassAssignments(firstClassId) : null,
    enabled: !!firstClassId
  });

  const handleCreateClass = () => {
    navigate('/teacher/classes');
  };

  const handleCreateAssessment = () => {
    navigate('/teacher/assessments/create');
  };

  const handleViewClasses = () => {
    navigate('/teacher/classes');
  };

  const handleViewAssessments = () => {
    navigate('/teacher/assessments');
  };

  const handleViewAssignments = () => {
    navigate('/teacher/assignments');
  };

  return (
    <Grid container spacing={3}>
      {/* Quick Actions */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateClass}
            >
              Create Class
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateAssessment}
            >
              Create Assessment
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Classes Overview */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              My Classes
            </Typography>
            <Button
              endIcon={<ChevronRightIcon />}
              onClick={handleViewClasses}
            >
              View All
            </Button>
          </Box>
          <Divider />
          <List>
            {classesQuery.data?.data.slice(0, 5).map((classItem: any) => (
              <ListItem key={classItem.id}>
                <ListItemText
                  primary={classItem.name}
                  secondary={`${classItem._count.enrollments} students`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => navigate(`/teacher/classes/${classItem.id}`)}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Assessments Overview */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Recent Assessments
            </Typography>
            <Button
              endIcon={<ChevronRightIcon />}
              onClick={handleViewAssessments}
            >
              View All
            </Button>
          </Box>
          <Divider />
          <List>
            {assessmentsQuery.data?.data.slice(0, 5).map((assessment: any) => (
              <ListItem key={assessment.id}>
                <ListItemText
                  primary={assessment.title}
                  secondary={`${assessment._count.questions} questions`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => navigate(`/teacher/assessments/${assessment.id}/edit`)}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Assignments Overview */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Recent Assignments
            </Typography>
            <Button
              endIcon={<ChevronRightIcon />}
              onClick={handleViewAssignments}
            >
              View All
            </Button>
          </Box>
          <Divider />
          <List>
            {assignmentsQuery.data?.data.slice(0, 5).map((assignment: any) => (
              <ListItem key={assignment.id}>
                <ListItemText
                  primary={assignment.title}
                  secondary={`Due: ${format(new Date(assignment.dueDate), 'MMM d, yyyy')}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => navigate(`/teacher/assignments/${assignment.id}/grade`)}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard; 
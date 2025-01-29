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
  Divider,
  Chip
} from '@mui/material';
import {
  ChevronRight as ChevronRightIcon,
  Add as AddIcon
} from '@mui/icons-material';
import {
  getEnrolledClasses,
  getClassAssignments
} from '../../services/api';
import { format, isPast } from 'date-fns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Fetch enrolled classes
  const classesQuery = useQuery({
    queryKey: ['enrolledClasses'],
    queryFn: getEnrolledClasses
  });

  // Fetch assignments for the first class
  const firstClassId = classesQuery.data?.data[0]?.id;
  const assignmentsQuery = useQuery({
    queryKey: ['classAssignments', firstClassId],
    queryFn: () => firstClassId ? getClassAssignments(firstClassId) : null,
    enabled: !!firstClassId
  });

  const handleJoinClass = () => {
    navigate('/student/classes');
  };

  const handleViewClasses = () => {
    navigate('/student/classes');
  };

  const handleViewAssignments = () => {
    navigate('/student/assignments');
  };

  const getAssignmentStatus = (assignment: any) => {
    if (assignment.submissions?.length > 0) {
      return {
        label: 'Submitted',
        color: 'success' as const
      };
    }
    
    if (isPast(new Date(assignment.dueDate))) {
      return {
        label: 'Overdue',
        color: 'error' as const
      };
    }

    return {
      label: 'Pending',
      color: 'warning' as const
    };
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
              onClick={handleJoinClass}
            >
              Join Class
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Classes Overview */}
      <Grid item xs={12} md={6}>
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
                  secondary={`Teacher: ${classItem.teacher.firstName} ${classItem.teacher.lastName}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => navigate(`/student/classes/${classItem.id}`)}
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
      <Grid item xs={12} md={6}>
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
            {assignmentsQuery.data?.data.slice(0, 5).map((assignment: any) => {
              const status = getAssignmentStatus(assignment);
              return (
                <ListItem key={assignment.id}>
                  <ListItemText
                    primary={assignment.title}
                    secondary={`Due: ${format(new Date(assignment.dueDate), 'MMM d, yyyy')}`}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={status.label}
                      color={status.color}
                      size="small"
                    />
                    <IconButton
                      edge="end"
                      onClick={() => navigate(`/student/assignments/${assignment.id}/take`)}
                      disabled={assignment.submissions?.length > 0}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard; 
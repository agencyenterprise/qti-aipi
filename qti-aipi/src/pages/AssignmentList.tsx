import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface Assignment {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'closed';
  dueDate?: string;
  questionCount: number;
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Math Quiz - Algebra Basics',
    status: 'published',
    dueDate: '2024-03-01',
    questionCount: 10,
  },
  {
    id: '2',
    title: 'Science Test - Chemistry',
    status: 'draft',
    questionCount: 15,
  },
  {
    id: '3',
    title: 'English Assessment - Literature',
    status: 'closed',
    dueDate: '2024-02-15',
    questionCount: 20,
  },
];

export default function AssignmentList() {
  const navigate = useNavigate();
  const [assignments] = useState<Assignment[]>(mockAssignments);

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'closed':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleCreateAssignment = () => {
    navigate('/assessments/create');
  };

  const handleEditAssignment = (id: string) => {
    navigate(`/assessments/edit/${id}`);
  };

  const handleStartAssignment = (id: string) => {
    // TODO: Implement assignment start functionality
    console.log('Starting assignment:', id);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Assignments</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateAssignment}
        >
          Create Assignment
        </Button>
      </Box>

      <Paper>
        <List>
          {assignments.map((assignment) => (
            <ListItem key={assignment.id} divider>
              <ListItemText
                primary={assignment.title}
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={assignment.status}
                      color={getStatusColor(assignment.status)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {assignment.dueDate && (
                      <Chip
                        label={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    )}
                    <Chip
                      label={`${assignment.questionCount} questions`}
                      size="small"
                    />
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                {assignment.status === 'published' && (
                  <IconButton
                    edge="end"
                    onClick={() => handleStartAssignment(assignment.id)}
                    sx={{ mr: 1 }}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                )}
                {assignment.status === 'draft' && (
                  <IconButton
                    edge="end"
                    onClick={() => handleEditAssignment(assignment.id)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
                <IconButton edge="end">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
} 
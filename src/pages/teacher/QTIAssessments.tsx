import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as ExportIcon,
  Upload as ImportIcon,
  AddCircle as AddSectionIcon,
  AddBox as AddItemIcon,
  ContentCopy as ContentCopyIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import {
  createQTIAssessment,
  getQTIAssessments,
  deleteQTIAssessment,
  exportQTIAssessment,
  importQTIAssessment,
} from '../../services/api';
import { showSnackbar } from '../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface QTIInteraction {
  type: 'choiceInteraction' | 'textEntryInteraction' | 'inlineChoiceInteraction' | 'matchInteraction';
  responseIdentifier: string;
  prompt: string;
  choices?: Array<{
    identifier: string;
    value: string;
  }>;
  correctResponse?: Array<string>;
  mapping?: Record<string, number>;
}

interface QTIItem {
  identifier: string;
  title: string;
  adaptive: boolean;
  timeDependent: boolean;
  itemBody: {
    interactions: QTIInteraction[];
  };
}

interface QTISection {
  identifier: string;
  title: string;
  visible: boolean;
  keepTogether: boolean;
  items: QTIItem[];
}

interface QTITestPart {
  identifier: string;
  navigationMode: 'linear' | 'nonlinear';
  submissionMode: 'individual' | 'simultaneous';
  assessmentSections: QTISection[];
}

interface QTIAssessment {
  identifier: string;
  title: string;
  testParts: QTITestPart[];
}

interface QTIAssessmentsResponse {
  data: QTIAssessment[];
}

const QTIAssessments: React.FC = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newAssessment, setNewAssessment] = useState<QTIAssessment>({
    identifier: '',
    title: '',
    testParts: [{
      identifier: 'part1',
      navigationMode: 'linear',
      submissionMode: 'individual',
      assessmentSections: [{
        identifier: 'section1',
        title: 'Section 1',
        visible: true,
        keepTogether: true,
        items: []
      }]
    }]
  });
  const navigate = useNavigate();

  // Fetch assessments
  const { data: response, isLoading } = useQuery<QTIAssessmentsResponse>({
    queryKey: ['qtiAssessments'],
    queryFn: getQTIAssessments
  });

  const assessments = response?.data || [];

  // Create assessment mutation
  const createMutation = useMutation({
    mutationFn: createQTIAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qtiAssessments'] });
      handleCloseCreateDialog();
      dispatch(
        showSnackbar({
          message: 'Assessment created successfully',
          severity: 'success'
        })
      );
    },
    onError: (error: any) => {
      dispatch(
        showSnackbar({
          message: error.response?.data?.message || 'Error creating assessment',
          severity: 'error'
        })
      );
    }
  });

  // Delete assessment mutation
  const deleteMutation = useMutation({
    mutationFn: deleteQTIAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qtiAssessments'] });
      dispatch(
        showSnackbar({
          message: 'Assessment deleted successfully',
          severity: 'success'
        })
      );
    },
    onError: (error: any) => {
      dispatch(
        showSnackbar({
          message: error.response?.data?.message || 'Error deleting assessment',
          severity: 'error'
        })
      );
    }
  });

  // Import assessment mutation
  const importMutation = useMutation({
    mutationFn: importQTIAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qtiAssessments'] });
      handleCloseImportDialog();
      dispatch(
        showSnackbar({
          message: 'Assessment imported successfully',
          severity: 'success'
        })
      );
    }
  });

  const handleOpenCreateDialog = () => setCreateDialogOpen(true);
  const handleCloseCreateDialog = () => setCreateDialogOpen(false);
  const handleOpenImportDialog = () => setImportDialogOpen(true);
  const handleCloseImportDialog = () => setImportDialogOpen(false);

  const handleCreateAssessment = () => {
    navigate('/teacher/assessments/create');
  };

  const handleEditAssessment = (identifier: string) => {
    navigate(`/teacher/assessments/${identifier}/edit`);
  };

  const handlePreviewAssessment = (identifier: string) => {
    navigate(`/teacher/assessments/${identifier}/preview`);
  };

  const handleDuplicateAssessment = async (assessment: QTIAssessment) => {
    try {
      const duplicatedAssessment = {
        ...assessment,
        identifier: `${assessment.identifier}-copy`,
        title: `Copy of ${assessment.title}`
      };
      await createQTIAssessment(duplicatedAssessment);
      queryClient.invalidateQueries({ queryKey: ['qtiAssessments'] });
      dispatch(
        showSnackbar({
          message: 'Assessment duplicated successfully',
          severity: 'success'
        })
      );
    } catch (error: any) {
      dispatch(
        showSnackbar({
          message: error.response?.data?.message || 'Error duplicating assessment',
          severity: 'error'
        })
      );
    }
  };

  const handleDeleteAssessment = (identifier: string) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      deleteMutation.mutate(identifier);
    }
  };

  const handleExportAssessment = async (assessmentId: string) => {
    try {
      const response = await exportQTIAssessment(assessmentId);
      const blob = new Blob([response.data], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assessment-${assessmentId}.xml`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      dispatch(
        showSnackbar({
          message: error.response?.data?.message || 'Error exporting assessment',
          severity: 'error'
        })
      );
    }
  };

  const handleImportAssessment = () => {
    if (selectedFile) {
      importMutation.mutate(selectedFile);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">
          QTI Assessments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateAssessment}
        >
          Create Assessment
        </Button>
      </Box>

      <Grid container spacing={3}>
        {assessments.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    No Assessments Yet
                  </Typography>
                  <Typography color="textSecondary" paragraph>
                    Create your first QTI assessment to get started
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateAssessment}
                  >
                    Create Assessment
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          assessments.map((assessment: QTIAssessment) => (
            <Grid item xs={12} md={6} key={assessment.identifier}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {assessment.title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Identifier: {assessment.identifier}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Test Parts:
                  </Typography>
                  <List dense>
                    {assessment.testParts.map((part) => (
                      <ListItem key={part.identifier}>
                        <ListItemText
                          primary={`Part: ${part.identifier}`}
                          secondary={`Navigation: ${part.navigationMode}, Submission: ${part.submissionMode}`}
                        />
                        <ListItemSecondaryAction>
                          <Chip
                            size="small"
                            label={`${part.assessmentSections.length} sections`}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    onClick={() => handleEditAssessment(assessment.identifier)}
                    title="Edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handlePreviewAssessment(assessment.identifier)}
                    title="Preview"
                  >
                    <PreviewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDuplicateAssessment(assessment)}
                    title="Duplicate"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteAssessment(assessment.identifier)}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Create Assessment Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create QTI Assessment</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={newAssessment.title}
            onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Identifier"
            fullWidth
            value={newAssessment.identifier}
            onChange={(e) => setNewAssessment({ ...newAssessment, identifier: e.target.value })}
            required
            helperText="Unique identifier for the assessment"
          />
          {newAssessment.testParts.map((part, partIndex) => (
            <Box key={part.identifier} sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Test Part {partIndex + 1}
              </Typography>
              <FormControl fullWidth margin="dense">
                <InputLabel>Navigation Mode</InputLabel>
                <Select
                  value={part.navigationMode}
                  label="Navigation Mode"
                  onChange={(e) => {
                    const newParts = [...newAssessment.testParts];
                    newParts[partIndex].navigationMode = e.target.value as 'linear' | 'nonlinear';
                    setNewAssessment({ ...newAssessment, testParts: newParts });
                  }}
                >
                  <MenuItem value="linear">Linear</MenuItem>
                  <MenuItem value="nonlinear">Non-linear</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel>Submission Mode</InputLabel>
                <Select
                  value={part.submissionMode}
                  label="Submission Mode"
                  onChange={(e) => {
                    const newParts = [...newAssessment.testParts];
                    newParts[partIndex].submissionMode = e.target.value as 'individual' | 'simultaneous';
                    setNewAssessment({ ...newAssessment, testParts: newParts });
                  }}
                >
                  <MenuItem value="individual">Individual</MenuItem>
                  <MenuItem value="simultaneous">Simultaneous</MenuItem>
                </Select>
              </FormControl>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => createMutation.mutate(newAssessment)}
            disabled={!newAssessment.title || !newAssessment.identifier}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={handleCloseImportDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Import QTI Assessment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              accept=".xml"
              style={{ display: 'none' }}
              id="qti-file-input"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="qti-file-input">
              <Button
                variant="outlined"
                component="span"
                startIcon={<ImportIcon />}
                fullWidth
              >
                Choose QTI File
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => importMutation.mutate(selectedFile)}
            disabled={!selectedFile}
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QTIAssessments; 
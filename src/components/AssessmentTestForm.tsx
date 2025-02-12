'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  Alert,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  DragHandle as DragHandleIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import apiClient from '@/lib/api/client';
import type { QTIAssessmentTest, QTISection } from '@/types/qti';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  navigationMode: yup.string().required('Navigation mode is required'),
  submissionMode: yup.string().required('Submission mode is required'),
});

interface AssessmentTestFormProps {
  initialValues?: QTIAssessmentTest;
  onSubmit?: (values: QTIAssessmentTest) => Promise<void>;
}

type ExtendedQTISection = QTISection & {
  sequence: number;
};

export default function AssessmentTestForm({ initialValues, onSubmit }: AssessmentTestFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<ExtendedQTISection[]>(() => {
    if (!initialValues?.['qti-test-part']?.[0]?.['qti-assessment-section']) {
      return [];
    }
    return initialValues['qti-test-part'][0]['qti-assessment-section'].map((section, index) => ({
      ...section,
      sequence: index + 1,
      'qti-assessment-item-ref': section['qti-assessment-item-ref'] || [],
      visible: section.visible ?? true,
    }));
  });
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || '',
      navigationMode: initialValues?.['qti-test-part']?.[0]?.navigationMode || 'linear',
      submissionMode: initialValues?.['qti-test-part']?.[0]?.submissionMode || 'individual',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const testData = {
          identifier: initialValues?.identifier || `TEST_${Date.now()}`,
          title: values.title,
          'qti-test-part': [
            {
              identifier: initialValues?.['qti-test-part']?.[0]?.identifier || 'TEST_PART_1',
              navigationMode: values.navigationMode as 'linear' | 'nonlinear',
              submissionMode: values.submissionMode as 'individual' | 'simultaneous',
              'qti-assessment-section': sections.map(section => ({
                ...section,
                'qti-assessment-item-ref': section['qti-assessment-item-ref'] || [],
                required: section.required ?? true,
                fixed: section.fixed ?? false,
                visible: section.visible ?? true,
                sequence: section.sequence,
              })),
            },
          ],
          rawXml: '',
          content: {},
        };

        if (onSubmit) {
          await onSubmit(testData as QTIAssessmentTest);
        } else {
          await apiClient.post('/assessment-tests', testData);
          router.push('/assessments');
        }
      } catch (err: any) {
        if (err?.response?.data?.error) {
          setError(err.response.data.error + (err.response.data.details ? `: ${err.response.data.details}` : ''));
        } else {
          setError('Failed to save assessment test');
        }
        console.error('Error saving test:', err);
      }
    },
  });

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;

    const newSection: ExtendedQTISection = {
      identifier: `SECTION_${Date.now()}`,
      title: newSectionTitle,
      visible: true,
      required: true,
      fixed: false,
      sequence: sections.length + 1,
      'qti-assessment-item-ref': [],
    };

    setSections([...sections, newSection]);
    setNewSectionTitle('');
    setIsAddingSectionOpen(false);
  };

  const handleRemoveSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index).map((section, i) => ({
      ...section,
      sequence: i + 1,
    }));
    setSections(newSections);
  };

  return (
    <Paper sx={{ p: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="navigationMode-label">Navigation Mode</InputLabel>
              <Select
                labelId="navigationMode-label"
                id="navigationMode"
                name="navigationMode"
                value={formik.values.navigationMode}
                label="Navigation Mode"
                onChange={formik.handleChange}
              >
                <MenuItem value="linear">Linear</MenuItem>
                <MenuItem value="nonlinear">Non-linear</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="submissionMode-label">Submission Mode</InputLabel>
              <Select
                labelId="submissionMode-label"
                id="submissionMode"
                name="submissionMode"
                value={formik.values.submissionMode}
                label="Submission Mode"
                onChange={formik.handleChange}
              >
                <MenuItem value="individual">Individual</MenuItem>
                <MenuItem value="simultaneous">Simultaneous</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">Sections</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setIsAddingSectionOpen(true)}
                variant="outlined"
                size="small"
              >
                Add Section
              </Button>
            </Box>

            <List>
              {sections.map((section, index) => (
                <ListItem
                  key={section.identifier}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <DragHandleIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <ListItemText
                    primary={section.title}
                    secondary={`Section ${section.sequence} • ${section['qti-assessment-item-ref']?.length || 0} items`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveSection(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/assessments')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
              >
                {initialValues ? 'Save Changes' : 'Create Assessment'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      <Dialog
        open={isAddingSectionOpen}
        onClose={() => setIsAddingSectionOpen(false)}
      >
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Section Title"
            fullWidth
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddingSectionOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSection} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
} 
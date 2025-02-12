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
} from '@mui/material';
import {
  Delete as DeleteIcon,
  DragHandle as DragHandleIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import type { QTIAssessmentTest, QTISection } from '@/types/qti';
import { assessmentTestService } from '@/lib/api/services';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  navigationMode: yup.string().required('Navigation mode is required'),
  submissionMode: yup.string().required('Submission mode is required'),
});

interface AssessmentFormProps {
  initialValues?: Partial<QTIAssessmentTest>;
  onSubmit?: (values: QTIAssessmentTest) => Promise<void>;
}

export default function AssessmentForm({ initialValues, onSubmit }: AssessmentFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<QTISection[]>(
    initialValues?.['qti-test-part']?.[0]?.['qti-assessment-section'] || []
  );

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || '',
      navigationMode: initialValues?.['qti-test-part']?.[0]?.navigationMode || 'linear',
      submissionMode: initialValues?.['qti-test-part']?.[0]?.submissionMode || 'individual',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const testData: Omit<QTIAssessmentTest, 'identifier'> = {
          title: values.title,
          'qti-test-part': [
            {
              identifier: 'TEST_PART_1',
              navigationMode: values.navigationMode as 'linear' | 'nonlinear',
              submissionMode: values.submissionMode as 'individual' | 'simultaneous',
              'qti-assessment-section': sections,
            },
          ],
        };

        if (onSubmit) {
          await onSubmit(testData as QTIAssessmentTest);
        } else {
          await assessmentTestService.create(testData);
          router.push('/assessments');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save assessment test');
      }
    },
  });

  const handleAddSection = () => {
    const newSection: QTISection = {
      identifier: `SECTION_${sections.length + 1}`,
      title: `Section ${sections.length + 1}`,
      visible: true,
      'qti-assessment-item-ref': [],
    };
    setSections([...sections, newSection]);
  };

  const handleRemoveSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
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
                onClick={handleAddSection}
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
                    secondary={`${section['qti-assessment-item-ref']?.length || 0} items`}
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
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
              >
                Save Assessment
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
} 
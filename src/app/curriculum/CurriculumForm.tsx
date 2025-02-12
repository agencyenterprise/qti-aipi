'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import type { QTICurriculum } from '@/types/qti';
import { curriculumService } from '@/lib/api/services';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  subject: yup.string().required('Subject is required'),
  gradeLevel: yup.string().required('Grade level is required'),
  description: yup.string(),
});

const subjects = [
  'Mathematics',
  'Science',
  'English Language Arts',
  'Social Studies',
  'Foreign Languages',
  'Arts',
  'Physical Education',
  'Computer Science',
  'Other',
];

const gradeLevels = [
  'K-2',
  '3-5',
  '6-8',
  '9-12',
  'Higher Education',
  'Professional Development',
];

interface CurriculumFormProps {
  initialValues?: Partial<QTICurriculum>;
  onSubmit?: (values: Omit<QTICurriculum, 'identifier'>) => Promise<void>;
}

export default function CurriculumForm({ initialValues, onSubmit }: CurriculumFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || '',
      subject: initialValues?.subject || '',
      gradeLevel: initialValues?.gradeLevel || '',
      description: initialValues?.description || '',
      metadata: initialValues?.metadata || {},
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const curriculumData: Omit<QTICurriculum, 'identifier'> = {
          title: values.title,
          subject: values.subject,
          gradeLevel: values.gradeLevel,
          description: values.description,
          metadata: values.metadata,
        };

        if (onSubmit) {
          await onSubmit(curriculumData);
        } else {
          await curriculumService.create(curriculumData);
          router.push('/curriculum');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save curriculum');
      }
    },
  });

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
              <InputLabel id="subject-label">Subject</InputLabel>
              <Select
                labelId="subject-label"
                id="subject"
                name="subject"
                value={formik.values.subject}
                label="Subject"
                onChange={formik.handleChange}
                error={formik.touched.subject && Boolean(formik.errors.subject)}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="gradeLevel-label">Grade Level</InputLabel>
              <Select
                labelId="gradeLevel-label"
                id="gradeLevel"
                name="gradeLevel"
                value={formik.values.gradeLevel}
                label="Grade Level"
                onChange={formik.handleChange}
                error={formik.touched.gradeLevel && Boolean(formik.errors.gradeLevel)}
              >
                {gradeLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
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
                Save Curriculum
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
} 
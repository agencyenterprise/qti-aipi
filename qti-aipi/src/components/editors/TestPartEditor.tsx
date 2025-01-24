import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
  Grid,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { TestPart } from '../../types/test-part';
import { SectionEditor } from './SectionEditor';

interface TestPartEditorProps {
  testPart: TestPart;
  onUpdate: (testPart: TestPart) => void;
  onDelete: () => void;
}

export const TestPartEditor: React.FC<TestPartEditorProps> = ({
  testPart,
  onUpdate,
  onDelete,
}) => {
  const handleAddSection = () => {
    const newSection = {
      identifier: `section-${Date.now()}`,
      title: 'New Section',
      navigationMode: 'linear',
      submissionMode: 'individual',
      items: [],
    };

    onUpdate({
      ...testPart,
      assessmentSections: [...(testPart.assessmentSections || []), newSection],
    });
  };

  const handleUpdateSection = (index: number, updatedSection: any) => {
    const newSections = [...(testPart.assessmentSections || [])];
    newSections[index] = updatedSection;
    onUpdate({
      ...testPart,
      assessmentSections: newSections,
    });
  };

  const handleDeleteSection = (index: number) => {
    const newSections = testPart.assessmentSections?.filter((_, i) => i !== index);
    onUpdate({
      ...testPart,
      assessmentSections: newSections,
    });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{testPart.title || 'Test Part'}</Typography>
        <IconButton color="error" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Box>

      {testPart.assessmentSections?.map((section, index) => (
        <Accordion key={section.identifier}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography>{section.title || `Section ${index + 1}`}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption" color="text.secondary">
                  {section.items?.length || 0} items
                </Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <SectionEditor
              section={section}
              onUpdate={(updatedSection) => handleUpdateSection(index, updatedSection)}
              onDelete={() => handleDeleteSection(index)}
            />
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddSection}
          fullWidth
        >
          Add Section
        </Button>
      </Box>
    </Paper>
  );
};

export default TestPartEditor; 
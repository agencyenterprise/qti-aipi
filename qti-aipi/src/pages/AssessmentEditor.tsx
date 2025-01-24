import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { RootState } from '../store';
import { Assessment } from '../types/assessment-test';
import { QuestionEditor } from '../components/editors/QuestionEditor';
import { TestPartEditor } from '../components/editors/TestPartEditor';
import { SectionEditor } from '../components/editors/SectionEditor';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const questionTypes = [
  {
    type: 'multiple-choice',
    title: 'Multiple Choice',
    description: 'Create questions with multiple options',
    image: '/question-types/multiple-choice.png',
  },
  {
    type: 'short-answer',
    title: 'Short Answer',
    description: 'Students provide brief text responses',
    image: '/question-types/short-answer.png',
  },
  {
    type: 'essay',
    title: 'Essay',
    description: 'Long-form written responses',
    image: '/question-types/essay.png',
  },
  {
    type: 'matching',
    title: 'Matching',
    description: 'Match items from two columns',
    image: '/question-types/matching.png',
  },
  {
    type: 'hotspot',
    title: 'Hotspot',
    description: 'Select areas on an image',
    image: '/question-types/hotspot.png',
  },
];

const AssessmentEditor = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isQuestionTypeDialogOpen, setIsQuestionTypeDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const assessment = useSelector((state: RootState) => state.assessments.selectedAssessment);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleAddQuestion = (type: string) => {
    // TODO: Implement question addition logic
    setIsQuestionTypeDialogOpen(false);
  };

  const handleSave = () => {
    // TODO: Implement save logic
  };

  const handlePreview = () => {
    // TODO: Implement preview logic
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Assessment Editor</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={handlePreview}
            sx={{ mr: 2 }}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Questions" />
          <Tab label="Settings" />
          <Tab label="Preview" />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsQuestionTypeDialogOpen(true)}
            >
              Add Question
            </Button>
          </Box>

          {assessment?.testParts.map((testPart, index) => (
            <TestPartEditor key={index} testPart={testPart} />
          ))}
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <Typography>Assessment Settings</Typography>
          {/* TODO: Add assessment settings form */}
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <Typography>Assessment Preview</Typography>
          {/* TODO: Add assessment preview */}
        </TabPanel>
      </Paper>

      <Dialog
        open={isQuestionTypeDialogOpen}
        onClose={() => setIsQuestionTypeDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Choose Question Type</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {questionTypes.map((type) => (
              <Grid item xs={12} sm={6} md={4} key={type.type}>
                <Card
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleAddQuestion(type.type)}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={type.image}
                    alt={type.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {type.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {type.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsQuestionTypeDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssessmentEditor; 
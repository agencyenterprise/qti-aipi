import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AssessmentResult {
  id: string;
  studentName: string;
  score: number;
  totalPoints: number;
  completionTime: number;
  submittedAt: string;
}

interface AssessmentSummary {
  id: string;
  title: string;
  averageScore: number;
  submissions: number;
  results: AssessmentResult[];
}

const mockData: AssessmentSummary[] = [
  {
    id: '1',
    title: 'Math Quiz - Algebra Basics',
    averageScore: 85,
    submissions: 25,
    results: [
      {
        id: '1',
        studentName: 'John Doe',
        score: 90,
        totalPoints: 100,
        completionTime: 45,
        submittedAt: '2024-01-28T10:30:00',
      },
      {
        id: '2',
        studentName: 'Jane Smith',
        score: 85,
        totalPoints: 100,
        completionTime: 52,
        submittedAt: '2024-01-28T10:35:00',
      },
      // Add more mock results as needed
    ],
  },
  {
    id: '2',
    title: 'Science Test - Chemistry',
    averageScore: 78,
    submissions: 22,
    results: [
      {
        id: '3',
        studentName: 'Alice Johnson',
        score: 88,
        totalPoints: 100,
        completionTime: 48,
        submittedAt: '2024-01-28T11:15:00',
      },
      {
        id: '4',
        studentName: 'Bob Wilson',
        score: 75,
        totalPoints: 100,
        completionTime: 55,
        submittedAt: '2024-01-28T11:20:00',
      },
      // Add more mock results as needed
    ],
  },
];

export default function Reports() {
  const [selectedAssessment, setSelectedAssessment] = useState<string>(mockData[0].id);

  const handleAssessmentChange = (event: SelectChangeEvent) => {
    setSelectedAssessment(event.target.value);
  };

  const currentAssessment = mockData.find((a) => a.id === selectedAssessment);

  const scoreDistributionData = {
    labels: ['90-100', '80-89', '70-79', '60-69', 'Below 60'],
    datasets: [
      {
        label: 'Number of Students',
        data: [5, 8, 6, 4, 2],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const completionTimeData = {
    labels: currentAssessment?.results.map((r) => r.studentName),
    datasets: [
      {
        label: 'Completion Time (minutes)',
        data: currentAssessment?.results.map((r) => r.completionTime),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Assessment Reports
        </Typography>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel>Select Assessment</InputLabel>
          <Select
            value={selectedAssessment}
            label="Select Assessment"
            onChange={handleAssessmentChange}
          >
            {mockData.map((assessment) => (
              <MenuItem key={assessment.id} value={assessment.id}>
                {assessment.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {currentAssessment && (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Average Score
                    </Typography>
                    <Typography variant="h4">
                      {currentAssessment.averageScore}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Total Submissions
                    </Typography>
                    <Typography variant="h4">
                      {currentAssessment.submissions}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Passing Rate
                    </Typography>
                    <Typography variant="h4">
                      {Math.round(
                        (currentAssessment.results.filter((r) => r.score >= 60)
                          .length /
                          currentAssessment.results.length) *
                          100
                      )}
                      %
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Score Distribution
                  </Typography>
                  <Pie data={scoreDistributionData} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Completion Time
                  </Typography>
                  <Bar
                    data={completionTimeData}
                    options={{
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </Paper>
              </Grid>
            </Grid>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student Name</TableCell>
                      <TableCell align="right">Score</TableCell>
                      <TableCell align="right">Completion Time (min)</TableCell>
                      <TableCell align="right">Submitted At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentAssessment.results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell component="th" scope="row">
                          {result.studentName}
                        </TableCell>
                        <TableCell align="right">
                          {result.score}/{result.totalPoints}
                        </TableCell>
                        <TableCell align="right">
                          {result.completionTime}
                        </TableCell>
                        <TableCell align="right">
                          {new Date(result.submittedAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
} 
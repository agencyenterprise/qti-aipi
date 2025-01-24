import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const mockData = {
  assessmentScores: [
    { name: '0-20', count: 5 },
    { name: '21-40', count: 12 },
    { name: '41-60', count: 25 },
    { name: '61-80', count: 30 },
    { name: '81-100', count: 18 },
  ],
  questionPerformance: [
    { question: 'Q1', correct: 75, incorrect: 25 },
    { question: 'Q2', correct: 60, incorrect: 40 },
    { question: 'Q3', correct: 85, incorrect: 15 },
    { question: 'Q4', correct: 45, incorrect: 55 },
    { question: 'Q5', correct: 90, incorrect: 10 },
  ],
  timeDistribution: [
    { name: '<15 min', value: 20 },
    { name: '15-30 min', value: 45 },
    { name: '30-45 min', value: 25 },
    { name: '>45 min', value: 10 },
  ],
};

const Reports = () => {
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [dateRange, setDateRange] = useState('week');

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Assessment Reports
        </Typography>
        <Typography color="text.secondary">
          View analytics and performance metrics
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Assessment</InputLabel>
            <Select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              label="Assessment"
            >
              <MenuItem value="">All Assessments</MenuItem>
              <MenuItem value="1">Math Quiz 1</MenuItem>
              <MenuItem value="2">Science Test</MenuItem>
              <MenuItem value="3">History Exam</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Score Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData.assessmentScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Question Performance
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData.questionPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="question" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="correct"
                      stroke="#82ca9d"
                      name="Correct %"
                    />
                    <Line
                      type="monotone"
                      dataKey="incorrect"
                      stroke="#ff7373"
                      name="Incorrect %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Time Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockData.timeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockData.timeDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reports; 
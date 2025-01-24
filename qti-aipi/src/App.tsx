import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import { theme } from './theme';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Dashboard from './pages/Dashboard';
import AssessmentEditor from './pages/AssessmentEditor';
import QuestionBank from './pages/QuestionBank';
import Reports from './pages/Reports';
import StudentView from './pages/StudentView';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="assessments/create" element={<AssessmentEditor />} />
              <Route path="assessments/edit/:id" element={<AssessmentEditor />} />
              <Route path="question-bank" element={<QuestionBank />} />
              <Route path="reports" element={<Reports />} />
              <Route path="student" element={<StudentView />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

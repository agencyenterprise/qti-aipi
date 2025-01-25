import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
import { theme } from './theme';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import AssessmentList from './pages/AssessmentList';
import AssessmentEditor from './pages/AssessmentEditor';
import QuestionBank from './pages/QuestionBank';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assessments" element={<AssessmentList />} />
              <Route path="/assessments/new" element={<AssessmentEditor />} />
              <Route path="/assessments/edit/:id" element={<AssessmentEditor />} />
              <Route path="/question-bank" element={<QuestionBank />} />
            </Routes>
          </MainLayout>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

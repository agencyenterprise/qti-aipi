import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import { theme } from './theme';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import AssessmentEditor from './pages/AssessmentEditor';
import QuestionBank from './pages/QuestionBank';
import AssignmentList from './pages/AssignmentList';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assessments/create" element={<AssessmentEditor />} />
              <Route path="/assessments/edit/:id" element={<AssessmentEditor />} />
              <Route path="/question-bank" element={<QuestionBank />} />
              <Route path="/assignments" element={<AssignmentList />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

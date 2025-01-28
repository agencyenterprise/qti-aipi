import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Dashboard from './pages/Dashboard';
import AssessmentEditor from './pages/AssessmentEditor';
import QuestionBank from './pages/QuestionBank';
import AssessmentList from './pages/AssessmentList';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assessments" element={<AssessmentList />} />
            <Route path="/assessments/:id" element={<AssessmentEditor />} />
            <Route path="/question-bank" element={<QuestionBank />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;

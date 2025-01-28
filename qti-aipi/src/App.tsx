import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/Layout';
import AssessmentsPage from './pages/AssessmentsPage';
import QuestionBankPage from './pages/QuestionBankPage';
import PreviewPage from './pages/PreviewPage';
import AssessmentEditorPage from './pages/AssessmentEditorPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<AssessmentsPage />} />
            <Route path="/question-bank" element={<QuestionBankPage />} />
            <Route path="/preview/:itemId?" element={<PreviewPage />} />
            <Route path="/assessment/new" element={<AssessmentEditorPage />} />
            <Route path="/assessment/edit/:assessmentId" element={<AssessmentEditorPage />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;

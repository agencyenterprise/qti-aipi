import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Alert, Snackbar } from '@mui/material';
import { RootState } from './store';
import { useDispatch } from 'react-redux';
import { hideSnackbar } from './store/slices/uiSlice';

// Auth components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Layout components
import TeacherLayout from './components/layouts/TeacherLayout';
import StudentLayout from './components/layouts/StudentLayout';

// Teacher pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherClasses from './pages/teacher/Classes';
import TeacherAssignments from './pages/teacher/Assignments';
import AssignmentSubmissions from './pages/teacher/AssignmentSubmissions';
import QTIAssessments from './pages/teacher/QTIAssessments';
import QTIAssessmentEditor from './pages/teacher/QTIAssessmentEditor';
import QTIAssessmentPreview from './pages/teacher/QTIAssessmentPreview';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentClasses from './pages/student/Classes';
import StudentAssessments from './pages/student/Assessments';
import StudentAssignments from './pages/student/Assignments';

// Guards
import RoleGuard from './components/guards/RoleGuard';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { snackbar } = useSelector((state: RootState) => state.ui);

  const handleCloseSnackbar = () => {
    dispatch(hideSnackbar());
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Teacher routes */}
        <Route element={<RoleGuard role="TEACHER" />}>
          <Route element={<TeacherLayout />}>
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/classes" element={<TeacherClasses />} />
            <Route path="/teacher/assignments" element={<TeacherAssignments />} />
            <Route
              path="/teacher/assignments/:assignmentId/submissions"
              element={<AssignmentSubmissions />}
            />
            <Route path="/teacher/assessments" element={<QTIAssessments />} />
            <Route path="/teacher/assessments/create" element={<QTIAssessmentEditor />} />
            <Route path="/teacher/assessments/:assessmentId/edit" element={<QTIAssessmentEditor />} />
            <Route path="/teacher/assessments/:assessmentId/preview" element={<QTIAssessmentPreview />} />
          </Route>
        </Route>

        {/* Student routes */}
        <Route element={<RoleGuard role="STUDENT" />}>
          <Route element={<StudentLayout />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/classes" element={<StudentClasses />} />
            <Route path="/student/assignments" element={<StudentAssignments />} />
          </Route>
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Router>
  );
};

export default App; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store';
import theme from './theme';

// Layout
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherClasses from './pages/teacher/Classes';
import TeacherAssessments from './pages/teacher/Assessments';
import TeacherAssignments from './pages/teacher/Assignments';
import CreateAssessment from './pages/teacher/CreateAssessment';
import EditAssessment from './pages/teacher/EditAssessment';
import GradeSubmissions from './pages/teacher/GradeSubmissions';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentClasses from './pages/student/Classes';
import StudentAssignments from './pages/student/Assignments';
import TakeAssessment from './pages/student/TakeAssessment';

// Guards
import AuthGuard from './components/guards/AuthGuard';
import RoleGuard from './components/guards/RoleGuard';

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<AuthGuard><Layout /></AuthGuard>}>
                {/* Teacher Routes */}
                <Route element={<RoleGuard role="TEACHER" />}>
                  <Route path="/teacher" element={<TeacherDashboard />} />
                  <Route path="/teacher/classes" element={<TeacherClasses />} />
                  <Route path="/teacher/assessments" element={<TeacherAssessments />} />
                  <Route path="/teacher/assessments/create" element={<CreateAssessment />} />
                  <Route path="/teacher/assessments/:id/edit" element={<EditAssessment />} />
                  <Route path="/teacher/assignments" element={<TeacherAssignments />} />
                  <Route path="/teacher/assignments/:id/grade" element={<GradeSubmissions />} />
                </Route>

                {/* Student Routes */}
                <Route element={<RoleGuard role="STUDENT" />}>
                  <Route path="/student" element={<StudentDashboard />} />
                  <Route path="/student/classes" element={<StudentClasses />} />
                  <Route path="/student/assignments" element={<StudentAssignments />} />
                  <Route path="/student/assignments/:id/take" element={<TakeAssessment />} />
                </Route>

                {/* Redirect based on role */}
                <Route
                  path="/"
                  element={
                    <Navigate
                      to="/teacher"
                      replace
                    />
                  }
                />
              </Route>
            </Routes>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App; 
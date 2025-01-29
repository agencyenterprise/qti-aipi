import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const register = (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'TEACHER' | 'STUDENT';
}) => api.post('/auth/register', data);

// Classes
export const getTeacherClasses = () => api.get('/classes/teaching');
export const getEnrolledClasses = () => api.get('/classes/enrolled');
export const createClass = (data: { name: string; description?: string }) =>
  api.post('/classes', data);
export const joinClass = (code: string) => api.post('/classes/join', { code });
export const getClassDetails = (id: string) => api.get(`/classes/${id}`);

// Assessments
export const getTeacherAssessments = () => api.get('/assessments');
export const createAssessment = (data: {
  title: string;
  description?: string;
  questions: Array<{
    type: string;
    content: string;
    points: number;
    options?: string[];
    correctAnswer?: string;
  }>;
}) => api.post('/assessments', data);
export const getAssessmentDetails = (id: string) => api.get(`/assessments/${id}`);
export const updateAssessment = (id: string, data: {
  title?: string;
  description?: string;
  questions?: Array<{
    type: string;
    content: string;
    points: number;
    options?: string[];
    correctAnswer?: string;
  }>;
}) => api.put(`/assessments/${id}`, data);
export const deleteAssessment = (id: string) => api.delete(`/assessments/${id}`);

// Assignments
export const createAssignment = (data: {
  title: string;
  instructions?: string;
  dueDate: string;
  timeLimit?: number;
  assessmentId: string;
  classId: string;
}) => api.post('/assignments', data);
export const getClassAssignments = (classId: string) =>
  api.get(`/assignments/class/${classId}`);
export const getAssignmentDetails = (id: string) => api.get(`/assignments/${id}`);
export const updateAssignment = (id: string, data: {
  title?: string;
  instructions?: string;
  dueDate?: string;
  timeLimit?: number;
}) => api.put(`/assignments/${id}`, data);
export const deleteAssignment = (id: string) => api.delete(`/assignments/${id}`);

// Submissions
export const startSubmission = (assignmentId: string) =>
  api.post('/submissions/start', { assignmentId });
export const submitAnswers = (submissionId: string, answers: Array<{
  questionId: string;
  content: string;
}>) => api.post(`/submissions/${submissionId}/answers`, { answers });
export const getSubmissionDetails = (id: string) => api.get(`/submissions/${id}`);
export const gradeSubmission = (submissionId: string, answers: Array<{
  answerId: string;
  points: number;
}>) => api.post(`/submissions/${submissionId}/grade`, { answers });

export default api; 
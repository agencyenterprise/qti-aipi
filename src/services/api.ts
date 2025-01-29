import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',  // Update to match your server
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth endpoints
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const register = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}) => api.post('/auth/register', data);

export const logout = () => api.post('/auth/logout');

// QTI Assessment endpoints
export const getQTIAssessments = () => {
  return api.get('/assessments');
};

export const getQTIAssessment = (identifier: string) => {
  return api.get(`/assessments/${identifier}`);
};

export const createQTIAssessment = (assessment: any) => {
  return api.post('/assessments', assessment);
};

export const updateQTIAssessment = (identifier: string, assessment: any) => {
  return api.put(`/assessments/${identifier}`, assessment);
};

export const deleteQTIAssessment = (identifier: string) => {
  return api.delete(`/assessments/${identifier}`);
};

export const exportQTIAssessment = (identifier: string) => {
  return api.get(`/assessments/${identifier}/export`, {
    responseType: 'blob'
  });
};

export const importQTIAssessment = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/assessments/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const validateQTIAssessment = (assessment: any) => {
  return api.post('/assessments/validate', assessment);
};

// Class endpoints
export const getClasses = () => api.get('/classes/teaching');

export const createClass = (data: { name: string; description?: string }) =>
  api.post('/classes', data);

// Assignment endpoints
export const getAssignments = () => api.get('/assignments');

export const createAssignment = (data: {
  title: string;
  description: string;
  dueDate: string;
  classId: string;
  totalPoints: number;
  assessmentId?: string;
}) => api.post('/assignments', data);

export const getAssignmentDetails = (assignmentId: string) =>
  api.get(`/assignments/${assignmentId}`);

export const deleteAssignment = (assignmentId: string) =>
  api.delete(`/assignments/${assignmentId}`);

export const getAssignmentSubmissions = (assignmentId: string) =>
  api.get(`/assignments/${assignmentId}/submissions`);

export const gradeSubmission = (submissionId: string, grade: number) =>
  api.post(`/submissions/${submissionId}/grade`, { grade });

// Student-specific endpoints
export const getEnrolledClasses = () => api.get('/classes/enrolled');

export const joinClass = (classCode: string) =>
  api.post('/classes/join', { code: classCode });

export const getStudentAssignments = getAssignments;

export const submitAssignment = (assignmentId: string, content: string) =>
  api.post(`/assignments/${assignmentId}/submit`, { content });

export const getStudentAssessments = getQTIAssessments;

export const getStudentAssessmentDetails = getQTIAssessment;

export const startAssessment = (assessmentId: string) =>
  api.post(`/assessments/${assessmentId}/start`);

export const submitAssessmentResponse = (assessmentId: string, data: {
  itemIdentifier: string;
  responseIdentifier: string;
  response: string | string[];
}) => api.post(`/assessments/${assessmentId}/responses`, data);

export const finishAssessment = (assessmentId: string) =>
  api.post(`/assessments/${assessmentId}/finish`);

// Class-specific endpoints
export const getClassAssignments = (classId: string) =>
  api.get(`/classes/${classId}/assignments`);

// Teacher endpoints (using existing endpoints internally)
export const getTeacherClasses = getClasses;
export const getTeacherAssessments = getQTIAssessments;
export const getTeacherAssignments = getAssignments;
export const deleteAssessment = deleteQTIAssessment;

// Interceptors
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 

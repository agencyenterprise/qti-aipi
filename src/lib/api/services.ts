import apiClient from './client';
import type {
  QTIAssessmentItem,
  QTIAssessmentTest,
  QTISection,
  QTICurriculum,
  PaginatedResponse,
} from '@/types/qti';

export const assessmentItemService = {
  create: (data: Omit<QTIAssessmentItem, 'identifier'>) =>
    apiClient.post<QTIAssessmentItem>('/assessment-items', data),

  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<PaginatedResponse<QTIAssessmentItem>>('/assessment-items', { params }),

  getById: (identifier: string) =>
    apiClient.get<QTIAssessmentItem>(`/assessment-items/${identifier}`),

  update: (identifier: string, data: Partial<QTIAssessmentItem>) =>
    apiClient.put<QTIAssessmentItem>(`/assessment-items/${identifier}`, data),

  delete: (identifier: string) =>
    apiClient.delete(`/assessment-items/${identifier}`),
};

export const assessmentTestService = {
  create: (data: Omit<QTIAssessmentTest, 'identifier'>) =>
    apiClient.post<QTIAssessmentTest>('/assessment-tests', data),

  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<QTIAssessmentTest>>('/assessment-tests', { params }),

  getById: (identifier: string) =>
    apiClient.get<QTIAssessmentTest>(`/assessment-tests/${identifier}`),

  update: (identifier: string, data: Partial<QTIAssessmentTest>) =>
    apiClient.put<QTIAssessmentTest>(`/assessment-tests/${identifier}`, data),

  delete: (identifier: string) =>
    apiClient.delete(`/assessment-tests/${identifier}`),
};

export const sectionService = {
  create: (assessmentTestId: string, data: Omit<QTISection, 'identifier'>) =>
    apiClient.post<QTISection>(`/assessment-tests/${assessmentTestId}/sections`, data),

  getAll: (assessmentTestId: string) =>
    apiClient.get<QTISection[]>(`/assessment-tests/${assessmentTestId}/sections`),

  getById: (assessmentTestId: string, identifier: string) =>
    apiClient.get<QTISection>(`/assessment-tests/${assessmentTestId}/sections/${identifier}`),

  update: (assessmentTestId: string, identifier: string, data: Partial<QTISection>) =>
    apiClient.put<QTISection>(`/assessment-tests/${assessmentTestId}/sections/${identifier}`, data),

  delete: (assessmentTestId: string, identifier: string) =>
    apiClient.delete(`/assessment-tests/${assessmentTestId}/sections/${identifier}`),

  search: (params: {
    query?: { title?: string; identifier?: string };
    assessmentTestId?: string;
    parentId?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }) =>
    apiClient.get<PaginatedResponse<QTISection>>('/sections/search', { params }),
};

export const curriculumService = {
  create: (data: Omit<QTICurriculum, 'identifier'>) =>
    apiClient.post<QTICurriculum>('/curricula', data),

  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<QTICurriculum>>('/curricula', { params }),

  getById: (identifier: string) =>
    apiClient.get<QTICurriculum>(`/curricula/${identifier}`),

  update: (identifier: string, data: Partial<Omit<QTICurriculum, 'identifier'>>) =>
    apiClient.put<QTICurriculum>(`/curricula/${identifier}`, data),

  delete: (identifier: string) =>
    apiClient.delete(`/curricula/${identifier}`),
}; 
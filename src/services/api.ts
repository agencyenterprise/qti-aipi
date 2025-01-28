import axios from 'axios';
import type { AssessmentItem, AssessmentTest } from '../types/qti';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Assessment Items
export const createAssessmentItem = async (qtiXml: string) => {
  const response = await api.post('/assessment-items', qtiXml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
  return response.data as AssessmentItem;
};

export const searchAssessmentItems = async (query?: string, baseType?: string) => {
  const response = await api.get('/assessment-items', {
    params: { query, baseType },
  });
  return response.data as AssessmentItem[];
};

export const getAssessmentItem = async (identifier: string) => {
  const response = await api.get(`/assessment-items/${identifier}`);
  return response.data as AssessmentItem;
};

// Assessment Tests
export const createAssessmentTest = async (test: AssessmentTest) => {
  const response = await api.post('/assessment-tests', test);
  return response.data as AssessmentTest;
};

export const searchAssessmentTests = async (
  query?: string,
  navigationMode?: 'linear' | 'nonlinear',
  submissionMode?: 'individual' | 'simultaneous'
) => {
  const response = await api.get('/assessment-tests', {
    params: { query, navigationMode, submissionMode },
  });
  return response.data as AssessmentTest[];
};

export const getAssessmentTest = async (identifier: string) => {
  const response = await api.get(`/assessment-tests/${identifier}`);
  return response.data as AssessmentTest;
};

// Sections
export const addItemToSection = async (
  sectionIdentifier: string,
  itemId: string,
  orderIndex: number
) => {
  const response = await api.post(`/sections/${sectionIdentifier}/items`, {
    itemId,
    orderIndex,
  });
  return response.data;
};

export const removeItemFromSection = async (
  sectionIdentifier: string,
  itemId: string
) => {
  await api.delete(`/sections/${sectionIdentifier}/items/${itemId}`);
};

export const updateItemOrder = async (
  sectionIdentifier: string,
  itemId: string,
  orderIndex: number
) => {
  const response = await api.put(
    `/sections/${sectionIdentifier}/items/${itemId}/order`,
    { orderIndex }
  );
  return response.data;
}; 
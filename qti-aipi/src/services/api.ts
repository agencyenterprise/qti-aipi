import axios from 'axios';

interface SectionCreate {
  title: string;
  description?: string;
  navigationMode?: 'linear' | 'nonlinear';
  submissionMode?: 'individual' | 'simultaneous';
  itemReferences?: string[];
}

export interface AssessmentResponse {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published';
  createdAt: string;
  questionsCount: number;
  rawXml?: string;
}

export interface QtiConversionResult {
  testXml: string;
  items: Array<{
    xml: string;
    identifier: string;
    href: string;
  }>;
}

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Assessment Items API
export const assessmentItemsApi = {
  create: async (qtiXml: string) => {
    const response = await api.post('/assessment-items', qtiXml, {
      headers: { 'Content-Type': 'text/xml' },
    });
    return response.data;
  },

  search: async (query?: string, baseType?: string) => {
    const response = await api.get('/assessment-items', {
      params: { query, baseType },
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  getById: async (identifier: string) => {
    const response = await api.get(`/assessment-items/${identifier}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  update: async (identifier: string, qtiXml: string) => {
    const response = await api.put(`/assessment-items/${identifier}`, qtiXml, {
      headers: { 'Content-Type': 'text/xml' }
    });
    return response.data;
  },

  delete: async (identifier: string) => {
    await api.delete(`/assessment-items/${identifier}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  },
};

// Assessment Tests API
export const assessmentTestsApi = {
  create: async (qtiData: QtiConversionResult): Promise<AssessmentResponse> => {
    console.log('Creating assessment test with XML...');
    console.log('XML Content:', qtiData.testXml);
    
    // Extract identifier and title from XML
    const identifier = qtiData.testXml.match(/identifier="([^"]+)"/)?.[1];
    const title = qtiData.testXml.match(/title="([^"]+)"/)?.[1];
    
    if (!identifier || !title) {
      throw new Error('XML must contain identifier and title attributes');
    }

    // Extract navigation and submission modes from XML
    const navigationMode = qtiData.testXml.match(/navigation-mode="([^"]+)"/)?.[1] || 'linear';
    const submissionMode = qtiData.testXml.match(/submission-mode="([^"]+)"/)?.[1] || 'individual';
    
    const response = await api.post('/assessment-tests', {
      identifier,
      title,
      navigationMode,
      submissionMode,
      rawXml: qtiData.testXml
    }, {
      headers: { 
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  },

  search: async (
    query?: string,
    navigationMode?: 'linear' | 'nonlinear',
    submissionMode?: 'individual' | 'simultaneous'
  ): Promise<AssessmentResponse[]> => {
    try {
      const response = await api.get('/assessment-tests', {
        params: { query, navigationMode, submissionMode },
        headers: { 'Content-Type': 'application/json' }
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  },

  getById: async (identifier: string): Promise<AssessmentResponse> => {
    const response = await api.get(`/assessment-tests/${identifier}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  update: async (identifier: string, qtiXml: string): Promise<AssessmentResponse> => {
    const response = await api.put(`/assessment-tests/${identifier}`, qtiXml, {
      headers: { 'Content-Type': 'text/xml' }
    });
    return response.data;
  },

  delete: async (identifier: string): Promise<void> => {
    await api.delete(`/assessment-tests/${identifier}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  },
};

// Sections API
export const sectionsApi = {
  create: async (sectionData: SectionCreate) => {
    const response = await api.post('/sections', sectionData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },

  search: async (query?: string) => {
    const response = await api.get('/sections', {
      params: { query },
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  },
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Response error:', error.response);
      switch (error.response.status) {
        case 400:
          throw new Error('Invalid request. Please check your data.');
        case 404:
          throw new Error('Resource not found.');
        case 415:
          throw new Error('Invalid content type. XML format required.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error('An error occurred. Please try again.');
      }
    }
    throw error;
  }
); 

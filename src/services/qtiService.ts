import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_QTI_BASE_URL;

export const qtiService = {
  // Get all QTI items with optional pagination and search
  getAllItems: async (page = 1, limit = 10, search = '') => {
    try {
      const response = await axios.get(`${baseURL}/qti-items`, {
        params: { page, limit, search }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  },

  // Get a single QTI item by identifier
  getItem: async (identifier: string) => {
    try {
      const response = await axios.get(`${baseURL}/qti-items/${identifier}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  }
};
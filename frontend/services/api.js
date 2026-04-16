import axios from 'axios';
import { getToken } from './auth';

const BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats/');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const fetchTrends = async () => {
  try {
    const response = await api.get('/trends/');
    return response.data;
  } catch (error) {
    console.error('Error fetching trends:', error);
    throw error;
  }
};

export const fetchThemes = async () => {
  try {
    const response = await api.get('/themes/');
    return response.data;
  } catch (error) {
    console.error('Error fetching themes:', error);
    throw error;
  }
};

export const analyzeSentiment = async (text) => {
  try {
    const response = await api.post('/analyze/', { text });
    return response.data;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
};

export const bulkAnalyze = async (texts) => {
  try {
    const response = await api.post('/bulk-analyze/', { texts });
    return response.data;
  } catch (error) {
    console.error('Error in bulk analysis:', error);
    throw error;
  }
};

export const fetchInsights = async () => {
  try {
    const response = await api.get('/insights/');
    return response.data;
  } catch (error) {
    console.error('Error fetching insights:', error);
    throw error;
  }
};

export const uploadData = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload-data/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading data:', error);
    throw error;
  }
};

export default api;

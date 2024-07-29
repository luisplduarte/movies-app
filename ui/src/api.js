import axios from 'axios';
import useAuth from './useAuth';

const useApi = () => {
  const { token, clearToken } = useAuth();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add JWT token to all requests
  api.interceptors.request.use(
    (config) => {
      if (token) config.headers['Authorization'] = token;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle all responses
  api.interceptors.response.use(
    (response) => { return response },
    (error) => {
      if (error.response.status === 401) {
        clearToken();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return api;
};

const useApiServices = () => {
  const api = useApi();

  return {
    login: async (username, password) => {
      const response = await api.post('/login', { username, password });
      return response.data;
    },
    signUp: async (username, password) => {
      const response = await api.post('/signup', { username, password });
      return response.data;
    },
    getProfile: async () => {
      const response = await api.get('/profile');
      return response.data;
    }
  };
};

export default useApiServices;
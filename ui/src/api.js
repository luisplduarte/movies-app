import axios from 'axios';
import useAuth from './useAuth';

const useApi = () => {
  const { token } = useAuth();

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
    },
  );

  // Response interceptor to handle all responses
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        window.location.href = '/logout';
      }
      return Promise.reject(error);
    },
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
    },

    /**
     * Endpoint to get the info of a specific movie from moviesDB
     */
    getMovie: async (id) => {
      const response = await api.get(`/movies/${id}`);
      return response?.data;
    },

    /**
     * Endpoint to get the movies that have a string in the title from moviesDB
     */
    getMoviesByTitle: async (title) => {
      const response = await api.get(`/movies?title=${title}`);
      return response?.data?.results
    },

    /**
     * Endpoint to get the top 10 most popular movies from moviesDB
     */
    getMostPopularMovies: async () => {
      const response = await api.get('/movies/popular');
      return response?.data?.results;
    },
  };
};

export default useApiServices;

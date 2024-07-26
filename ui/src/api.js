import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers['Authorization'] = `${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle all responses
api.interceptors.response.use(
  (response) => { return response },
  (error) => {
    if (error.response.status === 401) {
      // Redirects to login page if token is not valid or if it expired
      localStorage.removeItem('token')
      //TODO: check if this is the best way to redirect
      window.location.href = '/login'
    }
    return Promise.reject(error);
  }
)

export const login = async (username, password) => {
    const response = await api.post('/login', { username, password })
    return response.data
}

export const signUp = async (username, password) => {
    const response = await api.post('/signup', { username, password })
    return response.data
}

export const getProfile = async () => {
  const response = await api.get('/profile')
  return response.data
}
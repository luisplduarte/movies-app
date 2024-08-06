const axios = require('axios');

// Axios instance with MovieDB configuration
const axiosInstance = axios.create({
  baseURL: process.env.MOVIES_DB_BASE_URL,
  headers: {
    'Authorization': `Bearer ${process.env.MOVIES_DB_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

module.exports = axiosInstance;

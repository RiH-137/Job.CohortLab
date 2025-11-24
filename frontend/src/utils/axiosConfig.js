import axios from 'axios';

// Determine the correct base URL
const getBaseURL = () => {
  // First try environment variable
  const envBaseURL = import.meta.env.VITE_API_BASE_URL;
  
  // If environment variable exists and is not localhost, use it
  if (envBaseURL && !envBaseURL.includes('localhost')) {
    return envBaseURL;
  }
  
  // Check if we're in production (deployed)
  const isProduction = window.location.hostname !== 'localhost';
  
  if (isProduction) {
    // We're in production, use production backend URL
    return 'https://job-cohortlab-backend.onrender.com';
  } else {
    // We're in development, use local backend
    return 'http://localhost:3000';
  }
};

const baseURL = getBaseURL();

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Log the request for debugging
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    console.log('Environment:', import.meta.env.VITE_API_BASE_URL);
    console.log('Current hostname:', window.location.hostname);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Better error handling for network issues
    if (error.code === 'ERR_NETWORK') {
      error.message = 'Network error. Please check your connection and try again.';
    } else if (error.code === 'ERR_BLOCKED_BY_CLIENT') {
      error.message = 'Request blocked. Please check your ad blocker or browser settings.';
    } else if (!error.response) {
      error.message = 'Server is not responding. Please try again later.';
    }
    
    return Promise.reject(error);
  }
);

export default api;
import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
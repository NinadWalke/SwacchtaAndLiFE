import axios from 'axios';

const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT || "development";

const API_BASE = ENVIRONMENT === "development"
  ? process.env.REACT_APP_API_URL_LOCAL
  : process.env.REACT_APP_API_URL_PROD;
  
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // automatically applied for all requests
});

// JWT tokens for Committee Authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("committeeToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;
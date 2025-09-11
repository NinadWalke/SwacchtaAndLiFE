import axios from 'axios';

const ENVIRONMENT = process.env.REACT_APP_ENVIRONMENT || "development";

const API_BASE = ENVIRONMENT === "development"
  ? process.env.REACT_APP_API_URL_LOCAL
  : process.env.REACT_APP_API_URL_PROD;
  
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // automatically applied for all requests
});

export default api;
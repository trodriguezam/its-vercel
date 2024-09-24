// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  // baseURL: 'https://its-backend-076f2e73fcd4.herokuapp.com/api',
});

export default axiosInstance;
  
// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://its-backend-076f2e73fcd4.herokuapp.com/api',
});

export default axiosInstance;

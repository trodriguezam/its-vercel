// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:3000/api',
  baseURL: 'https://its-backend-bb7981776b07.herokuapp.com/api',
});

export default axiosInstance;
  
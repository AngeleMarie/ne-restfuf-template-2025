// src/api/axios.jsx
import axios from 'axios';

export const BASE_URL = 'http://localhost:5600/api/v1';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

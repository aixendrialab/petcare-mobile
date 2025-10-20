import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE || 'http://127.0.0.1:8001/api/v1',
  timeout: 15000,
});


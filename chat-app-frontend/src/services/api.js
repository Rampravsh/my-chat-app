import axios from 'axios';

// Create an Axios instance with a base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to protected requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token'); // Assuming you store your token in localStorage

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
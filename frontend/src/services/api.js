import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD
        ? (import.meta.env.VITE_API_URL || '/v1/api')
        : '/v1/api', // Use Vite proxy for API calls in development
    withCredentials: true,
});

export default api;

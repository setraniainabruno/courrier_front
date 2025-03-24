import axios from 'axios';

const validateAxios = axios.create({
    baseURL: 'https://gestion-courrier-app.onrender.com',
    // baseURL: 'http://localhost:3725',
});

validateAxios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default validateAxios;

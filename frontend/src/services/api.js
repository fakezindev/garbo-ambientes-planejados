import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // A porta do nosso Spring Boot
});

// --- O INTERCEPTOR (O Entregador) ---
api.interceptors.request.use(
    (config) => {
        // 1. Procura a "pulseira VIP" guardada no chaveiro do navegador
        const token = localStorage.getItem('garbo_token');

        // 2. Se a pulseira existir, cola ela no Cabeçalho (Header)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080', // A porta do nosso Spring Boot
    timeout: 30000, 
});

// --- O INTERCEPTOR (O Entregador) ---
api.interceptors.request.use(
    (config) => {
        // 1. Tenta pegar a chave de Admin primeiro
        let token = localStorage.getItem('garbo_token');

        // 2. Se não achar a de Admin, tenta pegar a chave do Cliente
        if (!token) {
            token = localStorage.getItem('client_token');
        }

        // 3. Se achou alguma das duas, cola no cabeçalho e manda pro Java!
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
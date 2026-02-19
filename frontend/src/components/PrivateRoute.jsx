import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // 1. O Guarda-costas olha no bolso (localStorage) para ver se tem a chave
    const token = localStorage.getItem('garbo_token');

    // 2. Se tiver a chave, ele deixa renderizar a tela (children)
    // Se não tiver, ele te redireciona direto pro /login
    return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
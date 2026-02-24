import { Navigate } from 'react-router-dom';

function ClientPrivateRoute({ children }) {
    // Busca a "pulseira VIP" do cliente no navegador
    const token = localStorage.getItem('client_token');

    // Se não tiver o token de cliente, chuta de volta para a tela de login do cliente
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Se tiver o token, libera a passagem para ver o componente
    return children;
}

export default ClientPrivateRoute;
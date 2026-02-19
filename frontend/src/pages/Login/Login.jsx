import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('garbo_token', response.data.token);
            navigate('/admin');
        } catch (err) {
            console.error("Erro ao fazer login:", err);
            setError('Credenciais inválidas. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <h2>GARBO</h2>
                    <p>Acesso Restrito</p>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label>Usuário</label>
                        <input 
                            type="text" 
                            placeholder="Digite seu usuário" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Senha</label>
                        <input 
                            type="password" 
                            placeholder="Digite sua senha" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar no Sistema'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
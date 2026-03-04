import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../components/Auth.css';
import '../AdminLogin/AdminLogin.css';
import logoGarbo from "../../assets/logo_header.png";

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
        <div className="auth-container">
            <div className="auth-card">
                <div className="logo-garbo">
                    <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src={logoGarbo}
                            alt="Garbo Arquitetura e Planejados"
                            style={{ height: '50px', width: 'auto' }} // Ajuste a altura conforme necessário
                        />
                    </a>
                </div>

                {/* Mantive o erro, mas adicionei uma cor vermelha inline para destacar */}
                {error && <div style={{ color: '#ff4d4f', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleLogin} className="auth-form">

                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '5px' }}>
                        <label style={{ color: '#ccc', fontSize: '0.9rem' }}><strong>Usuário</strong></label>
                        <input
                            type="text"
                            placeholder="Digite seu usuário"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="auth-input"
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '5px' }}>
                        <label style={{ color: '#ccc', fontSize: '0.9rem' }}><strong>Senha</strong></label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="auth-input"
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar no Sistema'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
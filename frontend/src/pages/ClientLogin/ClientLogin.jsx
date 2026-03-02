import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js'; 
import '../../components/Auth.css'; 
import { Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 👇 Ajuste a rota para a sua rota real de autenticação de cliente no Java
            const response = await api.post('/auth/client/login', { 
                email, 
                password 
            });
            
            // Salva o token específico do cliente (não sobrepõe o do admin!)
            localStorage.setItem('client_token', response.data.token);
            
            // Opcional: Salva os dados do cliente para exibir um "Olá, Família Silva!" na tela
            if (response.data.client) {
                localStorage.setItem('client_data', JSON.stringify(response.data.client));
            }

            // Redireciona para a vitrine/área do cliente
            navigate('/meu-projeto'); 
            
        } catch (err) {
            console.error(err);
            setError('E-mail ou senha incorretos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Área do Cliente</h2>
                <p className="auth-subtitle">Acompanhe o seu projeto dos sonhos.</p>

                {error && <div style={{ color: '#ff4d4f', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleLogin} className="auth-form">
                    <input 
                        type="email" 
                        placeholder="Seu e-mail" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Sua senha" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                    />

                    <button type="submit" disabled={loading} className="auth-button">
                        {loading ? 'Entrando...' : 'Acessar Meus Projetos'}
                    </button>
                </form>

                <p style={{ marginTop: '20px', color: '#888', fontSize: '0.9rem' }}>    
                    Não possui uma conta? <Link to="/cadastro" style={{ color: 'var(--gold-primary)', textDecoration: 'none', fontWeight: 'bold' }}>Faça seu cadastro</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api.js'; 
import '../../components/Auth.css'; 

function ClientRegister() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        cpfCnpj: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Chama a rota nova que acabamos de criar no Java para registrar clientes
            await api.post('/auth/client/register', formData);
            alert('Cadastro realizado com sucesso! Faça login para acessar sua área.');
            navigate('/area-cliente'); // Redireciona para a tela de login
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Erro ao realizar cadastro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Crie sua conta</h2>
                <p className="auth-subtitle">Acompanhe o projeto dos seus sonhos.</p>

                {error && <div style={{ color: '#ff4d4f', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleRegister} className="auth-form">
                    <input type="text" name="name" placeholder="Seu nome completo" value={formData.name} onChange={handleChange} required className="auth-input" />
                    <input type="email" name="email" placeholder="Seu e-mail" value={formData.email} onChange={handleChange} required className="auth-input" /> 
                    <input type="text" name="cpfCnpj" placeholder="CPF ou CNPJ" value={formData.cpfCnpj} onChange={handleChange} required className="auth-input" />
                    <input type="text" name="phone" placeholder="Telefone para contato" value={formData.phone} onChange={handleChange} required className="auth-input" />
                    <input type="password" name="password" placeholder="Crie uma senha" value={formData.password} onChange={handleChange} required className="auth-input" />

                    <button type="submit" disabled={loading} className="auth-button" style={{marginTop: '15px'}}>
                        {loading ? 'Cadastrando...' : 'Registrar'}
                    </button>
                </form>

                <p style={{ marginTop: '20px', color: '#888', fontSize: '0.9rem' }}>    
                    Já possui uma conta? <Link to="/area-cliente" style={{ color: 'var(--gold-primary)', textDecoration: 'none', fontWeight: 'bold' }}>Faça login</Link>
                </p>
            </div>
        </div>
    );
}

export default ClientRegister;
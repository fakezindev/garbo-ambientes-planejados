import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import api from '../../services/api.js';
import '../../components/Auth.css';
import logoGarbo from "../../assets/admin_logo.png";

function ClientRegister() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        cpf: '',
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

            // ✨ Toast de Sucesso Premium
            toast.success('Cadastro realizado com sucesso! Faça login para acessar sua área.', {
                position: "bottom-right",
                theme: "dark"
            });

            navigate('/area-cliente'); // Redireciona para a tela de login

        } catch (err) {
            console.error(err);

            const mensagemErro = err.response?.data?.message || 'Erro ao realizar cadastro.';

            // ✨ Toast de Erro (Opcional, mas altamente recomendado para manter o padrão)
            toast.error(mensagemErro, {
                position: "bottom-right",
                theme: "dark"
            });

            setError(mensagemErro); // Mantido caso você ainda exiba o erro em texto vermelho no formulário

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="logo-garbo" style={{ display: 'flex', justifyContent: 'center' }}>
                    <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src={logoGarbo}
                            alt="Garbo Arquitetura e Planejados"
                            style={{ height: '100px', width: 'auto', objectFit: 'contain' }} // Ajuste a altura conforme necessário
                        />
                    </a>
                </div>
                <h2 className="auth-title">Crie sua conta</h2>
                <p className="auth-subtitle">Acompanhe o projeto dos seus sonhos.</p>

                {error && <div style={{ color: '#ff4d4f', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}

                <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto 20px', textAlign: 'left' }}>
                    <Link
                        to="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#aaa',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            transition: 'color 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.color = '#d4af37';
                            e.currentTarget.style.transform = 'translateX(-3px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.color = '#aaa';
                            e.currentTarget.style.transform = 'translateX(0)';
                        }}
                    >
                        <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>←</span>
                        Voltar para a Home
                    </Link>
                </div>
                <form onSubmit={handleRegister} className="auth-form">
                    <input type="text" name="name" placeholder="Seu nome completo" value={formData.name} onChange={handleChange} required className="auth-input" />
                    <input type="email" name="email" placeholder="Seu e-mail" value={formData.email} onChange={handleChange} required className="auth-input" />
                    <input type="text" name="cpf" placeholder="CPF ou CNPJ" value={formData.cpf} onChange={handleChange} required className="auth-input" />
                    <input type="text" name="phone" placeholder="Telefone para contato" value={formData.phone} onChange={handleChange} required className="auth-input" />
                    <input type="password" name="password" placeholder="Crie uma senha" value={formData.password} onChange={handleChange} required className="auth-input" />

                    <button type="submit" disabled={loading} className="auth-button" style={{ marginTop: '15px' }}>
                        {loading ? 'Cadastrando...' : 'Registrar'}
                    </button>
                </form>

                <p style={{ marginTop: '20px', color: '#888', fontSize: '0.9rem' }}>
                    Já possui uma conta? <br /><Link to="/area-cliente" style={{ color: 'var(--gold-primary)', textDecoration: 'none', fontWeight: 'bold' }}>Faça login</Link>
                </p>
            </div>
        </div>
    );
}

export default ClientRegister;
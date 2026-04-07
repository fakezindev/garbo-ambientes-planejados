import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import logoGarbo from "../../assets/admin_logo.png";
import '../../components/Auth.css';
import api from '../../services/api.js';

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
        const { name, value } = e.target;
        let newValue = value;

        // Intercepta e aplica a máscara dependendo de qual input está sendo digitado
        if (name === "cpf") {
            newValue = formatCPF(value);
        } else if (name === "phone") {
            newValue = formatPhone(value);
        }

        setFormData({
            ...formData,
            [name]: newValue,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        // 🛑 1. TRAVA DO FRONTEND ANTES DE CHAMAR O JAVA
        if (formData.cpf.length < 14) {
            toast.warning("Por favor, digite o CPF completo.");
            return; // Interrompe a função aqui
        }

        if (formData.phone.length < 15) {
            toast.warning("Por favor, digite o telefone completo com DDD.");
            return; // Interrompe a função aqui
        }

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

    // 🎭 Máscara para formatar o CPF automaticamente: 000.000.000-00
    const formatCPF = (value) => {
        return value
        .replace(/\D/g, '') // Remove tudo o que não é dígito
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos
        .replace(/(\d{3})(\d)/, '$1.$2') // Coloca um ponto entre o terceiro e o quarto dígitos de novo (para o segundo bloco)
        .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca um hífen entre o terceiro e o quarto dígitos
        .replace(/(-\d{2})\d+?$/, '$1'); // Impede de digitar mais de 11 números
    };

    // 🎭 Máscara para formatar o Telefone automaticamente: (00) 90000-0000
    const formatPhone = (value) => {
        return value
        .replace(/\D/g, '') // Remove o que não é número
        .replace(/(\d{2})(\d)/, '($1) $2') // Coloca parênteses no DDD
        .replace(/(\d{4,5})(\d{4})/, '$1-$2') // Coloca o hífen no meio do número
        .replace(/(-\d{4})\d+?$/, '$1'); // Impede de digitar a mais
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
                    <input
                        type="text" // Use text no lugar de number para o hífen e pontos funcionarem
                        name="cpf"
                        placeholder="000.000.000-00"
                        value={formData.cpf} // ou formData.cpf
                        onChange={handleChange} // 👈 Aplica a máscara aqui!
                        className="input-field"
                    />
                    <input
                        type="text" 
                        name="phone"
                        placeholder="(11) 99999-9999"
                        value={formData.phone} // ou formData.phone
                        onChange={handleChange} // 👈 Aplica a máscara aqui!
                        className="input-field"
                    />
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
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api.js'; 

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
        <div className="login-container">
            <div className="login-card">
                <h2>Crie sua conta</h2>
                <p>Acompanhe o projeto dos seus sonhos.</p>

                {error && <div className="error-message" style={{color: 'red'}}>{error}</div>}

                <form onSubmit={handleRegister} className="login-form">
                    <input type="text" name="name" placeholder="Seu nome completo" value={formData.name} onChange={handleChange} required className="input-field" />
                    <input type="email" name="email" placeholder="Seu e-mail" value={formData.email} onChange={handleChange} required className="input-field" /> 
                    <input type="text" name="cpfCnpj" placeholder="CPF ou CNPJ" value={formData.cpfCnpj} onChange={handleChange} required className="input-field" />
                    <input type="text" name="phone" placeholder="Telefone para contato" value={formData.phone} onChange={handleChange} required className="input-field" />
                    <input type="password" name="password" placeholder="Crie uma senha" value={formData.password} onChange={handleChange} required className="input-field" />

                    <button type="submit" disabled={loading} className="btn-primary" style={{marginTop: '15px'}}>
                        {loading ? 'Cadastrando...' : 'Registrar'}
                    </button>
                </form>

                <p style={{ marginTop: '15px', textAlign: 'center' }}>    
                    Já possui uma conta? <Link to="/area-cliente">Faça login</Link>
                </p>
            </div>
        </div>
    );
}

export default ClientRegister;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api'; // Ajuste o caminho se necessário
import './Home.css'; // Vamos criar esse CSS no próximo passo!

const Home = () => {
    const [projects, setProjects] = useState([]);


    const [leadName, setLeadName] = useState('');
    const [leadEmail, setLeadEmail] = useState('');
    const [leadPhone, setLeadPhone] = useState('');
    const [leadEnvironment, setLeadEnvironment] = useState('');
    const [leadStatus, setLeadStatus] = useState('');

    // Busca os projetos reais do seu banco de dados ao carregar a página
    useEffect(() => {
        api.get('/projects')
            .then((response) => setProjects(response.data))
            .catch((err) => console.error("Erro ao buscar projetos:", err));
    }, []);

    const handleSubmitLead = async (e) => {
        e.preventDefault();
        setLeadStatus('Enviando...');

        try {
            // Ajuste a rota '/leads' se no seu Java estiver diferente
            await api.post('/leads', {
                name: leadName,
                email: leadEmail,
                phone: leadPhone,
                environment: leadEnvironment
            });
            
            setLeadStatus('Sucesso! Em breve nossa equipe entrará em contato.');
            // Limpa o formulário
            setLeadName(''); setLeadEmail(''); setLeadPhone(''); setLeadEnvironment('');
        } catch (error) {
            console.error("Erro ao enviar lead:", error);
            setLeadStatus('Erro ao enviar. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="home-container">
            {/* 1. CABEÇALHO (Menu de Navegação) */}
            <header className="public-header">
                <div className="logo-garbo">GARBO</div>
                <nav className="main-nav">
                    <a href="#sobre">Sobre Nós</a>
                    <a href="#portfolio">Projetos</a>
                    <a href="#contato">Orçamento</a>
                    {/* Esse botão vai levar o cliente para a futura área restrita */}
                    <Link to="/login" className="btn-area-cliente">Área do Cliente</Link>
                </nav>
            </header>

            {/* 2. HERO SECTION (A primeira impressão de impacto) */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Transformando Espaços em Sonhos Planejados</h1>
                    <p>Design exclusivo, marcenaria de alto padrão e pontualidade na entrega. O seu ambiente perfeito começa aqui.</p>
                    <a href="#contato" className="btn-hero">Solicite um Orçamento</a>
                </div>
            </section>

            {/* 3. MISSÃO, VISÃO E VALORES (Institucional) */}
            <section id="sobre" className="mvv-section">
                <div className="section-title">
                    <h2>Quem Somos</h2>
                    <p>A excelência por trás de cada detalhe.</p>
                </div>
                
                <div className="mvv-grid">
                    <div className="mvv-card">
                        <div className="icon">🎯</div>
                        <h3>Missão</h3>
                        <p>Entregar ambientes planejados que unam estética refinada, funcionalidade inteligente e o estilo único de cada cliente.</p>
                    </div>
                    <div className="mvv-card">
                        <div className="icon">👁️</div>
                        <h3>Visão</h3>
                        <p>Ser referência em arquitetura e design de interiores pela excelência, transparência e inovação nos projetos.</p>
                    </div>
                    <div className="mvv-card">
                        <div className="icon">💎</div>
                        <h3>Valores</h3>
                        <p>Qualidade Absoluta, Respeito aos prazos combinados, Transparência no atendimento e Foco no detalhe.</p>
                    </div>
                </div>
            </section>

            {/* 4. GALERIA DE PROJETOS (A Vitrine conectada ao Backend) */}
            <section id="portfolio" className="portfolio-public">
                <div className="section-title">
                    <h2>Nosso Portfólio</h2>
                    <p>Inspire-se com os nossos trabalhos mais recentes.</p>
                </div>

                <div className="projects-grid public-grid">
                    {projects.map((project) => (
                        <div key={project.id} className="project-card">
                            <div className="card-image-container">
                                {project.coverImageUrl ? (
                                    <img src={project.coverImageUrl} alt={project.title} className="card-image" />
                                ) : (
                                    <div className="no-image">Sem Imagem</div>
                                )}
                            </div>
                            <div className="card-content">
                                <span className="badge">{project.category}</span>
                                <h3 className="card-title">{project.title}</h3>
                                <p className="card-desc">{project.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. CAPTAÇÃO DE LEADS (O Formulário de Contato) */}
            <section id="contato" className="contact-section">
                <div className="contact-box">
                    <h2>Comece o Seu Projeto</h2>
                    <p>Preencha os dados abaixo e nossa equipe entrará em contato para entender a sua necessidade.</p>
                    
                    {/* Mais para frente, vamos conectar isso ao seu POST /leads no Java */}
                    <form className="lead-form" onSubmit={handleSubmitLead}>
                        <input 
                            type="text" 
                            placeholder="Seu Nome Completo" 
                            value={leadName}
                            onChange={(e) => setLeadName(e.target.value)}
                            required 
                        />
                        <input 
                            type="email" 
                            placeholder="Seu E-mail" 
                            value={leadEmail}
                            onChange={(e) => setLeadEmail(e.target.value)}
                            required 
                        />
                        <input 
                            type="tel" 
                            placeholder="Seu WhatsApp" 
                            value={leadPhone}
                            onChange={(e) => setLeadPhone(e.target.value)}
                            required 
                        />
                        <select 
                            value={leadEnvironment}
                            onChange={(e) => setLeadEnvironment(e.target.value)}
                            required
                        >
                            <option value="">Qual ambiente deseja planejar?</option>
                            <option value="Cozinha">Cozinha Completa</option>
                            <option value="Quarto">Quarto / Closet</option>
                            <option value="Sala">Sala de Estar / Home</option>
                            <option value="Banheiro">Banheiro</option>
                            <option value="Comercial">Ambiente Comercial</option>
                            <option value="Outro">Projeto Completo (Casa toda)</option>
                        </select>
                        <button type="submit" className="btn-submit-lead">Enviar Solicitação</button>
                    </form>

                    {/* Mensagem de feedback para o cliente */}
                    {leadStatus && (
                        <p style={{ marginTop: '15px', fontWeight: 'bold', color: leadStatus.includes('Sucesso') ? '#2ecc71' : '#e74c3c' }}>
                            {leadStatus}
                        </p>
                    )}
                </div>
            </section>

            {/* 6. RODAPÉ */}
            <footer className="public-footer">
                <p>&copy; 2026 Garbo Ambientes Planejados. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api'; // Ajuste o caminho se necessário
import './Home.css';
import imgEdna from '../../assets/edna_arquiteta.jpeg';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
                    <Link to="/area-cliente" className="btn-area-cliente">Área do Cliente</Link>
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

            {/* =========================================
    SESSÃO: QUEM SOMOS (AS SÓCIAS)
    ========================================= */}
            <section className="about-section" id="sobre">
                <div className="section-title">
                    <h2 style={{ color: '#d4af37' }}>Quem Somos</h2>
                    <p style={{ color: '#aaa', marginTop: '10px' }}>
                        As mentes brilhantes por trás da Garbo Ambientes Planejados
                    </p>
                </div>

                <div className="team-grid">
                    {/* CARD 1: EDNA RAMOS */}
                    <div className="team-card">
                        <div className="team-image-wrapper">
                            <img src={imgEdna} alt="Edna da Silva Ramos Alves" className="team-image" />
                        </div>
                        <div className="team-info">
                            <h3>Edna da Silva Ramos Alves</h3>
                            <span className="team-role">Sócia-Fundadora & Arquiteta</span>
                            <p>
                                Com anos de experiência em transformar espaços em verdadeiros lares,
                                Edna traz o olhar técnico, sofisticado e acolhedor da arquitetura
                                para cada projeto desenvolvido pela Garbo.
                            </p>
                        </div>
                    </div>

                    {/* CARD 2: MARCIA */}
                    <div className="team-card">
                        <div className="team-image-wrapper">
                            <div className="placeholder-image" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#0a0a0a' }}>
                                <span style={{ fontSize: '3rem' }}>📸</span>
                                <p style={{ marginTop: '10px', color: '#666' }}>Foto da Marcia</p>
                            </div>
                        </div>
                        <div className="team-info">
                            <h3>Marcia</h3>
                            <span className="team-role">Sócia-Fundadora & Arquiteta</span>
                            <p>
                                Especialista em planejamento e execução de excelência, Marcia garante
                                que cada milímetro do seu projeto saia do papel com precisão,
                                qualidade e pontualidade.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
    SESSÃO: NOSSO PROPÓSITO (MVV)
    ========================================= */}
            <section className="mvv-section" id="proposito">
                <div className="section-title">
                    <h2 style={{ color: '#d4af37' }}>Nosso Propósito</h2>
                    <p style={{ color: '#aaa', marginTop: '10px' }}>
                        A excelência por trás de cada detalhe dos seus móveis planejados.
                    </p>
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
                    <h2 style={{ color: '#d4af37' }}>Nosso Portfólio</h2>
                    <p style={{ color: '#aaa', marginTop: '10px' }}>
                        Inspire-se com os nossos trabalhos mais recentes.
                    </p>
                </div>

                <div className="projects-grid public-grid">
                    {projects && projects.length > 0 ? (
                        projects.map((project) => (
                            <div key={project.id} className="portfolio-card">

                                {/* O container que trava a altura em 280px para TODAS as fotos */}
                                <div className="portfolio-image-wrapper">
                                    {project.imageUrls && project.imageUrls.length > 0 ? (
                                        <Swiper
                                            modules={[Navigation, Pagination]}
                                            spaceBetween={0}
                                            slidesPerView={1}
                                            navigation
                                            pagination={{ clickable: true }}
                                            style={{ width: '100%', height: '100%' }}
                                        >
                                            {project.imageUrls.map((url, imgIndex) => (
                                                <SwiperSlide key={imgIndex}>
                                                    <img
                                                        src={url}
                                                        alt={`${project.title} - ${imgIndex + 1}`}
                                                        className="portfolio-image"
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    ) : project.coverImageUrl ? (
                                        <img
                                            src={project.coverImageUrl}
                                            alt={project.title}
                                            className="portfolio-image"
                                        />
                                    ) : (
                                        /* Fundo elegante caso o projeto não tenha foto */
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', color: '#555' }}>
                                            Sem Imagem
                                        </div>
                                    )}
                                </div>

                                {/* Textos alinhados e estilizados */}
                                <div className="portfolio-content">
                                    <span className="portfolio-category">{project.category || 'PLANEJADOS'}</span>
                                    <h3 className="portfolio-title">{project.title}</h3>

                                    {/* Estilo adicionado para a descrição não quebrar o layout escuro */}
                                    <p style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '10px', lineHeight: '1.5', margin: '10px 0 0 0' }}>
                                        {project.description}
                                    </p>
                                </div>

                            </div>
                        ))
                    ) : (
                        /* Mensagem de vazio ajustada para o tema (gridColumn faz o texto centralizar na tela toda) */
                        <p style={{ textAlign: 'center', color: '#aaa', gridColumn: '1 / -1', padding: '50px 0' }}>
                            Nenhum projeto encontrado.
                        </p>
                    )}
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
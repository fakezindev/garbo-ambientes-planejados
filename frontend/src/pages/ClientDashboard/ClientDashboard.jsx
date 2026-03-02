import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

// 🪄 Imports mágicos do Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './ClientDashboard.css';

const ClientDashboard = () => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClientProject = async () => {
            try {
                const token = localStorage.getItem('garbo_token') || localStorage.getItem('token');

                // 🚨 ATENÇÃO: Ajuste essa rota para a rota real do seu Java!
                const response = await api.get('/projects/my-project', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Pega o primeiro projeto caso venha uma lista, ou pega o objeto direto
                const projectData = Array.isArray(response.data) ? response.data[0] : response.data;
                setProject(projectData);
            } catch (error) {
                console.error("Erro ao buscar projeto do cliente:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientProject();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("garbo_token");
        localStorage.removeItem("token");
        navigate("/");
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const statusList = ["PROJETO", "FABRICAÇÃO", "MONTAGEM", "CONCLUÍDO"];

    // ⏳ 1. TELA DE CARREGAMENTO
    if (loading) {
        return (
            <div style={{ backgroundColor: '#121212', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
                <h2>Carregando o seu projeto dos sonhos... ⏳</h2>
            </div>
        );
    }

    // 📭 2. TELA DE "NENHUM PROJETO"
    if (!project) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#121212', minHeight: '100vh', color: '#fff' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', maxWidth: '1200px', margin: '0 auto 3rem auto' }}>
                    <h1 style={{ color: '#f1c40f', margin: 0 }}>GARBO</h1>
                    <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Sair</button>
                </header>
                <h2>Olá! Ainda não há projetos vinculados ao seu perfil.</h2>
                <p style={{ color: '#aaa' }}>Nossa equipe está trabalhando nisso. Em breve as novidades aparecerão aqui!</p>
            </div>
        );
    }

    // 🧮 3. PREPARANDO OS DADOS DO PROJETO VIP
    const currentStatus = project.status || "FABRICAÇÃO"; // Simula status caso não venha do banco
    const currentIndex = statusList.indexOf(currentStatus);
    const progressWidth = currentIndex === 0 ? "0%" : `${(currentIndex / (statusList.length - 1)) * 100}%`;

    // ✨ 4. TELA PRINCIPAL DO CLIENTE (O RETURN PRINCIPAL)
    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh', padding: '20px', color: '#fff' }}>
            <div style={{margin: '0 auto' }}>

                {/* CABEÇALHO GERAL (LOGO E SAIR) */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: '#f1c40f', margin: 0, fontSize: '1.8rem' }}>GARBO</h1>
                    <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer', background: '#333', color: '#fff', border: '1px solid #444', borderRadius: '4px', fontWeight: 'bold' }}>Sair da Conta</button>
                </header>

                {/* CARD VIP DO PROJETO */}
                <div className="vip-project-card">

                    {/* CABEÇALHO VIP */}
                    <div className="vip-project-header">
                        <div className="vip-project-title">
                            <h2>
                                {project.title || "Gargamel"}
                                <span className="vip-tag">{project.category || "PLANEJADOS"}</span>
                            </h2>
                            <p style={{ color: '#aaa', margin: 0 }}>Acompanhamento em tempo real</p>
                        </div>
                    </div>

                    {/* LINHA DO TEMPO (PROGRESSO) */}
                    <div className="status-timeline">
                        <div className="status-progress-line" style={{ width: progressWidth }}></div>

                        {statusList.map((status, index) => {
                            let stepClass = "";
                            if (index < currentIndex) stepClass = "completed"; // Passos anteriores
                            if (index === currentIndex) stepClass = "active";  // Passo atual

                            return (
                                <div key={status} className={`status-step ${stepClass}`}>
                                    <div className="step-circle">
                                        {index < currentIndex && <span style={{ color: '#f1c40f', fontSize: '14px' }}>✓</span>}
                                    </div>
                                    <span className="step-text">{status}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* CARROSSEL DE IMAGENS */}
                    <div className="card-image-container" style={{ marginTop: '30px' }}>
                        {project.imageUrls && project.imageUrls.length > 0 ? (
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={0}
                                slidesPerView={1}
                                navigation
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 3500, disableOnInteraction: false }}
                            >
                                {project.imageUrls.map((url, index) => (
                                    <SwiperSlide key={index}>
                                        {/* 🔥 REMOVI O STYLE INLINE AQUI! AGORA O CSS CONTROLA! */}
                                        <img
                                            src={url}
                                            alt={`Ambiente ${index + 1}`}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="single-image-container">
                                {project.coverImageUrl ? (
                                    /* 🔥 REMOVI O STYLE INLINE AQUI TAMBÉM! */
                                    <img
                                        src={project.coverImageUrl}
                                        alt="Capa do Projeto"
                                    />
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '100px', background: '#1a1a1a', color: '#888', borderRadius: '12px' }}>
                                        📸 Nenhuma imagem disponível ainda.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ClientDashboard;
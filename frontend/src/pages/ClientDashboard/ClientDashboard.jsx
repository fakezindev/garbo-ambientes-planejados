import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import logoGarbo from "../../assets/logo_header.png";

// 🪄 Imports mágicos do Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './ClientDashboard.css';

const ClientDashboard = () => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [expandedImage, setExpandedImage] = useState(null);
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

                console.log("📦 PACOTE RECEBIDO DO JAVA:", projectData);
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
                {/* CABEÇALHO GERAL (LOGO E SAIR) */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div className="logo-garbo">
                        <img
                            src={logoGarbo}
                            alt="Garbo Arquitetura e Planejados"
                            style={{ height: '100px', width: 'auto' }}
                        />
                    </div>
                    <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer', background: '#333', color: '#fff', border: '1px solid #444', borderRadius: '4px', fontWeight: 'bold' }}>Sair da Conta</button>
                </header>
                <h2>Olá! Ainda não há projetos vinculados ao seu perfil.</h2>
                <p style={{ color: '#aaa' }}>Nossa equipe está trabalhando nisso. Em breve as novidades aparecerão aqui!</p>
            </div>
        );
    }

    // 🧮 3. PREPARANDO OS DADOS DO PROJETO VIP
    const currentStatus = project.status || "PROJETO";
    const currentIndex = statusList.indexOf(currentStatus);
    const progressWidth = currentIndex === 0 ? "0%" : `${(currentIndex / (statusList.length - 1)) * 100}%`;

    // 🔥 A SOLUÇÃO DEFINITIVA (À prova de falhas do Banco de Dados)
    
    // 1. Juntamos TODAS as URLs (imagens e vídeos) em uma panela só
    const urlsBrutas = [
        ...(project.imageUrls || []),
        ...(project.videoUrls || [])
    ];

    // 2. Tiramos qualquer sujeira (espaços em branco, null)
    const urlsLimpas = urlsBrutas.filter(url => url && url.trim() !== "");

    // 3. O Detetive: Olha para a extensão do arquivo para saber o que ele realmente é
    const isVideoURL = (url) => {
        const urlFormatada = url.split('?')[0].toLowerCase();
        return urlFormatada.endsWith('.mp4') || 
               urlFormatada.endsWith('.webm') || 
               urlFormatada.endsWith('.mov') || 
               urlFormatada.endsWith('.ogg');
    };

    // 4. Monta a lista final para o Swiper, etiquetando corretamente!
    const todasAsMidias = urlsLimpas.map(url => ({
        url: url,
        type: isVideoURL(url) ? "video" : "image"
    }));

    // ✨ 4. TELA PRINCIPAL DO CLIENTE (O RETURN PRINCIPAL)
    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh', padding: '20px', color: '#fff' }}>
            <div style={{ margin: '0 auto' }}>

                {/* CABEÇALHO GERAL (LOGO E SAIR) */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div className="logo-garbo">
                        <img
                            src={logoGarbo}
                            alt="Garbo Arquitetura e Planejados"
                            style={{ height: '100px', width: 'auto' }}
                        />
                    </div>
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
                            <p style={{ color: '#aaa', margin: 0 }}>{project.description}</p>
                        </div>
                    </div>

                    {/* LINHA DO TEMPO (PROGRESSO) */}
                    <div className="status-timeline">
                        <div className="status-progress-line" style={{ '--progress': progressWidth }}></div>

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

                    {/* CARROSSEL DE IMAGENS E VÍDEOS */}
                        <div className="card-image-container" style={{ marginTop: '30px' }}>
                            {todasAsMidias.length > 0 ? (
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay]}
                                    spaceBetween={0}
                                    slidesPerView={1}
                                    navigation
                                    pagination={{ clickable: true }}
                                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                                    onSwiper={(swiper) => setSwiperInstance(swiper)}
                                >
                                    {todasAsMidias.map((midia, index) => (
                                        <SwiperSlide key={index} className="premium-slide">
        
                                            {/* Fundo Desfocado */}
                                            <div 
                                                className="media-blur-bg" 
                                                style={{ backgroundImage: `url(${midia.type === 'image' ? midia.url : (project.coverImageUrl || '')})` }}
                                            ></div>

                                            {/* Vídeo ou Imagem */}
                                            {midia.type === "video" ? (
                                                <video
                                                    controls
                                                    playsInline
                                                    className="media-content video-content"
                                                    preload="metadata"
                                                    onPlay={() => swiperInstance?.autoplay?.stop()}
                                                    onPause={() => swiperInstance?.autoplay?.start()}
                                                    onEnded={() => swiperInstance?.autoplay?.start()}
                                                >
                                                    {/* E aqui a URL tem que vir de midia.url */}
                                                    <source src={midia.url} type="video/mp4" />
                                                    Seu navegador não suporta vídeos.
                                                </video>
                                            ) : (
                                                <> {/* Fragmento para agrupar a imagem e o botão */}
                                                    <img
                                                        src={midia.url}
                                                        alt={`Ambiente ${index + 1}`}
                                                        className="media-content"
                                                    />
                                                    {/* 👇 O NOVO BOTÃO DE EXPANDIR */}
                                                    <button 
                                                        className="expand-btn"
                                                        onClick={() => setExpandedImage(midia.url)}
                                                        title="Ver em Tela Cheia"
                                                    >
                                                        {/* Ícone de Expandir (SVG Nativo) */}
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                                                        </svg>
                                                    </button>
                                                </>
                                                
                                            )}
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                <div className="single-image-container premium-slide">
                                    {/* O Fundo Desfocado da Capa */}
                                    <div 
                                        className="media-blur-bg" 
                                        style={{ backgroundImage: `url(${project.coverImageUrl || ''})` }}
                                    ></div>

                                    {project.coverImageUrl ? (
                                        <img
                                            src={project.coverImageUrl}
                                            alt="Capa do Projeto"
                                            className="media-content"
                                        />
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '100px', background: '#1a1a1a', color: '#888', borderRadius: '12px' }}>
                                            📸 Nenhuma mídia disponível ainda.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                </div>

            </div>
        
            {expandedImage && (
                <div className="lightbox-overlay">
                    <button className="lightbox-close" onClick={() => setExpandedImage(null)} title="Fechar">
                        &times;
                    </button>
                    
                    {/* O Motor de Zoom */}
                    <TransformWrapper
                        initialScale={1}
                        minScale={1}
                        maxScale={4} /* Permite dar zoom de até 4x */
                        centerOnInit={true}
                        wheel={{ wheelDisabled: false, step: 0.05, }} /* Zoom no Scroll do Mouse */
                        animation={{
                            disabled: false,
                            animationTime: 400, // Tempo da animação em milissegundos (deixa o zoom mais dramático)
                            animationType: "easeOut"
                        }}
                        panning={{ 
                            velocityDisabled: false, // Mantém o movimento fluido quando o usuário solta o botão
                        }}
                        pinch={{ step: 5 }} /* Sensibilidade da pinça no celular */
                        doubleClick={{ disabled: false, mode: "toggle", step: 1.5}} /* Zoom ao dar 2 cliques */
                    >
                        {/* Wrapper interno que segura a imagem */}
                        <TransformComponent 
                            wrapperStyle={{ width: "100%", height: "100%" }} 
                            contentStyle={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
                        >
                            <img src={expandedImage} alt="Imagem Expandida" className="lightbox-image" />
                        </TransformComponent>
                    </TransformWrapper>

                </div>
            )}
        </div>
    );
}

export default ClientDashboard;
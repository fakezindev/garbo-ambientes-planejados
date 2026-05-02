import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import logoGarbo from "../../assets/logo_header.png";

// 🪄 Imports mágicos do Swiper e Zoom
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify'; // Para dar um aviso visual de "Baixando..."

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './ClientDashboard.css';

const ClientDashboard = () => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [expandedMedia, setExpandedMedia] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false); // 👈 Controle do botão de download
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClientProject = async () => {
            try {
                const token = localStorage.getItem('garbo_token') || localStorage.getItem('token');

                const response = await api.get('/projects/my-project', {
                    headers: { Authorization: `Bearer ${token}` }
                });

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

    const statusList = ["PROJETO", "FABRICAÇÃO", "MONTAGEM", "CONCLUÍDO"];
    
    // ⏳ 1. TELA DE CARREGAMENTO
    if (loading) {
        return (
            <div className="dashboard-loading">
                <h2>Carregando o seu projeto dos sonhos... ⏳</h2>
            </div>
        );
    }

    // 📭 2. TELA DE "NENHUM PROJETO"
    if (!project) {
        return (
            <div className="dashboard-empty">
                <header className="dashboard-header">
                    <div className="logo-garbo">
                        <img src={logoGarbo} alt="Garbo Arquitetura e Planejados" />
                    </div>
                    <button className="btn-logout" onClick={handleLogout}>Sair da Conta</button>
                </header>
                <h2>Olá! Ainda não há projetos vinculados ao seu perfil.</h2>
                <p>Nossa equipe está trabalhando nisso. Em breve as novidades aparecerão aqui!</p>
            </div>
        );
    }

    // 🧮 3. PREPARANDO OS DADOS DO PROJETO VIP
    const currentStatus = project.status || "PROJETO";
    const currentIndex = statusList.indexOf(currentStatus);
    const progressWidth = currentIndex === 0 ? "0%" : `${(currentIndex / (statusList.length - 1)) * 100}%`;

    const urlsBrutas = [...(project.imageUrls || []), ...(project.videoUrls || [])];
    const urlsLimpas = urlsBrutas.filter(url => url && url.trim() !== "");

    const isVideoURL = (url) => {
        const urlFormatada = url.split('?')[0].toLowerCase();
        return urlFormatada.match(/\.(mp4|webm|mov|ogg)$/);
    };

    const todasAsMidias = urlsLimpas.map(url => ({
        url: url,
        type: isVideoURL(url) ? "video" : "image"
    }));

    // 🗂️ FUNÇÃO PARA GERAR E BAIXAR O ZIP (BLINDADA CONTRA CORS)
    const handleDownloadProject = async () => {
        setIsDownloading(true);
        toast.info("Preparando os arquivos... Isso pode levar alguns segundos.", { theme: "dark" });

        try {
            const zip = new JSZip();
            const folderName = project.title ? project.title.replace(/[^a-z0-9]/gi, '_') : "Projeto_Garbo";
            const folder = zip.folder(folderName);

            const allUrls = [
                project.coverImageUrl,
                ...(project.imageUrls || []),
                ...(project.videoUrls || [])
            ].filter(url => url && url.trim() !== "");

            const uniqueUrls = [...new Set(allUrls)];

            if (uniqueUrls.length === 0) {
                toast.warning("Não há mídias para baixar neste projeto.", { theme: "dark" });
                setIsDownloading(false);
                return;
            }

            let successCount = 0; // 🏆 O Contador: Vamos vigiar se pelo menos 1 arquivo deu certo

            const fetchPromises = uniqueUrls.map(async (url, index) => {
                try {
                    // 🏆 O TRUQUE: Cria um número aleatório (timestamp) para enganar o cache do navegador
                    const timestamp = new Date().getTime();
                    // Adiciona o timestamp no final do link (se já tiver '?', usa '&', senão usa '?')
                    const fetchUrl = url.includes('?') ? `${url}&cb=${timestamp}` : `${url}?cb=${timestamp}`;

                    // 🏆 Forçamos o 'cors' e dizemos para o navegador ignorar o cache ('no-store')
                    const response = await fetch(fetchUrl, {
                        mode: 'cors',
                        cache: 'no-store'
                    });
                    
                    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
                    
                    const blob = await response.blob();
                    
                    const urlParts = url.split('?')[0].split('/');
                    let filename = urlParts[urlParts.length - 1];
                    if (!filename || filename === "") filename = `midia_${index + 1}.jpg`;

                    folder.file(filename, blob);
                    successCount++; 

                } catch (error) {
                    console.error(`Erro ao baixar a mídia: ${url}`, error);
                }
            });

            // Espera todos tentarem baixar
            await Promise.all(fetchPromises);

            // 🚨 A TRAVA DE SEGURANÇA: Se o contador for zero, é porque o CORS bloqueou tudo
            if (successCount === 0) {
                toast.error("Erro de segurança (CORS). O servidor de imagens bloqueou o download.", { theme: "dark" });
                setIsDownloading(false);
                return; // Para a função aqui e não baixa o ZIP vazio!
            }

            // Se chegou aqui, pelo menos 1 arquivo deu certo, então gera o ZIP
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `${folderName}.zip`);
            toast.success("Download concluído com sucesso!", { theme: "dark" });

        } catch (error) {
            console.error("Erro ao gerar o ZIP:", error);
            toast.error("Ocorreu um erro ao preparar o download.", { theme: "dark" });
        } finally {
            setIsDownloading(false);
        }
    };

    // ✨ 4. TELA PRINCIPAL DO CLIENTE
    return (
        <div className="dashboard-container">
            <div className="dashboard-content">

                <header className="dashboard-header">
                    <div className="logo-garbo">
                        <img src={logoGarbo} alt="Garbo Arquitetura e Planejados" />
                    </div>
                    <button className="btn-logout" onClick={handleLogout}>Sair da Conta</button>
                </header>

                <div className="vip-project-card">
                    <div className="vip-project-header">
                        <div className="vip-project-title">
                            <h2>
                                {project.title || "Projeto Exclusivo"}
                                <span className="vip-tag">{project.category || "PLANEJADOS"}</span>
                            </h2>
                            <p>{project.description}</p>
                        </div>

                        {/* 🏆 O BOTÃO DE DOWNLOAD INTEGRADO */}
                        <div className="vip-project-actions">
                            <button 
                                className="btn-download-project"
                                onClick={handleDownloadProject}
                                disabled={isDownloading}
                                title="Baixar Caderno do Projeto"
                                style={{ 
                                    opacity: isDownloading ? 0.7 : 1, 
                                    cursor: isDownloading ? 'wait' : 'pointer' 
                                }}
                            >
                                {isDownloading ? (
                                    <>
                                        <span style={{ fontSize: '18px' }}>⏳</span>
                                        Compactando...
                                    </>
                                ) : (
                                    <>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Baixar Projeto
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="status-timeline">
                        <div className="status-progress-line" style={{ '--progress': progressWidth }}></div>

                        {statusList.map((status, index) => {
                            let stepClass = "";
                            if (index < currentIndex) stepClass = "completed";
                            if (index === currentIndex) stepClass = "active";

                            return (
                                <div key={status} className={`status-step ${stepClass}`}>
                                    <div className="step-circle">
                                        {index < currentIndex && <span className="check-icon">✓</span>}
                                    </div>
                                    <span className="step-text">{status}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="card-image-container">
                        {todasAsMidias.length > 0 ? (
                            <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={20}
                                slidesPerView={1}
                                navigation
                                pagination={{ clickable: true, dynamicBullets: true }}
                                autoplay={{ delay: 4500, disableOnInteraction: true }}
                                className="vip-swiper"
                                onSwiper={(swiper) => setSwiperInstance(swiper)}
                                onSlideChange={() => {
                                    const videos = document.querySelectorAll(".card-image-container video");
                                    videos.forEach((vid) => vid.pause());
                                }}
                            >
                                {todasAsMidias.map((midia, index) => (
                                    <SwiperSlide key={index} className="premium-slide">
                                        {/* A cápsula que segura a mídia e o botão juntos */}
                                        <div className="media-wrapper">
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
                                                    <source src={midia.url} type="video/mp4" />
                                                </video>
                                            ) : (
                                                <img src={midia.url} alt={`Ambiente ${index + 1}`} className="media-content" />
                                            )}
                                            
                                            {/* O botão agora serve para Vídeos E Fotos */}
                                            <button className="expand-btn" onClick={() => setExpandedMedia(midia.url)} title="Ver em Tela Cheia">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="premium-slide">
                                <div className="media-wrapper">
                                    {project.coverImageUrl ? (
                                        <>
                                            <img src={project.coverImageUrl} alt="Capa" className="media-content" />
                                            <button className="expand-btn" onClick={() => setExpandedMedia(project.coverImageUrl)}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                                                </svg>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="no-media-placeholder">📸 Nenhuma mídia disponível ainda.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        
            {/* ✨ LIGHTBOX INTELIGENTE (FOTOS E VÍDEOS) ✨ */}
            {expandedMedia && (
                <div className="lightbox-overlay">
                    <button className="lightbox-close" onClick={() => setExpandedMedia(null)} title="Fechar">&times;</button>
                    
                    <TransformWrapper
                        initialScale={1}
                        minScale={1}
                        maxScale={4}
                        centerOnInit={true}
                        wheel={{ wheelDisabled: false, step: 0.05 }}
                        animation={{ disabled: false, animationTime: 400, animationType: "easeOut" }}
                        panning={{ velocityDisabled: false }}
                        pinch={{ step: 5 }}
                        doubleClick={{ disabled: false, mode: "toggle", step: 1.5}}
                    >
                        <TransformComponent 
                            wrapperStyle={{ width: "100%", height: "100%" }} 
                            contentStyle={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
                        >
                            {/* O Radar do Lightbox para abrir Vídeos! */}
                            {isVideoURL(expandedMedia) ? (
                                <video src={expandedMedia} controls autoPlay className="lightbox-image" />
                            ) : (
                                <img src={expandedMedia} alt="Expandida" className="lightbox-image" />
                            )}
                        </TransformComponent>
                    </TransformWrapper>

                    {/* 🎯 O INDICADOR FLUTUANTE DE ZOOM (Apenas para Imagens) */}
                    {!isVideoURL(expandedMedia) && (
                        <div className="zoom-indicator">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                <line x1="11" y1="8" x2="11" y2="14"></line>
                                <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                            <span>Toque duas vezes para zoom</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ClientDashboard;
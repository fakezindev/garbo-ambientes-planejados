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
    navigate("/area-cliente");
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando o seu projeto dos sonhos... ⏳</div>;
  }

  if (!project) {
    return (
      <div className="client-dashboard empty" style={{ padding: '2rem', textAlign: 'center' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
            <h1>GARBO</h1>
            <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px' }}>Sair</button>
        </header>
        <h2>Olá! Ainda não há projetos vinculados ao seu perfil.</h2>
        <p>Nossa equipe está trabalhando nisso. Em breve as novidades aparecerão aqui!</p>
      </div>
    );
  }

  return (
     <div className="client-dashboard" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        
        {/* CABEÇALHO VIP */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <div>
                <h1 style={{ margin: 0 }}>GARBO</h1>
                <p style={{ margin: 0, color: '#666' }}>Acompanhamento de Projeto VIP</p>
            </div>
            <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                🚪 Sair
            </button>
        </header>

        {/* INFORMAÇÕES DO PROJETO */}
        <main>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '2rem' }}>{project.title}</h2>
                <span style={{ background: '#333', color: '#fff', padding: '4px 12px', borderRadius: '15px', fontSize: '0.8rem' }}>
                    {project.category}
                </span>
            </div>
            <p style={{ fontSize: '1.1rem', color: '#444', lineHeight: '1.6' }}>{project.description}</p>

            {/* 🎠 O GLORIOSO CARROSSEL SWIPER */}
            <div className="carousel-container" style={{ marginTop: '2rem', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
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
                                <img
                                    src={url}
                                    alt={`Ambiente ${index + 1}`}
                                    style={{ width: '100%', height: '500px', objectFit: 'cover', display: 'block' }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="single-image-container">
                        {project.coverImageUrl ? (
                            <img
                                src={project.coverImageUrl}
                                alt="Capa do Projeto"
                                style={{ width: '100%', height: '500px', objectFit: 'cover', display: 'block' }}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '100px', background: '#f5f5f5', color: '#888' }}>
                                📸 Nenhuma imagem disponível ainda.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
     </div>
  );
};

export default ClientDashboard;
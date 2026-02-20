import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './ClientDashboard.css'; // Vamos criar o CSS logo depois!

const ClientDashboard = () => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Mais pra frente, vamos bater numa rota tipo '/clients/my-project'
        // Por enquanto, vamos simular que estamos buscando o projeto
        fetchClientProject();
    }, []);

    const fetchClientProject = async () => {
        try {
            // Aqui faremos a requisição real com o token do cliente
            // const response = await api.get('/clients/my-project');
            // setProject(response.data);
            
            // Simulação provisória para você ver o visual:
            setTimeout(() => {
                setProject({
                    title: "Cozinha Minimalista - Residência Silva",
                    category: "Cozinha",
                    description: "Projeto em MDF Carvalho e Branco Diamante com ferragens com amortecimento.",
                    status: "EM_FABRICACAO", // Pode ser: APROVACAO, FABRICACAO, MONTAGEM, CONCLUIDO
                    coverImageUrl: "https://images.unsplash.com/photo-1556910103-1c02745a8728?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                });
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Erro ao carregar projeto:", error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('client_token');
        navigate('/area-cliente');
    };

    if (loading) return <div className="loading-screen">Carregando seu projeto...</div>;
    if (!project) return <div className="error-screen">Nenhum projeto encontrado.</div>;

    return (
        <div className="client-portal-wrapper">
            <header className="client-header">
                <div className="logo-garbo">GARBO <span className="vip-tag">VIP</span></div>
                <button onClick={handleLogout} className="btn-logout-client">Sair</button>
            </header>

            <main className="client-dashboard-content">
                <div className="welcome-banner">
                    <h1>Olá, Família Silva!</h1>
                    <p>Acompanhe o andamento do seu projeto planejado.</p>
                </div>

                <div className="dashboard-grid">
                    {/* COLUNA ESQUERDA: FOTOS E DETALHES */}
                    <div className="project-details-card">
                        <img src={project.coverImageUrl} alt={project.title} className="client-project-img" />
                        <div className="project-info">
                            <span className="badge">{project.category}</span>
                            <h2>{project.title}</h2>
                            <p>{project.description}</p>
                        </div>
                    </div>

                    {/* COLUNA DIREITA: STATUS DO PROJETO */}
                    <div className="project-status-card">
                        <h3>Status do Projeto</h3>
                        
                        <div className="status-timeline">
                            <div className={`status-step ${project.status === 'APROVACAO' || project.status === 'FABRICACAO' || project.status === 'MONTAGEM' || project.status === 'CONCLUIDO' ? 'active' : ''}`}>
                                <div className="step-icon">📝</div>
                                <div className="step-text">
                                    <h4>Aprovação do Projeto</h4>
                                    <p>Planta e 3D aprovados</p>
                                </div>
                            </div>

                            <div className={`status-step ${project.status === 'FABRICACAO' || project.status === 'MONTAGEM' || project.status === 'CONCLUIDO' ? 'active' : ''}`}>
                                <div className="step-icon">🪚</div>
                                <div className="step-text">
                                    <h4>Em Fabricação</h4>
                                    <p>Corte, fitamento e furação</p>
                                </div>
                            </div>

                            <div className={`status-step ${project.status === 'MONTAGEM' || project.status === 'CONCLUIDO' ? 'active' : ''}`}>
                                <div className="step-icon">🛠️</div>
                                <div className="step-text">
                                    <h4>Agendamento e Montagem</h4>
                                    <p>Instalação no ambiente</p>
                                </div>
                            </div>

                            <div className={`status-step ${project.status === 'CONCLUIDO' ? 'active' : ''}`}>
                                <div className="step-icon">✨</div>
                                <div className="step-text">
                                    <h4>Concluído</h4>
                                    <p>Sonho entregue!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientDashboard;
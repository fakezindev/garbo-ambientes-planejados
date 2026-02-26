import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // Ajuste o caminho se a sua pasta for diferente
import ProjectForm from "../../components/ProjectForm"; // Ajuste o caminho se necessário
import "./AdminDashboard.css"; // Vamos criar um CSS específico para o dashboard do admin

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();

  // Busca todos os projetos para o Admin
  const fetchProjects = () => {
    // Pegamos o token para garantir que o Admin tem permissão para ver/editar
    const token = localStorage.getItem("token") || localStorage.getItem("garbo_token");

    api.get('/projects', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        // Blindagem: Garante que é uma lista
        const dadosSeguros = Array.isArray(response.data) ? response.data : [response.data];
        setProjects(dadosSeguros);
      })
      .catch(err => {
        console.error("Erro ao buscar projetos do admin:", err);
        setError("Não foi possível carregar os projetos.");
      });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este projeto? Essa ação não pode ser desfeita.")) {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("garbo_token");
        await api.delete(`/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Remove o projeto da tela na hora, sem precisar recarregar a página!
        setProjects(projects.filter((project) => project.id !== id));
        alert("Projeto excluído com sucesso!");
      } catch (err) {
        console.error(err);
        alert("Erro ao excluir o projeto.");
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    // Limpamos qualquer vestígio de token do navegador
    localStorage.removeItem("token");
    localStorage.removeItem("garbo_token");

    // Manda o Admin de volta pra tela de login
    navigate("/login");
  };

  // Executa a busca assim que o Admin entra no painel
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="app-container">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1>GARBO</h1>
          <p>Arquitetura e Ambientes Planejados</p>
        </div>
        {/* 4. O botão de Logout elegante no canto direito */}
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            background: "var(--danger, #ff4d4f)",
            color: "var(--text-main)",
            border: "1px solid #444",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sair do Sistema
        </button>
      </header>

      <ProjectForm
        onUploadSuccess={fetchProjects}
        projectToEdit={editingProject}
        onCancelEdit={() => setEditingProject(null)}
      />

      <section className="portfolio-section">
        <h2>Portfólio Recente</h2>
        {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

        <div className="projects-grid">
          {projects && projects.length > 0 ? (
            projects.map((project, index) => (
              <div key={project.id || index} className="project-card">
                <div className="card-image-container">
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
                            className="card-image"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : project.coverImageUrl ? (
                    <img src={project.coverImageUrl} alt={project.title} className="card-image" />
                  ) : (
                    <div className="no-image">Sem Imagem</div>
                  )}
                </div>

                <div className="card-content">
                  <div className="card-header">
                    <span className="badge">{project.category}</span>
                    <div>
                      <button
                        onClick={() => handleEdit(project)}
                        className="btn btn-icon btn-edit"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="btn btn-icon btn-delete"
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <h3 className="card-title">{project.title}</h3>

                  {(project.clientName || project.completionDate) && (
                    <div className="card-meta">
                      {project.clientName && (
                        <span>Cliente: {project.clientName}</span>
                      )}
                      {project.clientName && project.completionDate && (
                        <span> • </span>
                      )}
                      {project.completionDate && (
                        <span>
                          {new Date(
                            project.completionDate,
                          ).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="card-desc">{project.description}</p>
                </div>
              </div>
            ))) : (
            <p style={{ textAlign: "center", color: "var(--danger)" }}>
              Nenhum projeto encontrado.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
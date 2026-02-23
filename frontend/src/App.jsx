import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import api from './services/api'
import ProjectForm from './components/ProjectForm'
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home/Home';
import ClientPrivateRoute from './components/ClientPrivateRoute';
import ClientDashboard from './pages/ClientDashboard/ClientDashboard';
import ClientLogin from './pages/ClientLogin/ClientLogin';
import './App.css'

function App() {

  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = () => {
    api.get('/projects')
      .then((response) => setProjects(response.data))
      .catch((err) => setError("Erro ao conectar com o Backend."));
  };

  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      try {
        await api.delete(`/projects/${id}`);
        setProjects(projects.filter(project => project.id !== id));
      } catch (err) { alert("Erro ao excluir."); }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('garbo_token'); // Joga a chave fora
    window.location.href = '/login'; // Chuta o usuário pra tela de login
  };

  useEffect(() => { fetchProjects(); }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* ROTA ADMIN: Painel de Administração */}
        <Route path="/admin" element={
          <PrivateRoute>
            <div className="app-container">
              <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1>GARBO</h1>
                  <p>Arquitetura e Ambientes Planejados</p>
                </div>
                {/* 4. O botão de Logout elegante no canto direito */}
                <button
                  onClick={handleLogout}
                  style={{ padding: '8px 16px', background: 'var(--danger, #ff4d4f)', color: 'var(--text-main)', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer' }}
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
                {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

                <div className="projects-grid">
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
                        <div className="card-header">
                          <span className="badge">{project.category}</span>
                          <div>
                            <button onClick={() => handleEdit(project)} className="btn btn-icon btn-edit" title="Editar">
                              ✏️
                            </button>
                            <button onClick={() => handleDelete(project.id)} className="btn btn-icon btn-delete" title="Excluir">
                              🗑️
                            </button>
                          </div>
                        </div>

                        <h3 className="card-title">{project.title}</h3>

                        {(project.clientName || project.completionDate) && (
                          <div className="card-meta">
                            {project.clientName && <span>Cliente: {project.clientName}</span>}
                            {project.clientName && project.completionDate && <span> • </span>}
                            {project.completionDate && <span>{new Date(project.completionDate).toLocaleDateString('pt-BR')}</span>}
                          </div>
                        )}

                        <p className="card-desc">{project.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </PrivateRoute>
        } />

        {/* ROTA PROTEGIDA DO CLIENTE: O Dashboard VIP */}
        <Route path="/meu-projeto" element={
          <ClientPrivateRoute>
            <ClientDashboard />
          </ClientPrivateRoute>
        } />

        {/* ROTA PÚBLICA: Landing Page */}
        <Route path="/" element={<Home />} />

        {/* ROTA PÚBLICA: Login do Admin */}
        <Route path="/login" element={<Login />} />

        {/* ROTA PÚBLICA: Login do Cliente */}
        <Route path="/area-cliente" element={<ClientLogin />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
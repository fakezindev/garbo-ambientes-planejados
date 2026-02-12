import { useState, useEffect } from 'react'
import api from './services/api'
import ProjectForm from './components/ProjectForm'
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

  useEffect(() => { fetchProjects(); }, []);

  return (
    <div className="app-container">
      <header>
        {/* Usamos o CSS para dar efeito dourado neste texto */}
        <h1>GARBO</h1> 
        <p>Arquitetura e Ambientes Planejados</p>
      </header>
      

      {/* O Formulário de Cadastro */}
      {/* Quando o upload terminar, ele chama fetchProjects para atualizar a lista */}
      {/* Passamos o editingProject e a função de Cancelar para o form */}
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
  )
}

export default App
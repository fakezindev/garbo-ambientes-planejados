import { useState, useEffect } from 'react'
import api from './services/api'
import ProjectForm from './components/ProjectForm' // Importa o formulário
import './App.css'

function App() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  const [editingProject, setEditingProject] = useState(null);

  // Função que busca os dados (extraída para poder ser reutilizada)
  const fetchProjects = () => {
    api.get('/projects')
      .then((response) => {
        setProjects(response.data);
      })
      .catch((err) => {
        console.error("Erro:", err);
        setError("Erro ao conectar com o Backend.");
      });
  };

  const handleDelete = async (id) => {

    if (confirm("Tem certeza que deseja excluir este projeto?")) {

      try {
        await api.delete(`/projects/${id}`);
        setProjects(projects.filter(project => project.id !== id));
      } catch (err) {
        alert("Erro ao excluir projeto. Veja o console.");
        console.error(err);
      }

    }

  }

  const handleEdit = (project) => {
    setEditingProject(project); // Joga os dados do projeto lá pro formulário
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe a tela suavemente
  }

  // Carrega na primeira vez
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="app-container">
      <h1>Garbo Ambientes Planejados</h1>
      

      {/* O Formulário de Cadastro */}
      {/* Quando o upload terminar, ele chama fetchProjects para atualizar a lista */}
      {/* Passamos o editingProject e a função de Cancelar para o form */}
      <ProjectForm 
          onUploadSuccess={fetchProjects} 
          projectToEdit={editingProject}
          onCancelEdit={() => setEditingProject(null)}
      />

      <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eee' }} />

      {/* Lista de Projetos */}
      <h2>Portfólio</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {projects.map((project) => (
          <div key={project.id} style={{
            background: 'white',
            border: '1px solid #eee',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>

            {/* Imagem de Capa */}
            {project.coverImageUrl ? (
              <img
                src={project.coverImageUrl}
                alt={project.title}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ height: '150px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Sem Imagem</div>
            )}

            <div style={{ padding: '15px' }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                  <span style={{ fontSize: '0.7em', textTransform: 'uppercase', color: '#666', background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>
                    {project.category}
                  </span>
                  
                  <div style={{display: 'flex', gap: '5px'}}>
                      {/* BOTÃO EDITAR (Amarelo) */}
                      <button 
                        onClick={() => handleEdit(project)}
                        style={{ border: '1px solid #ffc107', background: 'transparent', color: '#ffc107', borderRadius: '4px', cursor: 'pointer', padding: '2px 8px', fontSize: '0.8em' }}
                      >
                        Editar
                      </button>

                      {/* BOTÃO EXCLUIR (Vermelho) */}
                      <button 
                        onClick={() => handleDelete(project.id)}
                        style={{ border: '1px solid #ff4d4d', background: 'transparent', color: '#ff4d4d', borderRadius: '4px', cursor: 'pointer', padding: '2px 8px', fontSize: '0.8em' }}
                      >
                        Excluir
                      </button>
                  </div>
              </div>

              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2em' }}>{project.title}</h3>
              <p style={{ fontSize: '0.9em', color: '#555' }}>{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
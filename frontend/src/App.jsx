import { useState, useEffect } from 'react'
import api from './services/api'
import ProjectForm from './components/ProjectForm' // Importa o formulário
import './App.css'

function App() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

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

  // Carrega na primeira vez
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="app-container">
      <h1>Garbo Ambientes Planejados</h1>
      
      {/* O Formulário de Cadastro */}
      {/* Quando o upload terminar, ele chama fetchProjects para atualizar a lista */}
      <ProjectForm onUploadSuccess={fetchProjects} />

      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

      {/* Lista de Projetos */}
      <h2>Portfólio</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
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
              <span style={{ 
                  fontSize: '0.7em', 
                  textTransform: 'uppercase', 
                  color: '#666', 
                  letterSpacing: '1px',
                  background: '#f0f0f0',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                {project.category}
              </span>
              <h3 style={{ margin: '10px 0', fontSize: '1.1em' }}>{project.title}</h3>
              <p style={{ fontSize: '0.9em', color: '#555' }}>{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
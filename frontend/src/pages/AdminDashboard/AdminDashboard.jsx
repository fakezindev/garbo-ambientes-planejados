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
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [activeTab, setActiveTab] = useState("projetos");
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientForm, setClientForm] = useState({ name: '', email: '', phone: '', password: '' });
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

  const fetchLeads = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("garbo_token");
    api.get('/leads', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setLeads(response.data);
      })
      .catch(err => {
        console.error("Erro ao buscar leads:", err);
      });
  };

  const fetchClients = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("garbo_token");
    api.get('/clients', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setClients(response.data);
      })
      .catch(err => {
        console.error("Erro ao buscar clientes:", err);
      });
  };

  const handleOpenClientModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      // Se for editar, não mostramos a senha (a menos que você queira implementar redefinição de senha)
      setClientForm({ name: client.name, email: client.email, phone: client.phone || '', password: '' });
    } else {
      setEditingClient(null);
      setClientForm({ name: '', email: '', phone: '', password: '' });
    }
    setShowClientModal(true);
  };

  const handleSaveClient = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || localStorage.getItem("garbo_token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (editingClient) {
        // Atualiza cliente existente
        await api.put(`/clients/${editingClient.id}`, clientForm, config);
        alert("Cliente atualizado com sucesso!");
      } else {
        // Cria novo cliente (ajuste a rota se o seu registro for em /auth/client/register)
        await api.post('/clients', clientForm, config);
        alert("Cliente registado com sucesso!");
      }
      setShowClientModal(false);
      fetchClients(); // Recarrega a tabela
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
      alert("Erro ao salvar cliente.");
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm("Tem certeza que deseja eliminar este cliente?")) {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("garbo_token");
        await api.delete(`/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Cliente eliminado!");
        fetchClients(); // Recarrega a tabela
      } catch (err) {
        console.error("Erro ao eliminar cliente:", err);
        alert("Erro ao eliminar cliente. Verifique se ele não está vinculado a um projeto.");
      }
    }
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
    fetchLeads();
    fetchClients();
  }, []);



  return (
    <div className="app-container">
      {/* 1. CABEÇALHO DO ADMIN */}
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

      {/* 2. 🗂️ MENU DE ABAS (TABS) */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '2rem', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
        <button
          onClick={() => setActiveTab("projetos")}
          style={{ padding: '10px 20px', cursor: 'pointer', background: activeTab === "projetos" ? '#fff' : 'transparent', color: activeTab === "projetos" ? '#000' : '#888', border: '1px solid #333', borderRadius: '4px', fontWeight: 'bold' }}>
          🏗️ Gerenciar Projetos
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          style={{ padding: '10px 20px', cursor: 'pointer', background: activeTab === "leads" ? '#fff' : 'transparent', color: activeTab === "leads" ? '#000' : '#888', border: '1px solid #333', borderRadius: '4px', fontWeight: 'bold' }}>
          📩 Solicitações de Orçamento
          {leads.length > 0 && <span style={{ background: '#e74c3c', color: 'white', borderRadius: '50%', padding: '2px 8px', marginLeft: '10px', fontSize: '0.8rem' }}>{leads.length}</span>}
        </button>
        <button
          onClick={() => setActiveTab("clientes")}
          style={{ padding: '10px 20px', cursor: 'pointer', background: activeTab === "clientes" ? '#fff' : 'transparent', color: activeTab === "clientes" ? '#000' : '#888', border: '1px solid #333', borderRadius: '4px', fontWeight: 'bold' }}>
          👥 Gestão de Clientes
        </button>
      </div>

      {/* 3. 🟢 TELA DE PROJETOS (Só aparece se a aba for "projetos") */}
      {activeTab === "projetos" && (
        <>
          <ProjectForm onUploadSuccess={fetchProjects} projectToEdit={editingProject} onCancelEdit={() => setEditingProject(null)} />

          <section className="portfolio-section" style={{ marginTop: '3rem' }}>
            <h2>Portfólio Recente</h2>
            {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

            <div className="projects-grid">
              {/* 👇 Aqui está o map que tinha sumido! */}
              {projects.map((project) => (
                <div key={project.id} className="project-card">

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
                            <img src={url} alt={`${project.title} - ${imgIndex + 1}`} className="card-image" />
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
                        <button onClick={() => handleEdit(project)} className="btn btn-icon btn-edit" title="Editar">✏️</button>
                        <button onClick={() => handleDelete(project.id)} className="btn btn-icon btn-delete" title="Excluir">🗑️</button>
                      </div>
                    </div>

                    <h3 className="card-title">{project.title}</h3>

                    {(project.clientName || project.completionDate) && (
                      <div className="card-meta">
                        {project.clientName && <span>Cliente: {project.clientName}</span>}
                        {project.clientName && project.completionDate && <span> • </span>}
                        {project.completionDate && <span>{new Date(project.completionDate).toLocaleDateString("pt-BR")}</span>}
                      </div>
                    )}

                    <p className="card-desc">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* 4. 🔵 TELA DE LEADS (Só aparece se a aba for "leads") */}
      {activeTab === "leads" && (
        <section className="leads-section" style={{ background: '#1e1e1e', padding: '2rem', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>Novos Pedidos de Orçamento</h2>

          {leads.length === 0 ? (
            <p style={{ color: '#888' }}>Nenhuma solicitação recebida ainda.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #444' }}>
                    <th style={{ padding: '12px' }}>Nome</th>
                    <th style={{ padding: '12px' }}>E-mail</th>
                    <th style={{ padding: '12px' }}>Ambiente</th>
                    <th style={{ padding: '12px' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '12px' }}>{lead.name}</td>
                      <td style={{ padding: '12px', color: '#aaa' }}>{lead.email}</td>
                      <td style={{ padding: '12px' }}><span style={{ background: '#333', padding: '4px 10px', borderRadius: '15px', fontSize: '0.85rem' }}>{lead.environment}</span></td>
                      <td style={{ padding: '12px' }}>
                        <a
                          href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=Olá ${lead.name}, sou da Garbo Ambientes Planejados. Recebemos seu pedido de orçamento para a sua ${lead.environment}! Como podemos ajudar?`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ background: '#25D366', color: '#fff', padding: '8px 12px', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold', display: 'inline-block' }}
                        >
                          💬 Chamar no Whats
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* 5. 🟡 TELA DE CLIENTES */}
      {activeTab === "clientes" && (
        <section className="clients-section" style={{ background: '#1e1e1e', padding: '2rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#fff', margin: 0 }}>Clientes Registrados</h2>
            <button
              style={{ background: '#4CAF50', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => handleOpenClientModal()}
            >
              ➕ Novo Cliente
            </button>
          </div>

          {clients.length === 0 ? (
            <p style={{ color: '#888' }}>Nenhum cliente registrado ainda.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #444' }}>
                    <th style={{ padding: '12px' }}>Nome</th>
                    <th style={{ padding: '12px' }}>E-mail</th>
                    <th style={{ padding: '12px' }}>Telefone</th>
                    <th style={{ padding: '12px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => (
                    <tr key={client.id} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{client.name}</td>
                      <td style={{ padding: '12px', color: '#aaa' }}>{client.email}</td>
                      <td style={{ padding: '12px', color: '#aaa' }}>{client.phone || 'Não informado'}</td>
                      <td style={{ padding: '12px' }}>
                        <button onClick={() => handleOpenClientModal(client)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', marginRight: '10px' }} title="Editar">✏️</button>
                        <button onClick={() => handleDeleteClient(client.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Eliminar">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* 🪟 MODAL DE CLIENTE */}
      {showClientModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#2c2c2c', padding: '2rem', borderRadius: '8px', width: '400px', maxWidth: '90%' }}>
            <h3 style={{ color: '#fff', marginTop: 0 }}>{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</h3>
            <form onSubmit={handleSaveClient} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input
                type="text" placeholder="Nome do Cliente" required
                value={clientForm.name} onChange={e => setClientForm({ ...clientForm, name: e.target.value })}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#1e1e1e', color: '#fff' }}
              />
              <input
                type="email" placeholder="E-mail" required
                value={clientForm.email} onChange={e => setClientForm({ ...clientForm, email: e.target.value })}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#1e1e1e', color: '#fff' }}
              />
              <input
                type="text" placeholder="Telefone / WhatsApp"
                value={clientForm.phone} onChange={e => setClientForm({ ...clientForm, phone: e.target.value })}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#1e1e1e', color: '#fff' }}
              />
              {/* CAMPO DE SENHA INTELIGENTE */}
              <input
                type="password"
                placeholder={editingClient ? "Nova Senha (deixe em branco para manter)" : "Palavra-passe de Acesso *"}
                required={!editingClient} // Só é obrigatório se for um cliente NOVO
                value={clientForm.password}
                onChange={e => setClientForm({ ...clientForm, password: e.target.value })}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#1e1e1e', color: '#fff' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowClientModal(false)} style={{ background: 'transparent', color: '#aaa', border: '1px solid #555', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#3498db', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api"; // Ajuste o caminho se a sua pasta for diferente
import ProjectForm from "../../components/ProjectForm"; // Ajuste o caminho se necessário
import "./AdminDashboard.css"; // Vamos criar um CSS específico para o dashboard do admin
import logoGarbo from "../../assets/logo_header.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [activeTab, setActiveTab] = useState("projetos");
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [transactions, setTransactions] = useState([]); // 👈 Guarda os lançamentos
  const [transactionForm, setTransactionForm] = useState({
    description: "",
    amount: "",
    type: "RECEITA",
    date: "",
  });
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();

  // Busca todos os projetos para o Admin
  const fetchProjects = () => {
    // Pegamos o token para garantir que o Admin tem permissão para ver/editar
    const token =
      localStorage.getItem("token") || localStorage.getItem("garbo_token");

    api
      .get("/projects", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Blindagem: Garante que é uma lista
        const dadosSeguros = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setProjects(dadosSeguros);
      })
      .catch((err) => {
        console.error("Erro ao buscar projetos do admin:", err);
        setError("Não foi possível carregar os projetos.");
      });
  };

  const fetchLeads = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("garbo_token");
    api
      .get("/leads", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLeads(response.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar leads:", err);
      });
  };

  const fetchClients = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("garbo_token");
    api
      .get("/clients", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setClients(response.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar clientes:", err);
      });
  };

  const fetchTransactions = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("garbo_token");
    api
      .get("/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setTransactions(response.data))
      .catch((err) => console.error("Erro ao buscar transações:", err));
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    const token =
      localStorage.getItem("token") || localStorage.getItem("garbo_token");
    try {
      await api.post("/transactions", transactionForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Lançamento adicionado com sucesso! 💰");
      setTransactionForm({
        description: "",
        amount: "",
        type: "RECEITA",
        date: "",
      }); // Limpa o formulário
      fetchTransactions(); // Atualiza a tabela e os cards
    } catch (err) {
      console.error(err);
      toast.error("Erro ao adicionar o lançamento. 🚨");
    }
  };

  // Excluir lançamento
  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este lançamento?")) {
      const token =
        localStorage.getItem("token") || localStorage.getItem("garbo_token");
      try {
        await api.delete(`/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Lançamento excluído! 🗑️");
        fetchTransactions();
      } catch (err) {
        toast.error("Erro ao excluir. 🚨");
      }
    }
  };

  const totalReceitas = transactions
    .filter((t) => t.type === "RECEITA")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalDespesas = transactions
    .filter((t) => t.type === "DESPESA")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const saldoAtual = totalReceitas - totalDespesas;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleOpenClientModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      // Se for editar, não mostramos a senha (a menos que você queira implementar redefinição de senha)
      setClientForm({
        name: client.name,
        email: client.email,
        phone: client.phone || "",
        password: "",
      });
    } else {
      setEditingClient(null);
      setClientForm({ name: "", email: "", phone: "", password: "" });
    }
    setShowClientModal(true);
  };

  const handleSaveClient = async (e) => {
    e.preventDefault();
    const token =
      localStorage.getItem("token") || localStorage.getItem("garbo_token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (editingClient) {
        // Atualiza cliente existente
        await api.put(`/clients/${editingClient.id}`, clientForm, config);
        toast.success("Cliente atualizado com sucesso! 🎉");
      } else {
        // Cria novo cliente (ajuste a rota se o seu registro for em /auth/client/register)
        await api.post("/clients", clientForm, config);
        toast.success("Cliente registado com sucesso! 🎉");
      }
      setShowClientModal(false);
      fetchClients(); // Recarrega a tabela
    } catch (err) {
      toast.error("Erro ao guardar cliente. Verifique os dados. 🚨", err);
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm("Tem certeza que deseja eliminar este cliente?")) {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("garbo_token");
        await api.delete(`/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cliente eliminado da base de dados! 🗑️");

        fetchClients(); // Recarrega a tabela
      } catch (err) {
        toast.error(
          "Erro ao eliminar cliente. Verifique se ele não está vinculado a um projeto.",
        );
      }
    }
  };

  const handleDeleteLead = async (id) => {
    // 🛡️ Confirmação de segurança antes de apagar
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta solicitação de orçamento?");

    if (!confirmDelete) return;

    try {
      // Dispara o DELETE para o seu backend Java
      await api.delete(`/leads/${id}`);

      // ♻️ Atualiza a tela removendo o Lead apagado sem precisar recarregar a página
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));

      toast.success("Orçamento excluído com sucesso!", {
        position: "bottom-right",
        theme: "dark"
      });
    } catch (error) {
      console.error("Erro ao excluir lead:", error);
      toast.error("Erro ao excluir. Verifique se o backend está rodando.", {
        position: "bottom-right",
        theme: "dark"
      });
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir este projeto? Essa ação não pode ser desfeita.",
      )
    ) {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("garbo_token");
        await api.delete(`/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Remove o projeto da tela na hora, sem precisar recarregar a página!
        setProjects(projects.filter((project) => project.id !== id));
        toast.success("Projeto excluído com sucesso! 🗑️");
      } catch (err) {
        console.error("Erro ao excluir projeto:", err);
        toast.error("Erro ao excluir o projeto. Tente novamente. 🚨");
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
    fetchTransactions();
  }, []);

  const statusFormatado = {
    PROJETO: "EM PROJETO",
    FABRICAÇÃO: "EM FABRICAÇÃO",
    MONTAGEM: "EM MONTAGEM",
    CONCLUÍDO: "CONCLUÍDO",
  };

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
        <div className="logo-garbo">
          <img
            src={logoGarbo}
            alt="Garbo Arquitetura e Planejados"
            style={{ height: '100px', width: 'auto' }} 
          />
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
            fontWeight: "bold",
          }}
        >
          Sair do Sistema
        </button>
      </header>

      {/* 2. 🗂️ MENU DE ABAS (TABS) */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "2rem",
          borderBottom: "2px solid #333",
          paddingBottom: "10px",
        }}
      >
        <button
          onClick={() => setActiveTab("projetos")}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            background: activeTab === "projetos" ? "#fff" : "transparent",
            color: activeTab === "projetos" ? "#000" : "#888",
            border: "1px solid #333",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          🏗️ Gerenciar Projetos
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            background: activeTab === "leads" ? "#fff" : "transparent",
            color: activeTab === "leads" ? "#000" : "#888",
            border: "1px solid #333",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          📩 Solicitações de Orçamento
          {leads.length > 0 && (
            <span
              style={{
                background: "#e74c3c",
                color: "white",
                borderRadius: "50%",
                padding: "2px 8px",
                marginLeft: "10px",
                fontSize: "0.8rem",
              }}
            >
              {leads.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("clientes")}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            background: activeTab === "clientes" ? "#fff" : "transparent",
            color: activeTab === "clientes" ? "#000" : "#888",
            border: "1px solid #333",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          👥 Gestão de Clientes
        </button>
        <button
          onClick={() => setActiveTab("financeiro")}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            background: activeTab === "financeiro" ? "#fff" : "transparent",
            color: activeTab === "financeiro" ? "#000" : "#888",
            border: "1px solid #333",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          💰 Financeiro
        </button>
      </div>

      {/* 3. 🟢 TELA DE PROJETOS (Só aparece se a aba for "projetos") */}
      {activeTab === "projetos" && (
        <>
          <ProjectForm
            onUploadSuccess={fetchProjects}
            projectToEdit={editingProject}
            onCancelEdit={() => setEditingProject(null)}
          />

          <section className="portfolio-section" style={{ marginTop: "3rem" }}>
            <h2>Portfólio Recente</h2>
            {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

            <div className="projects-grid">
              {/* 👇 Aqui está o map que tinha sumido! */}
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="portfolio-image-wrapper">
                    {project.imageUrls && project.imageUrls.length > 0 ? (
                      <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        style={{ width: "100%", height: "100%" }}
                      >
                        {project.imageUrls.map((url, imgIndex) => (
                          <SwiperSlide key={imgIndex}>
                            <img
                              src={url}
                              alt={`${project.title} - ${imgIndex + 1}`}
                              className="portfolio-image"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : project.coverImageUrl ? (
                      <img
                        src={project.coverImageUrl}
                        alt={project.title}
                        className="portfolio-image"
                      />
                    ) : (
                      /* Fundo elegante caso o projeto não tenha foto */
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#111",
                          color: "#555",
                        }}
                      >
                        Sem Imagem
                      </div>
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

                    {/* 👇 AQUI ESTÁ A MÁGICA DO STATUS JUNTO AO TÍTULO 👇 */}
                    <h3
                      className="card-title"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {project.title}
                      <span
                        style={{
                          background:
                            project.status === "CONCLUÍDO"
                              ? "#27ae60"
                              : "#f39c12",
                          color: "#fff",
                          padding: "3px 8px",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          marginLeft: "10px",
                        }}
                      >
                        {statusFormatado[project.status] || "EM PROJETO"}
                      </span>
                    </h3>

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
              ))}
            </div>
          </section>
        </>
      )}

      {/* 4. 🔵 TELA DE LEADS (Só aparece se a aba for "leads") */}
      {activeTab === "leads" && (
        <section
          className="leads-section"
          style={{
            background: "#1e1e1e",
            padding: "2rem",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ marginBottom: "1.5rem", color: "#fff" }}>
            Novos Pedidos de Orçamento
          </h2>

          {leads.length === 0 ? (
            <p style={{ color: "#888" }}>Nenhuma solicitação recebida ainda.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  color: "#fff",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid #444" }}>
                    <th style={{ padding: "12px" }}>Nome</th>
                    <th style={{ padding: "12px" }}>E-mail</th>
                    <th style={{ padding: "12px" }}>Serviço</th>
                    <th style={{ padding: "12px" }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      style={{ borderBottom: "1px solid #333" }}
                    >
                      <td style={{ padding: "12px" }}>{lead.name}</td>
                      <td style={{ padding: "12px", color: "#aaa" }}>
                        {lead.email}
                      </td>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: "15px" }}>
                        <span style={{ flex: 1 }}>{lead.service}</span>

                        {/* Botão de Mensagem 💬 */}
                        <button
                          onClick={() => setSelectedEnvironment(lead.environment ? lead.environment : 'Este cliente não deixou nenhuma informação sobre o ambiente.')}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            padding: '5px',
                            transition: 'transform 0.2s ease'
                          }}
                          title="Ler mensagem do cliente"
                          onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
                          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                          💬
                        </button>

                        {/* Botão de Excluir 🗑️ */}
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            padding: '5px',
                            transition: 'transform 0.2s ease',
                            color: '#ff4d4d' // Um tom de vermelho elegante
                          }}
                          title="Excluir orçamento"
                          onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
                          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                          🗑️
                        </button>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <a
                          href={`https://wa.me/55${lead.phone.replace(/\D/g, "")}?text=Olá ${lead.name}, sou da Garbo Ambientes Planejados. Recebemos seu pedido de orçamento para ${lead.service}! Como podemos ajudar?`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: "#25D366",
                            color: "#fff",
                            padding: "8px 12px",
                            textDecoration: "none",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            display: "inline-block",
                          }}
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
      )
      }

      {/* 5. 🟡 TELA DE CLIENTES */}
      {
        activeTab === "clientes" && (
          <section
            className="clients-section"
            style={{
              background: "#1e1e1e",
              padding: "2rem",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ color: "#fff", margin: 0 }}>Clientes Registrados</h2>
              <button
                style={{
                  background: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() => handleOpenClientModal()}
              >
                ➕ Novo Cliente
              </button>
            </div>

            {clients.length === 0 ? (
              <p style={{ color: "#888" }}>Nenhum cliente registrado ainda.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "1px solid #444" }}>
                      <th style={{ padding: "12px" }}>Nome</th>
                      <th style={{ padding: "12px" }}>E-mail</th>
                      <th style={{ padding: "12px" }}>Telefone</th>
                      <th style={{ padding: "12px" }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr
                        key={client.id}
                        style={{ borderBottom: "1px solid #333" }}
                      >
                        <td style={{ padding: "12px", fontWeight: "bold" }}>
                          {client.name}
                        </td>
                        <td style={{ padding: "12px", color: "#aaa" }}>
                          {client.email}
                        </td>
                        <td style={{ padding: "12px", color: "#aaa" }}>
                          {client.phone || "Não informado"}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <button
                            onClick={() => handleOpenClientModal(client)}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "1.2rem",
                              marginRight: "10px",
                            }}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client.id)}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "1.2rem",
                            }}
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )
      }

      {/* 5.1 MODAL DE CLIENTE */}
      {
        showClientModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#2c2c2c",
                padding: "2rem",
                borderRadius: "8px",
                width: "400px",
                maxWidth: "90%",
              }}
            >
              <h3 style={{ color: "#fff", marginTop: 0 }}>
                {editingClient ? "Editar Cliente" : "Novo Cliente"}
              </h3>
              <form
                onSubmit={handleSaveClient}
                style={{ display: "flex", flexDirection: "column", gap: "15px" }}
              >
                <input
                  type="text"
                  placeholder="Nome do Cliente"
                  required
                  value={clientForm.name}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, name: e.target.value })
                  }
                  style={{
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #444",
                    background: "#1e1e1e",
                    color: "#fff",
                  }}
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  required
                  value={clientForm.email}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, email: e.target.value })
                  }
                  style={{
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #444",
                    background: "#1e1e1e",
                    color: "#fff",
                  }}
                />
                <input
                  type="text"
                  placeholder="Telefone / WhatsApp"
                  value={clientForm.phone}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, phone: e.target.value })
                  }
                  style={{
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #444",
                    background: "#1e1e1e",
                    color: "#fff",
                  }}
                />
                {/* CAMPO DE SENHA INTELIGENTE */}
                <input
                  type="password"
                  placeholder={
                    editingClient
                      ? "Nova Senha (deixe em branco para manter)"
                      : "Palavra-passe de Acesso *"
                  }
                  required={!editingClient} // Só é obrigatório se for um cliente NOVO
                  value={clientForm.password}
                  onChange={(e) =>
                    setClientForm({ ...clientForm, password: e.target.value })
                  }
                  style={{
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #444",
                    background: "#1e1e1e",
                    color: "#fff",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowClientModal(false)}
                    style={{
                      background: "transparent",
                      color: "#aaa",
                      border: "1px solid #555",
                      padding: "8px 15px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: "#3498db",
                      color: "#fff",
                      border: "none",
                      padding: "8px 15px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* 6. 💰 TELA DO FINANCEIRO */}
      {
        activeTab === "financeiro" && (
          <section
            className="finance-section"
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {/* CARDS DE RESUMO (Visão de Dono) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  background: "#1e1e1e",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  borderLeft: "5px solid #4CAF50",
                }}
              >
                <p style={{ margin: 0, color: "#aaa", fontSize: "0.9rem" }}>
                  Total de Entradas
                </p>
                <h2 style={{ margin: "10px 0 0 0", color: "#4CAF50" }}>
                  {formatCurrency(totalReceitas)}
                </h2>
              </div>
              <div
                style={{
                  background: "#1e1e1e",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  borderLeft: "5px solid #e74c3c",
                }}
              >
                <p style={{ margin: 0, color: "#aaa", fontSize: "0.9rem" }}>
                  Total de Saídas
                </p>
                <h2 style={{ margin: "10px 0 0 0", color: "#e74c3c" }}>
                  {formatCurrency(totalDespesas)}
                </h2>
              </div>
              <div
                style={{
                  background: "#1e1e1e",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  borderLeft: `5px solid ${saldoAtual >= 0 ? "#3498db" : "#e74c3c"}`,
                }}
              >
                <p style={{ margin: 0, color: "#aaa", fontSize: "0.9rem" }}>
                  Saldo Atual
                </p>
                <h2
                  style={{
                    margin: "10px 0 0 0",
                    color: saldoAtual >= 0 ? "#3498db" : "#e74c3c",
                  }}
                >
                  {formatCurrency(saldoAtual)}
                </h2>
              </div>
            </div>

            {/* FORMULÁRIO DE NOVO LANÇAMENTO & TABELA */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "2rem",
                alignItems: "start",
              }}
            >
              {/* Formulário Fixo na Esquerda */}
              <div
                style={{
                  background: "#1e1e1e",
                  padding: "1.5rem",
                  borderRadius: "8px",
                }}
              >
                <h3 style={{ marginTop: 0, color: "#fff" }}>Novo Lançamento</h3>
                <br />
                <form
                  onSubmit={handleSaveTransaction}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Descrição (Ex: Compra MDF)"
                    required
                    value={transactionForm.description}
                    onChange={(e) =>
                      setTransactionForm({
                        ...transactionForm,
                        description: e.target.value,
                      })
                    }
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #444",
                      background: "#2c2c2c",
                      color: "#fff",
                    }}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Valor (R$)"
                    required
                    value={transactionForm.amount}
                    onChange={(e) =>
                      setTransactionForm({
                        ...transactionForm,
                        amount: e.target.value,
                      })
                    }
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #444",
                      background: "#2c2c2c",
                      color: "#fff",
                    }}
                  />
                  <input
                    type="date"
                    value={transactionForm.date}
                    onChange={(e) =>
                      setTransactionForm({
                        ...transactionForm,
                        date: e.target.value,
                      })
                    }
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #444",
                      background: "#2c2c2c",
                      color: "#fff",
                    }}
                  />
                  <select
                    value={transactionForm.type}
                    onChange={(e) =>
                      setTransactionForm({
                        ...transactionForm,
                        type: e.target.value,
                      })
                    }
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #444",
                      background: "#2c2c2c",
                      color: "#fff",
                    }}
                  >
                    <option value="RECEITA">Entrada (Receita)</option>
                    <option value="DESPESA">Saída (Despesa)</option>
                  </select>
                  <button
                    type="submit"
                    style={{
                      background: "#4CAF50",
                      color: "#fff",
                      border: "none",
                      padding: "10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    ➕ Adicionar
                  </button>
                </form>
              </div>

              {/* Tabela de Transações na Direita */}
              <div
                style={{
                  background: "#1e1e1e",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  overflowX: "auto",
                }}
              >
                <h3 style={{ marginTop: 0, color: "#fff" }}>Extrato Recente</h3>
                <br />
                {transactions.length === 0 ? (
                  <p style={{ color: "#888" }}>
                    Nenhuma movimentação registrada.
                  </p>
                ) : (
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      color: "#fff",
                      textAlign: "left",
                    }}
                  >
                    <thead>
                      <tr style={{ borderBottom: "1px solid #444" }}>
                        <th style={{ padding: "12px" }}>Data</th>
                        <th style={{ padding: "12px" }}>Descrição</th>
                        <th style={{ padding: "12px" }}>Valor</th>
                        <th style={{ padding: "12px" }}>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((t) => (
                          <tr
                            key={t.id}
                            style={{ borderBottom: "1px solid #333" }}
                          >
                            <td style={{ padding: "12px", color: "#aaa" }}>
                              {new Date(t.date).toLocaleDateString("pt-BR", {
                                timeZone: "UTC",
                              })}
                            </td>
                            <td style={{ padding: "12px" }}>{t.description}</td>
                            <td
                              style={{
                                padding: "12px",
                                color:
                                  t.type === "RECEITA" ? "#4CAF50" : "#e74c3c",
                                fontWeight: "bold",
                              }}
                            >
                              {t.type === "RECEITA" ? "+" : "-"}{" "}
                              {formatCurrency(t.amount)}
                            </td>
                            <td style={{ padding: "12px" }}>
                              <button
                                onClick={() => handleDeleteTransaction(t.id)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "1.2rem",
                                }}
                                title="Excluir"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </section>
        )
      }

      {/* =========================================
        MODAL DE MENSAGEM DO LEAD
      ========================================= */}
      {selectedEnvironment && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedEnvironment(null)} // Fecha ao clicar fora da caixinha
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fundo escuro transparente
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999, // Garante que fique por cima de tudo
            backdropFilter: 'blur(3px)' // Efeito de desfoque moderno
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Impede que clicar dentro feche o modal
            style={{
              backgroundColor: '#121212',
              border: '1px solid #d4af37', // Borda dourada Garbo
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
              animation: 'fadeIn 0.3s ease'
            }}
          >
            <h3 style={{ color: '#d4af37', marginTop: 0, marginBottom: '20px', fontSize: '1.5rem' }}>
              Detalhes do Pedido
            </h3>

            {/* O whiteSpace 'pre-wrap' garante que as quebras de linha que o cliente digitou no textarea sejam mantidas */}
            <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '1rem', whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto' }}>
              {selectedEnvironment}
            </p>

            <div style={{ textAlign: 'right', marginTop: '30px' }}>
              <button
                onClick={() => setSelectedEnvironment(null)}
                style={{
                  backgroundColor: '#d4af37',
                  color: '#000',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default AdminDashboard;
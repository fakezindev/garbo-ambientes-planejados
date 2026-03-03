import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api"; // Ajuste o caminho se necessário
import "./Home.css";
import imgEdna from "../../assets/edna_arquiteta.jpeg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => {
  const [projects, setProjects] = useState([]);

  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEnvironment, setLeadEnvironment] = useState("");
  const [leadStatus, setLeadStatus] = useState("");

  // Busca os projetos reais do seu banco de dados ao carregar a página
  useEffect(() => {
    api
      .get("/projects")
      .then((response) => setProjects(response.data))
      .catch((err) => console.error("Erro ao buscar projetos:", err));
  }, []);

  const handleSubmitLead = async (e) => {
    e.preventDefault();
    setLeadStatus("Enviando...");

    try {
      await api.post("/leads", {
        name: leadName,
        email: leadEmail,
        phone: leadPhone,
        environment: leadEnvironment,
      });

      setLeadStatus("Sucesso! Em breve nossa equipe entrará em contato.");
      // Limpa o formulário
      setLeadName("");
      setLeadEmail("");
      setLeadPhone("");
      setLeadEnvironment("");
    } catch (error) {
      console.error("Erro ao enviar lead:", error);
      setLeadStatus("Erro ao enviar. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="home-container">
      {/* 1. CABEÇALHO (Menu de Navegação) */}
      <header className="public-header">
        <div className="logo-garbo">GARBO</div>
        <nav className="main-nav">
          <a href="#sobre">Sobre Nós</a>
          <a href="#portfolio">Projetos</a>
          <a href="#contato">Orçamento</a>
          <Link to="/area-cliente" className="btn-area-cliente">
            Área do Cliente
          </Link>
        </nav>
      </header>

      {/* 2. HERO SECTION (A primeira impressão de impacto) */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Transformando Espaços em Sonhos Planejados</h1>
          <p>
            Design exclusivo, marcenaria de alto padrão e pontualidade na
            entrega. O seu ambiente perfeito começa aqui.
          </p>
          <a href="#contato" className="btn-hero">
            Solicite um Orçamento
          </a>
        </div>
      </section>

      {/* =========================================
    SESSÃO: QUEM SOMOS (AS SÓCIAS)
    ========================================= */}
      <section className="about-section" id="sobre">
        <div className="section-title">
          <h2 style={{ color: "#d4af37" }}>Quem Somos</h2>
          <p style={{ color: "#aaa", marginTop: "10px" }}>
            As mentes brilhantes por trás da Garbo Ambientes Planejados
          </p>
        </div>

        <div className="team-grid">
          {/* CARD 1: EDNA RAMOS */}
          <div className="team-card">
            <div className="team-image-wrapper">
              <img src={imgEdna} alt="Edna Ramos" className="team-image" />
            </div>
            <div className="team-info">
              <h3>Edna Ramos</h3>
              <span className="team-role">Sócia-Fundadora & Arquiteta</span>
              <p>
                Com anos de experiência em transformar espaços em verdadeiros
                lares, Edna traz o olhar técnico, sofisticado e acolhedor da
                arquitetura para cada projeto desenvolvido pela Garbo.
              </p>
            </div>
          </div>

          {/* CARD 2: MARCIA */}
          <div className="team-card">
            <div className="team-image-wrapper">
              <div
                className="placeholder-image"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  backgroundColor: "#0a0a0a",
                }}
              >
                <span style={{ fontSize: "3rem" }}>📸</span>
                <p style={{ marginTop: "10px", color: "#666" }}>
                  Foto da Marcia
                </p>
              </div>
            </div>
            <div className="team-info">
              <h3>Marcia</h3>
              <span className="team-role">Sócia-Fundadora & Arquiteta</span>
              <p>
                Especialista em planejamento e execução de excelência, Marcia
                garante que cada milímetro do seu projeto saia do papel com
                precisão, qualidade e pontualidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
    SESSÃO: NOSSO PROPÓSITO (MVV)
    ========================================= */}
      <section className="mvv-section" id="proposito">
        <div className="section-title">
          <h2 style={{ color: "#d4af37" }}>Nosso Propósito</h2>
          <p style={{ color: "#aaa", marginTop: "10px" }}>
            A excelência por trás de cada detalhe dos seus móveis planejados.
          </p>
        </div>

        <div className="mvv-grid">
          <div className="mvv-card">
            <div className="icon">🎯</div>
            <h3>Missão</h3>
            <p>
              Entregar ambientes planejados que unam estética refinada,
              funcionalidade inteligente e o estilo único de cada cliente.
            </p>
          </div>

          <div className="mvv-card">
            <div className="icon">👁️</div>
            <h3>Visão</h3>
            <p>
              Ser referência em arquitetura e design de interiores pela
              excelência, transparência e inovação nos projetos.
            </p>
          </div>

          <div className="mvv-card">
            <div className="icon">💎</div>
            <h3>Valores</h3>
            <p>
              Qualidade Absoluta, Respeito aos prazos combinados, Transparência
              no atendimento e Foco no detalhe.
            </p>
          </div>
        </div>
      </section>

      {/* 4. GALERIA DE PROJETOS (A Vitrine conectada ao Backend) */}
      <section id="portfolio" className="portfolio-public">
        <div className="section-title">
          <h2 style={{ color: "#d4af37" }}>Nosso Portfólio</h2>
          <p style={{ color: "#aaa", marginTop: "10px" }}>
            Inspire-se com os nossos trabalhos mais recentes.
          </p>
        </div>

        <div className="projects-grid public-grid">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="portfolio-card">
                {/* O container que trava a altura em 280px para TODAS as fotos */}
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

                {/* Textos alinhados e estilizados */}
                <div className="portfolio-content">
                  <span className="portfolio-category">
                    {project.category || "PLANEJADOS"}
                  </span>
                  <h3 className="portfolio-title">{project.title}</h3>

                  {/* Estilo adicionado para a descrição não quebrar o layout escuro */}
                  <p
                    style={{
                      color: "#aaa",
                      fontSize: "0.9rem",
                      marginTop: "10px",
                      lineHeight: "1.5",
                      margin: "10px 0 0 0",
                    }}
                  >
                    {project.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            /* Mensagem de vazio ajustada para o tema (gridColumn faz o texto centralizar na tela toda) */
            <p
              style={{
                textAlign: "center",
                color: "#aaa",
                gridColumn: "1 / -1",
                padding: "50px 0",
              }}
            >
              Nenhum projeto encontrado.
            </p>
          )}
        </div>
      </section>

      {/* =========================================
        SESSÃO: LOCALIZAÇÃO
    ========================================= */}
      <section
        className="location-section"
        id="localizacao"
        style={{ padding: "80px 5%", backgroundColor: "#121212", margin: 0 }}
      >
        <div
          className="section-title"
          style={{ textAlign: "center", marginBottom: "40px" }}
        >
          <h2
            style={{
              color: "#d4af37",
              fontSize: "2.5rem",
              margin: 0,
              lineHeight: 1,
            }}
          >
            Nossa Localização
          </h2>
          <p style={{ color: "#aaa", marginTop: "15px", fontSize: "1.1rem" }}>
            Venha tomar um café conosco e planejar o seu ambiente.
          </p>
        </div>

        {/* Container do Mapa com bordas e sombra premium */}
        <div
          className="map-container"
          style={{
            width: "100%",
            maxWidth: "1000px",
            height: "450px",
            margin: "0 auto",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #333",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <iframe
            title="Localização Garbo Arquitetura e Planejados"
            src="https://maps.google.com/maps?q=Avenida%20Andr%C3%A9%20Luiz,%20296,%20Pican%C3%A7o,%20Guarulhos&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "#fff",
            fontSize: "1.2rem",
            fontWeight: "500",
          }}
        >
          <p style={{ margin: 0 }}>
            📍 <strong>Avenida André Luiz, 296</strong> - Picanço / Guarulhos -
            SP
          </p>
        </div>
      </section>

      {/* =========================================
        SESSÃO: ORÇAMENTO / CONTATO
    ========================================= */}
      <section
        className="contact-section"
        id="orcamento"
        style={{ padding: "80px 5%", backgroundColor: "#1a1a1a", margin: 0 }}
      >
        <div
          className="section-title"
          style={{ textAlign: "center", marginBottom: "40px" }}
        >
          <h2
            style={{
              color: "#d4af37",
              fontSize: "2.5rem",
              margin: 0,
              lineHeight: 1,
            }}
          >
            Solicite seu Orçamento
          </h2>
          <p style={{ color: "#aaa", marginTop: "15px", fontSize: "1.1rem" }}>
            Preencha os dados abaixo e dê o primeiro passo para o seu novo
            projeto.
          </p>
        </div>

        <div
          className="contact-box"
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            background: "#121212",
            padding: "40px",
            borderRadius: "12px",
            border: "1px solid #333",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <form
            className="lead-form"
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <input
                type="text"
                placeholder="Seu Nome Completo"
                required
                className="input-field"
                style={{ width: "100%", boxSizing: "border-box" }}
              />
              <input
                type="tel"
                placeholder="Seu WhatsApp"
                required
                className="input-field"
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <input
              type="email"
              placeholder="Seu E-mail"
              required
              className="input-field"
              style={{ width: "100%", boxSizing: "border-box" }}
            />

            {/* 🎯 AQUI O CLIENTE ESCOLHE O SERVIÇO EXATO DO BANNER */}
            <select
              required
              className="input-field"
              defaultValue=""
              style={{ width: "100%", boxSizing: "border-box" }}
            >
              <option value="" disabled>
                Qual serviço deseja solicitar?
              </option>
              <option value="Móveis planejados">Móveis planejados</option>
              <option value="Serviço em gesso">Serviço em gesso</option>
              <option value="Designer de interior">Designer de interior</option>
              <option value="Reforma em geral">Reforma em geral</option>
              <option value="Projetos Arquitetônicos">
                Projetos Arquitetônicos
              </option>
              <option value="Piso vinílico e Laminado">
                Piso vinílico e Laminado
              </option>
              <option value="RRT">RRT</option>
              <option value="Laudo técnico">Laudo técnico</option>
              <option value="Persianas e cortinas">Persianas e cortinas</option>
              <option value="Pedras de granitos">Pedras de granitos</option>
            </select>

            <textarea
              placeholder="Conte-nos um pouco mais sobre o que você precisa..."
              rows="4"
              className="input-field"
              style={{
                resize: "vertical",
                width: "100%",
                boxSizing: "border-box",
              }}
            ></textarea>

            <button
              type="submit"
              className="btn-submit-lead"
              style={{
                marginTop: "10px",
                padding: "15px",
                borderRadius: "8px",
                fontSize: "1.1rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Enviar Solicitação
            </button>
          </form>
        </div>
      </section>

      {/* =========================================
    SESSÃO: FOOTER (RODAPÉ) COMPLETO
    ========================================= */}
      <footer
        className="public-footer"
        style={{
          backgroundColor: "#0a0a0a",
          padding: "60px 5% 20px",
          borderTop: "1px solid #222",
          margin: 0,
        }}
      >
        {/* Container principal das colunas */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "40px",
            maxWidth: "1200px",
            margin: "0 auto",
            paddingBottom: "40px",
            textAlign: "left",
          }}
        >
          {/* COLUNA 1: Marca e Endereço */}
          <div style={{ flex: "1", minWidth: "250px" }}>
            <h2
              style={{
                color: "#d4af37",
                margin: "0 0 15px 0",
                letterSpacing: "3px",
                fontSize: "1.8rem",
                fontWeight: "800",
              }}
            >
              GARBO
            </h2>
            <p
              style={{
                color: "#aaa",
                fontSize: "0.95rem",
                lineHeight: "1.6",
                margin: "0 0 15px 0",
              }}
            >
              Arquitetura e Planejados.
              <br />
              Transformando espaços em verdadeiros lares.
            </p>
            <p
              style={{
                color: "#888",
                fontSize: "0.9rem",
                margin: 0,
                lineHeight: "1.5",
              }}
            >
              📍 Avenida André Luiz, 296 Picanço - Guarulhos / SP
            </p>
          </div>

          {/* COLUNA 2: Fale Conosco (Telefones e E-mail) */}
          <div>
            <h3
              style={{
                color: "#fff",
                fontSize: "1.1rem",
                marginBottom: "20px",
                fontWeight: "600",
              }}
            >
              Fale Conosco
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                color: "#aaa",
                fontSize: "0.95rem",
                lineHeight: "1.8",
              }}
            >
              <li>
                <a
                  href="https://api.whatsapp.com/message/2SSB4H5EDYLIO1?autoload=1&app_absent=0&utm_source=ig&text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20um%20or%C3%A7amento%21"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#aaa", textDecoration: "none" }}
                  onMouseOver={(e) => (e.target.style.color = "#d4af37")}
                  onMouseOut={(e) => (e.target.style.color = "#aaa")}
                >
                  📞 Edna: (11) 99955-8023
                </a>
              </li>
              <li>
                <a
                  href="https://api.whatsapp.com/send/?phone=5511986460451&text&type=phone_number&app_absent=0&utm_source=ig"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#aaa", textDecoration: "none" }}
                  onMouseOver={(e) => (e.target.style.color = "#d4af37")}
                  onMouseOut={(e) => (e.target.style.color = "#aaa")}
                >
                  📞 Marcia: (11) 98646-0451
                </a>
              </li>
              {/* 🚨 PREENCHA O E-MAIL AQUI */}
              <li>✉️ E-mail: garboarqplan@gmail.com</li>
            </ul>
          </div>

          {/* COLUNA 3: Redes Sociais e CNPJ */}
          <div style={{ flex: "1", minWidth: "250px" }}>
            <h3
              style={{
                color: "#fff",
                fontSize: "1.1rem",
                marginBottom: "20px",
                fontWeight: "600",
              }}
            >
              Siga a Garbo
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 20px 0",
                fontSize: "0.95rem",
                lineHeight: "1.8",
              }}
            >
              <li>
                <a
                  href="https://instagram.com/garboarqplan"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#aaa", textDecoration: "none" }}
                  onMouseOver={(e) => (e.target.style.color = "#d4af37")}
                  onMouseOut={(e) => (e.target.style.color = "#aaa")}
                >
                  📸 @garboarqplan
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/ednaramosarquiteta"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#aaa", textDecoration: "none" }}
                  onMouseOver={(e) => (e.target.style.color = "#d4af37")}
                  onMouseOut={(e) => (e.target.style.color = "#aaa")}
                >
                  📸 @ednaramosarquiteta
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/marciaarquiteta_"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#aaa", textDecoration: "none" }}
                  onMouseOver={(e) => (e.target.style.color = "#d4af37")}
                  onMouseOut={(e) => (e.target.style.color = "#aaa")}
                >
                  📸 @marciaarquiteta_
                </a>
              </li>

              {/* 🚨 PREENCHA O TIKTOK AQUI */}
              <li>
                <a
                  href="https://tiktok.com/@garbo390"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#aaa", textDecoration: "none" }}
                  onMouseOver={(e) => (e.target.style.color = "#d4af37")}
                  onMouseOut={(e) => (e.target.style.color = "#aaa")}
                >
                  🎵 @garbo390
                </a>
              </li>
            </ul>
            {/* 🚨 PREENCHA O CNPJ AQUI */}
            <p style={{ color: "#666", fontSize: "0.85rem", margin: 0 }}>
              GARBO ARQUITETURA E PLANEJADOS LTDA - ME
              <br />
              CNPJ: 56.745.608/0001-08
            </p>
          </div>
        </div>

        {/* Linha Divisória Fina */}
        <div
          style={{
            borderTop: "1px solid #222", /* Um tom um pouquinho mais claro que o fundo para dar destaque */
            width: "100%",
            margin: "40px 0 20px 0",
          }}
        ></div>

        {/* Base: Direitos Autorais e Assinatura */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between", /* Joga o Copyright pra esquerda e a assinatura pra direita */
            alignItems: "center",
            gap: "20px",
            color: "#777",
            fontSize: "0.85rem",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 10px",
          }}
        >
          <p style={{ margin: 0, letterSpacing: "0.5px" }}>
            © {new Date().getFullYear()} Garbo. Todos os direitos reservados.
          </p>

          {/* SUA ASSINATURA VIP 💻✨ */}
          <div
            className="developer-signature"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "6px" 
            }}
          >
            <span>Desenvolvido com 💻 por</span>
            <a
              href="https://www.linkedin.com/in/bruno-henrique-ramos-alves/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#d4af37",
                textDecoration: "none",
                fontWeight: "600",
                letterSpacing: "0.5px",
                transition: "color 0.3s ease", /* Deixa a troca de cor do Hover mais suave */
              }}
              onMouseOver={(e) => (e.target.style.color = "#fff")}
              onMouseOut={(e) => (e.target.style.color = "#d4af37")}
            >
              Bruno Henrique
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

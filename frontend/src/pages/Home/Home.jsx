import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api"; // Ajuste o caminho se necessário
import "./Home.css";

import imgEdna from "../../assets/edna_arquiteta.png";
import imgMarcia from "../../assets/marcia_arquiteta.png";
import logoGarbo from "../../assets/logo_header.png";
import iconMissao from "../../assets/alvo-de-dardos.png";
import iconVisao from "../../assets/visao.png";
import iconValores from "../../assets/diamante.png";
import iconLocalizacao from "../../assets/pino-de-localizacao.png";
import iconWhatsapp from "../../assets/whatsapp.png";
import iconInstagram from "../../assets/instagram.png";
import iconTiktok from "../../assets/tik-tok.png";
import iconGmail from "../../assets/enviar.png";
import iconCode from "../../assets/codigo.png";
import bgVideo from "../../assets/video.mp4";

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
  const [leadService, setLeadService] = useState('');
  const [leadEnvironment, setLeadEnvironment] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 1️⃣ EFFECT DOS PROJETOS (Roda apenas uma vez ao abrir o site)
  useEffect(() => {
    api
      .get("/projects")
      .then((response) => setProjects(response.data))
      .catch((err) => console.error("Erro ao buscar projetos:", err));
  }, []); // 👈 Array vazio garante que roda só 1 vez!

  // 2️⃣ EFFECT DO SCROLL (Controla o Menu Inteligente)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false); // Esconde ao rolar para baixo
      } else {
        setShowHeader(true); // Mostra ao rolar para cima
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const handleSubmitLead = async (e) => {
    e.preventDefault();
    setIsSubmittingLead(true);

    try {
      const leadData = {
        name: leadName,
        email: leadEmail,
        phone: leadPhone,
        service: leadService,
        environment: leadEnvironment,
      };
      await api.post("/leads", leadData);

      toast.success('Solicitação enviada com sucesso! A equipe da Garbo entrará em contato em breve.', {
        position: "bottom-right", // Fica elegante no canto inferior
        theme: "dark" // Combina com o site da Garbo!
      });

      setLeadName("");
      setLeadEmail("");
      setLeadPhone("");
      setLeadService("");
      setLeadEnvironment("");

    } catch (error) {
      console.error("Erro ao enviar contato:", error);
      toast.error('Ocorreu um erro ao enviar sua solicitação. Por favor, tente pelo WhatsApp.', {
        position: "bottom-right",
        theme: "dark"
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <div className="home-container">
      {/* 1. CABEÇALHO (Menu de Navegação) */}
      <header className={`public-header ${showHeader ? '' : 'header-hidden'}`}>
        <div className="logo-garbo">
          <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={logoGarbo}
              alt="Garbo Arquitetura e Planejados"
              style={{ height: '50px', width: 'auto' }} // Ajuste a altura conforme necessário
            />
          </a>
        </div>
        <nav className="main-nav">
          <a href="#sobre">Sobre Nós</a>
          <a href="#portfolio">Projetos</a>
          <a href="#orcamento">Orçamento</a>
          <Link to="/area-cliente" className="btn-area-cliente">
            Área do Cliente
          </Link>
        </nav>
      </header>

      {/* =========================================
          HERO SECTION COM VÍDEO
          ========================================= */}
      <section className="hero-section" id="inicio">
        
        {/* 1. O Vídeo de Fundo */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="hero-video"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>

        {/* 2. Película escura para dar contraste */}
        <div className="hero-overlay"></div>

        {/* 3. O Conteúdo (Textos e Botões que você já tem) */}
        <div className="hero-content">
          <h1>Transformando Espaços em Sonhos Planejados</h1>
          <p>
            Design exclusivo, marcenaria de alto padrão e pontualidade na
            entrega. O seu ambiente perfeito começa aqui.
          </p>
          <a href="#orcamento" className="btn-hero">
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
              <img src={imgMarcia} alt="Marcia Nascimento" className="team-image" />
            </div>
            <div className="team-info">
              <h3>Marcia Nascimento</h3>
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
            <strong>A excelência por trás de cada detalhe dos seus móveis planejados.</strong>
          </p>
        </div>

        <div className="mvv-grid">
          <div className="mvv-card">
            <div className="icon">
              <img src={iconMissao} alt="Ícone Missão" />
            </div>
            <h3>Missão</h3>
            <p style={{ textAlign: "left" }}>
              <strong>
                Entregar ambientes planejados que unam estética refinada,
                funcionalidade inteligente e o estilo único de cada cliente.
              </strong>
            </p>
          </div>

          <div className="mvv-card">
            <div className="icon">
              <img src={iconVisao} alt="Ícone Visão" />
            </div>
            <h3>Visão</h3>
            <p style={{ textAlign: "left" }}>
              <strong>
                Ser referência em arquitetura e design de interiores pela
                excelência, transparência e inovação nos projetos.
              </strong>
            </p>
          </div>

          <div className="mvv-card">
            <div className="icon">
              <img src={iconValores} alt="Ícone Valores" />
            </div>
            <h3>Valores</h3>
            <p style={{ textAlign: "left" }}>
              <strong>
                Qualidade Absoluta, Respeito aos prazos combinados, Transparência
                no atendimento e Foco no detalhe.
              </strong>
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
            <div className="alfinete-icon" style={{ display: 'inline-flex' }}>
              <img src={iconLocalizacao} alt="Ícone Localização" />
            </div> <strong>Av. André Luiz, 296 - </strong> Picanço, Guarulhos - SP, 07082-050
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
            onSubmit={handleSubmitLead}
          >
            <div
              className="form-row-mobile"
            >
              <input
                type="text"
                placeholder="Seu Nome Completo"
                required
                className="input-field"
                style={{ width: "100%", boxSizing: "border-box" }}
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Seu WhatsApp"
                required
                className="input-field"
                style={{ width: "100%", boxSizing: "border-box" }}
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
              />
            </div>

            <input
              type="email"
              placeholder="Seu E-mail"
              required
              className="input-field"
              style={{ width: "100%", boxSizing: "border-box" }}
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
            />

            {/* 🎯 AQUI O CLIENTE ESCOLHE O SERVIÇO EXATO DO BANNER */}
            <select
              required
              className="input-field"
              style={{ width: "100%", boxSizing: "border-box" }}
              value={leadService}
              onChange={(e) => setLeadService(e.target.value)}
            >
              <option value="" disabled> Qual serviço deseja solicitar?</option>
              <option value="Móveis planejados">Móveis planejados</option>
              <option value="Serviço em gesso">Serviço em gesso</option>
              <option value="Designer de interior">Designer de interior</option>
              <option value="Reforma em geral">Reforma em geral</option>
              <option value="Projetos Arquitetônicos"> Projetos Arquitetônicos</option>
              <option value="Piso vinílico e Laminado">Piso vinílico e Laminado</option>
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
              value={leadEnvironment}
              onChange={(e) => setLeadEnvironment(e.target.value)}
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
              {isSubmittingLead ? 'Enviando...' : 'Enviar Solicitação'}
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
          padding: "50px 5% 20px",
          borderTop: "1px solid #222",
          margin: 0,
          height: "auto",
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
            <a href="/" style={{ display: 'inline-block', marginBottom: '15px' }}>
              <img
                src={logoGarbo}
                alt="Garbo Arquitetura e Planejados"
                style={{ height: '60px', width: 'auto' }} /* Deixei com 60px para dar um destaque bonito no rodapé */
              />
            </a>
            {/* 🚨 PREENCHA O CNPJ AQUI */}
            <p style={{ color: "#666", fontSize: "0.85rem", margin: 0 }}>
              GARBO ARQUITETURA E PLANEJADOS LTDA - ME
              <br />
              CNPJ: 56.745.608/0001-08
            </p>
          </div>

          {/* COLUNA 2: Fale Conosco */}
          <div>
            <h3 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "20px", fontWeight: "600" }}>
              Fale Conosco
            </h3>
            <ul className="footer-links">
              <li>
                <a href="https://api.whatsapp.com/message/2SSB4H5EDYLIO1?autoload=1&app_absent=0&utm_source=ig&text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20um%20or%C3%A7amento%21" target="_blank" rel="noreferrer">
                  <img src={iconWhatsapp} alt="WhatsApp" className="footer-icon" />
                  Edna: (11) 99955-8023
                </a>
              </li>
              <li>
                <a href="https://api.whatsapp.com/send/?phone=5511986460451&text&type=phone_number&app_absent=0&utm_source=ig" target="_blank" rel="noreferrer">
                  <img src={iconWhatsapp} alt="WhatsApp" className="footer-icon" />
                  Marcia: (11) 98646-0451
                </a>
              </li>
              <li className="footer-text-item">
                <img src={iconGmail} alt="E-mail" className="footer-icon" />
                garboarqplan@gmail.com
              </li>
            </ul>
          </div>

          {/* COLUNA 3: Redes Sociais e CNPJ */}
          <div style={{ flex: "1", minWidth: "250px" }}>
            <h3 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "20px", fontWeight: "600" }}>
              Siga a Garbo
            </h3>
            <ul className="footer-links" style={{ marginBottom: "20px" }}>
              <li>
                <a href="https://instagram.com/garboarqplan" target="_blank" rel="noreferrer">
                  <img src={iconInstagram} alt="Instagram" className="footer-icon" />
                  @garboarqplan
                </a>
              </li>
              <li>
                <a href="https://instagram.com/ednaramosarquiteta" target="_blank" rel="noreferrer">
                  <img src={iconInstagram} alt="Instagram" className="footer-icon" />
                  @ednaramosarquiteta
                </a>
              </li>
              <li>
                <a href="https://instagram.com/marciaarquiteta_" target="_blank" rel="noreferrer">
                  <img src={iconInstagram} alt="Instagram" className="footer-icon" />
                  @marciaarquiteta_
                </a>
              </li>
              <li>
                <a href="https://tiktok.com/@garbo390" target="_blank" rel="noreferrer">
                  <img src={iconTiktok} alt="TikTok" className="footer-icon" />
                  @garbo390
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha Divisória Fina */}
        <div
          style={{
            borderTop: "1px solid #222", /* Um tom um pouquinho mais claro que o fundo para dar destaque */
            width: "100%",
            margin: "0px 0 20px 0",
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
            © {new Date().getFullYear()} Garbo Arquitetura e Planejados. Todos os direitos reservados.
          </p>

          <div className="developer-signature" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              Desenvolvido com <img src={iconCode} alt="Code" className="signature-icon" /> por
            </span>
            <a href="https://www.linkedin.com/in/bruno-henrique-ramos-alves/" target="_blank" rel="noopener noreferrer" style={{ color: "#d4af37", textDecoration: "none", fontWeight: "600", letterSpacing: "0.5px", transition: "color 0.3s ease" }} onMouseOver={(e) => (e.target.style.color = "#fff")} onMouseOut={(e) => (e.target.style.color = "#d4af37")}>
              Bruno Henrique
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

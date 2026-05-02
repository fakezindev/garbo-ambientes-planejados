import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./Home.css";

import imgEdna from "../../assets/edna_arquiteta1.jpeg";
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

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => {
  const [projects, setProjects] = useState([]);

  // Controla qual projeto está aberto na Galeria em Tela Cheia
  const [activeProjectGallery, setActiveProjectGallery] = useState(null);
  
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadService, setLeadService] = useState("");
  const [leadEnvironment, setLeadEnvironment] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [activeTab, setActiveTab] = useState("projetos"); // Controla a aba ativa para o efeito de scroll

  // Radar para descobrir se o cliente está no celular (tela menor que 768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // MÁGICA DO MOBILE: Tocar vídeos ao rolar a tela
  useEffect(() => {
    // Só ativamos o observer se estivermos na aba de projetos
    if (activeTab !== "projetos") return;

    // Cria o "vigia" da tela
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          // Verifica se é uma tela de celular (menor que 768px)
          const isMobile = window.innerWidth <= 768;

          if (isMobile) {
            if (entry.isIntersecting) {
              // Se 50% do vídeo apareceu na tela, dá play
              video
                .play()
                .catch((err) =>
                  console.log("Autoplay bloqueado pelo navegador:", err),
                );
            } else {
              // Se o vídeo saiu da tela, pausa para economizar bateria/dados
              video.pause();
            }
          }
        });
      },
      {
        threshold: 0.5, // 0.5 significa que dispara quando 50% do vídeo está visível
      },
    );

    // Manda o vigia olhar para todos os vídeos dentro dos cards de portfólio
    const videos = document.querySelectorAll(".portfolio-card video");
    videos.forEach((video) => observer.observe(video));

    // Limpeza: quando sair da tela, desliga o vigia
    return () => {
      videos.forEach((video) => observer.unobserve(video));
    };
  }, [projects, activeTab]); // Re-executa se a lista de projetos ou a aba mudar

  const handleSubmitLead = async (e) => {
    e.preventDefault();
    // 🛑 TRAVA DO FRONTEND: Exige o DDD e os 9 dígitos antes de chamar a API
    if (leadPhone.length < 15) {
      toast.warning("Por favor, digite o WhatsApp completo com DDD.", {
        position: "bottom-right",
        theme: "dark",
      });
      return; // Interrompe a função aqui
    }

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

      toast.success(
        "Solicitação enviada com sucesso! A equipe da Garbo entrará em contato em breve.",
        {
          position: "bottom-right", // Fica elegante no canto inferior
          theme: "dark", // Combina com o site da Garbo!
        },
      );

      setLeadName("");
      setLeadEmail("");
      setLeadPhone("");
      setLeadService("");
      setLeadEnvironment("");
    } catch (error) {
      console.error("Erro ao enviar contato:", error);
      toast.error(
        "Ocorreu um erro ao enviar sua solicitação. Por favor, tente pelo WhatsApp.",
        {
          position: "bottom-right",
          theme: "dark",
        },
      );
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // 🎭 Máscara para formatar o Telefone automaticamente
  const formatPhone = (value) => {
    if (!value) return "";
    return String(value)
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4,5})(\d{4})/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  return (
    <div className="home-container">
      {/* 1. CABEÇALHO (Menu de Navegação) */}
      <header className={`public-header ${showHeader ? "" : "header-hidden"}`}>
        <div className="logo-garbo">
          <a href="/" style={{ display: "flex", alignItems: "center" }}>
            <img
              src={logoGarbo}
              alt="Garbo Arquitetura e Planejados"
              style={{ height: "50px", width: "auto" }} // Ajuste a altura conforme necessário
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
        {/* 1. O Vídeo Inteligente: Muda a fonte dependendo do tamanho da tela */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
          preload="auto"
          // A propriedade key força o React a recarregar o player quando a tela muda
          key={isMobile ? "video-mobile" : "video-desktop"}
        >
          <source
            src={
              isMobile
                ? "https://pub-7a2f5cd0bcb44e32bc85b66200776d9f.r2.dev/Video2.mp4"
                : "https://pub-7a2f5cd0bcb44e32bc85b66200776d9f.r2.dev/Video1.mp4"
            }
            type="video/mp4"
          />
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
              <img
                src={imgMarcia}
                alt="Marcia Nascimento"
                className="team-image"
              />
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
            <strong>
              A excelência por trás de cada detalhe dos seus móveis planejados.
            </strong>
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
                Qualidade Absoluta, Respeito aos prazos combinados,
                Transparência no atendimento e Foco no detalhe.
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          4. GALERIA DE PROJETOS (VITRINE LIMPA)
          ========================================= */}
      <section id="portfolio" className="portfolio-public">
        <div className="section-title">
          <h2 style={{ color: "#d4af37" }}>Nosso Portfólio</h2>
          <p style={{ color: "#aaa", marginTop: "10px" }}>
            Inspire-se com os nossos trabalhos mais recentes.
          </p>
        </div>

        <div className="portfolio-carousel-container" style={{ padding: "0 5%" }}>
          {projects && projects.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              loop={true}
              navigation={true}
              pagination={{ clickable: true, dynamicBullets: true }}
              className="projects-master-swiper"
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1440: { slidesPerView: 4 },
              }}
            >
              {projects.map((project) => {
                // Pega apenas a primeira mídia para ser a "Capa" do card
                const coverUrl = project.coverImageUrl || 
                                (project.imageUrls && project.imageUrls[0]) || 
                                (project.videoUrls && project.videoUrls[0]);
                const isVideo = coverUrl && (coverUrl.includes(".mp4") || coverUrl.includes(".mov"));

                return (
                  <SwiperSlide key={project.id}>
                    {/* 🏆 CARD UNIFICADO: Ao clicar, abre a galeria */}
                    <div className="portfolio-card" onClick={() => setActiveProjectGallery(project)}>
                      <div className="portfolio-image-wrapper">
                        
                        {isVideo ? (
                          <video src={coverUrl} autoPlay loop muted playsInline className="portfolio-image" />
                        ) : coverUrl ? (
                          <img src={coverUrl} alt={project.title} className="portfolio-image" />
                        ) : (
                          <div className="no-image-placeholder">Sem Imagem</div>
                        )}

                        {/* MÁSCARA DE HOVER ELEGANTE */}
                        <div className="card-hover-overlay">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                          </svg>
                          <span>Ver Projeto</span>
                        </div>

                      </div>

                      <div className="portfolio-content">
                        <span className="portfolio-category">{project.category || "PLANEJADOS"}</span>
                        <h3 className="portfolio-title">{project.title}</h3>
                        <p className="portfolio-desc">{project.description}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <p className="empty-portfolio">Nenhum projeto encontrado.</p>
          )}
        </div>
      </section>

      {/* =========================================
          ✨ A GALERIA FULLSCREEN (MODAL) ✨
          ========================================= */}
      {activeProjectGallery && (
        <div className="fullscreen-gallery-overlay">
          <button className="gallery-close-btn" onClick={() => setActiveProjectGallery(null)}>&times;</button>
          
          <div className="gallery-header">
            <h3>{activeProjectGallery.title}</h3>
            <p>{activeProjectGallery.description}</p>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Zoom]} // 🏆 1. Habilitamos o módulo nativo
            zoom={{
              maxRatio: 4, // 🏆 2. Configuração de zoom máximo
              minRatio: 1
            }}
            navigation={true}
            pagination={{ type: "fraction" }} 
            className="fullscreen-swiper"
            onSlideChange={() => {
              const videos = document.querySelectorAll(".fullscreen-swiper video");
              videos.forEach(vid => vid.pause());
            }}
          >
            {[
              ...(activeProjectGallery.imageUrls || []).map(url => ({ type: "image", url })),
              ...(activeProjectGallery.videoUrls || []).map(url => ({ type: "video", url }))
            ].map((midia, index) => (
              <SwiperSlide key={index}>
                  {midia.type === "image" ? (
                    <>
                      <div className="swiper-zoom-container">
                        <img src={midia.url} alt={`Mídia ${index + 1}`} className="lightbox-image" />
                      </div>
                      
                      {/* 🎯 O INDICADOR FLUTUANTE DE ZOOM */}
                      <div className="zoom-indicator">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          <line x1="11" y1="8" x2="11" y2="14"></line>
                          <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                        <span>Toque duas vezes para zoom</span>
                      </div>
                    </>
                  ) : (
                    <video src={midia.url} controls muted autoPlay playsInline className="lightbox-image" />
                  )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

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
          <div className="alfinete-icon" style={{ display: "inline-flex" }}>
            <img src={iconLocalizacao} alt="Ícone Localização" />
          </div>{" "}
          <strong>Av. André Luiz, 296 - </strong> Picanço, Guarulhos - SP,
          07082-050
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
            <div className="form-row-mobile">
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
                type="text"
                name="phone"
                placeholder="Seu WhatsApp (11) 99999-9999"
                required
                className="input-field"
                style={{ width: "100%", boxSizing: "border-box" }}
                value={leadPhone} /* 👈 Alterado para o estado correto */
                onChange={(e) =>
                  setLeadPhone(formatPhone(e.target.value))
                } /* 👈 Alterado para o setLeadPhone */
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
              <option value="" disabled>
                {" "}
                Qual serviço deseja solicitar?
              </option>
              <option value="MOVEIS_PLANEJADOS">Móveis planejados</option>
              <option value="SERVICO_EM_GESSO">Serviço em gesso</option>
              <option value="DESIGNER_DE_INTERIOR">Designer de interior</option>
              <option value="REFORMA_EM_GERAL">Reforma em geral</option>
              <option value="PROJETOS_ARQUITETONICOS">
                {" "}
                Projetos Arquitetônicos
              </option>
              <option value="PISO_VINILICO_E_LAMINADO">
                Piso vinílico e Laminado
              </option>
              <option value="RRT">RRT</option>
              <option value="LAUDO_TECNICO">Laudo técnico</option>
              <option value="PERSIANAS_E_CORTINAS">Persianas e cortinas</option>
              <option value="PEDRAS_DE_GRANITOS">Pedras de granitos</option>
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
              {isSubmittingLead ? "Enviando..." : "Enviar Solicitação"}
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
            <a
              href="/"
              style={{ display: "inline-block", marginBottom: "15px" }}
            >
              <img
                src={logoGarbo}
                alt="Garbo Arquitetura e Planejados"
                style={{
                  height: "60px",
                  width: "auto",
                }} /* Deixei com 60px para dar um destaque bonito no rodapé */
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
            <ul className="footer-links">
              <li>
                <a
                  href="https://api.whatsapp.com/message/2SSB4H5EDYLIO1?autoload=1&app_absent=0&utm_source=ig&text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20um%20or%C3%A7amento%21"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={iconWhatsapp}
                    alt="WhatsApp"
                    className="footer-icon"
                  />
                  Edna: (11) 99955-8023
                </a>
              </li>
              <li>
                <a
                  href="https://api.whatsapp.com/send/?phone=5511986460451&text&type=phone_number&app_absent=0&utm_source=ig"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={iconWhatsapp}
                    alt="WhatsApp"
                    className="footer-icon"
                  />
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
            <ul className="footer-links" style={{ marginBottom: "20px" }}>
              <li>
                <a
                  href="https://instagram.com/garboarqplan"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={iconInstagram}
                    alt="Instagram"
                    className="footer-icon"
                  />
                  @garboarqplan
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/ednaramosarquiteta"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={iconInstagram}
                    alt="Instagram"
                    className="footer-icon"
                  />
                  @ednaramosarquiteta
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/marciaarquiteta_"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={iconInstagram}
                    alt="Instagram"
                    className="footer-icon"
                  />
                  @marciaarquiteta_
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com/@garbo390"
                  target="_blank"
                  rel="noreferrer"
                >
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
            borderTop:
              "1px solid #222" /* Um tom um pouquinho mais claro que o fundo para dar destaque */,
            width: "100%",
            margin: "0px 0 20px 0",
          }}
        ></div>

        {/* Base: Direitos Autorais e Assinatura */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent:
              "space-between" /* Joga o Copyright pra esquerda e a assinatura pra direita */,
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
            © {new Date().getFullYear()} Garbo Arquitetura e Planejados. Todos
            os direitos reservados.
          </p>

          <div
            className="developer-signature"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              Desenvolvido com{" "}
              <img src={iconCode} alt="Code" className="signature-icon" /> por
            </span>
            <a
              href="https://www.linkedin.com/in/bruno-henrique-ramos-alves/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#d4af37",
                textDecoration: "none",
                fontWeight: "600",
                letterSpacing: "0.5px",
                transition: "color 0.3s ease",
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

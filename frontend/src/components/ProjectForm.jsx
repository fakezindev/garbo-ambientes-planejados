import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

function ProjectForm({ onUploadSuccess, projectToEdit, onCancelEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("MOVEIS_PLANEJADOS");
  const [status, setStatus] = useState("PROJETO");
  const [completionDate, setCompletionDate] = useState("");

  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Referências para os inputs escondidos
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // 2. Estados para guardar os arquivos selecionados (e/ou as URLs de preview)
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [videoFiles, setVideoFiles] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);

  // Carregar Clientes
  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/clients", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setClients(response.data);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar clientes:", err);
        setClients([]);
      });
  }, []);

  // Efeito para Edição
  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setDescription(projectToEdit.description);
      setCategory(projectToEdit.category);
      setStatus(projectToEdit.status || "EM PROJETO");
      setCompletionDate(projectToEdit.completionDate || "");
      setClientId(projectToEdit.clientId || "");

      // ==========================================
      // 1. CARREGANDO AS FOTOS DO BANCO
      // ==========================================
      let fotosSalvas = [];
      if (projectToEdit.imageUrls && projectToEdit.imageUrls.length > 0) {
        fotosSalvas = projectToEdit.imageUrls;
      } else if (projectToEdit.coverImageUrl) {
        fotosSalvas = [projectToEdit.coverImageUrl];
      }

      setImagePreviews(fotosSalvas); // Exibe as fotos antigas na tela
      setImageFiles([]);             // Garante que a lista de fotos a fazer upload comece vazia

      // ==========================================
      // 2. CARREGANDO OS VÍDEOS DO BANCO (NOVO)
      // ==========================================
      let videosSalvos = [];
      if (projectToEdit.videoUrls && projectToEdit.videoUrls.length > 0) {
        videosSalvos = projectToEdit.videoUrls;
      }

      setVideoPreviews(videosSalvos); // Exibe os vídeos antigos na tela
      setVideoFiles([]);              // Garante que a lista de vídeos a fazer upload comece vazia

    } else {
      clearForm(); // Se for criação (e não edição), limpa tudo
    }
  }, [projectToEdit]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // ✅ Atualiza os arquivos reais
      setImageFiles((prevImages) => {
        const currentImages = prevImages || [];
        return [...currentImages, ...files];
      });

      // ✅ Atualiza a vitrine (Previews)
      setImagePreviews((prevUrls) => {
        const currentUrls = prevUrls || [];
        const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
        return [...currentUrls, ...newPreviewUrls];
      });
    }

    // Limpa o input escondido
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove) => {
    setImagePreviews((prevUrls) => {
      const urlToRemove = prevUrls[indexToRemove];
      if (urlToRemove && urlToRemove.startsWith("blob:")) {
        URL.revokeObjectURL(urlToRemove);
      }
      return prevUrls.filter((_, index) => index !== indexToRemove);
    });

    setImageFiles((prevImages) => {
      // Calcula o offset usando os previews ATUAIS
      const offset = imagePreviews.filter(url => !url.startsWith("blob:")).length;
      const adjustedIndex = indexToRemove - offset;
      return prevImages.filter((_, idx) => idx !== adjustedIndex);
    });
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // ✅ Atualiza os arquivos reais (Vídeos)
      setVideoFiles((prevVideos) => {
        const currentVideos = prevVideos || [];
        return [...currentVideos, ...files];
      });

      // ✅ Atualiza a vitrine (Previews)
      setVideoPreviews((prevUrls) => {
        const currentUrls = prevUrls || [];
        // O createObjectURL também funciona para vídeos locais!
        const newPreviewUrls = files.map((file) => URL.createObjectURL(file)); 
        return [...currentUrls, ...newPreviewUrls];
      });
    }

    // Limpa o input escondido
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const removeVideo = (indexToRemove) => {
    setVideoPreviews((prevUrls) => {
      const urlToRemove = prevUrls[indexToRemove];
      if (urlToRemove && urlToRemove.startsWith("blob:")) {
        URL.revokeObjectURL(urlToRemove);
      }
      return prevUrls.filter((_, index) => index !== indexToRemove);
    });

    setVideoFiles((prevVideos) => {
      // Calcula o offset exatamente da mesma forma, mas olhando pros vídeos
      const offset = videoPreviews.filter(url => !url.startsWith("blob:")).length;
      const adjustedIndex = indexToRemove - offset;
      return prevVideos.filter((_, idx) => idx !== adjustedIndex);
    });
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setCategory("MOVEIS_PLANEJADOS");
    setStatus("PROJETO");
    setCompletionDate("");
    setClientId("");
    
    // Limpa FOTOS e revoga URLs da memória
    imagePreviews.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });
    setImagePreviews([]);
    setImageFiles([]);
    if (imageInputRef.current) imageInputRef.current.value = "";

    // Limpa VÍDEOS e revoga URLs da memória
    videoPreviews.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });
    setVideoPreviews([]);
    setVideoFiles([]);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    // Calcula o que sobrou (tudo que NÃO é arquivo novo "blob:")
    const imagensQueSobraram = imagePreviews.filter(url => !url.startsWith("blob:"));
    const videosQueSobraram = videoPreviews.filter(url => !url.startsWith("blob:"));
    
    const projectData = {
      title,
      status,
      description,
      category,
      completionDate,
      clientId: clientId,
      existingImageUrls: imagensQueSobraram, // Passa direto a variável calculada
      existingVideoUrls: videosQueSobraram,  // Passa direto a variável calculada
    };

    formData.append("data", JSON.stringify(projectData));

    // 📸 Adiciona os ARQUIVOS das novas imagens
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((img) => formData.append("images", img));
    }

    // 🎥 Adiciona os ARQUIVOS dos novos vídeos
    if (videoFiles && videoFiles.length > 0) {
      videoFiles.forEach((vid) => formData.append("videos", vid));
    }

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (projectToEdit) {
        await api.put(`/projects/${projectToEdit.id}`, formData, config);
        toast.success("Projeto atualizado com sucesso! 🏗️");
      } else {
        await api.post("/projects", formData, config);
        toast.success("Novo projeto publicado com sucesso! 🎉");
      }

      clearForm();
      if (onUploadSuccess) onUploadSuccess();
      if (onCancelEdit) onCancelEdit();
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      toast.error("Erro ao salvar o projeto. 🚨");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <h2>
          {projectToEdit
            ? `✏️ Editando: ${projectToEdit.title}`
            : "🚀 Novo Projeto"}
        </h2>
        <br />
        {projectToEdit && (
          <button onClick={onCancelEdit} className="btn btn-cancel">
            Cancelar
          </button>
        )}
      </div>
      <br />
      <form onSubmit={handleSubmit} className="form-group">
        {/* LINHA 1: TÍTULO E CATEGORIA */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <input
            type="text"
            placeholder="Título do Projeto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input-field"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            {/* Dica de UX: É sempre bom ter uma opção neutra no início para forçar o usuário a escolher */}
            <option value="" disabled>Selecione uma categoria</option>
            
            {/* Valores ajustados para o Enum do Java */}
            <option value="MOVEIS_PLANEJADOS">Móveis planejados</option>
            <option value="SERVICO_EM_GESSO">Serviço em gesso</option>
            <option value="DESIGNER_DE_INTERIOR">Designer de interior</option>
            <option value="REFORMA_EM_GERAL">Reforma em geral</option>
            <option value="PROJETOS_ARQUITETONICOS">Projetos Arquitetônicos</option>
            <option value="PISO_VINILICO_E_LAMINADO">Piso vinílico e Laminado</option>
            <option value="RRT">RRT</option>
            <option value="LAUDO_TECNICO">Laudo técnico</option>
            <option value="PERSIANAS_E_CORTINAS">Persianas e cortinas</option>
            <option value="PEDRAS_DE_GRANITOS">Pedras de granitos</option>
            </select>
          </div>

        {/* LINHA 2: CLIENTE E STATUS (Corrigido o espaço gigante) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="input-field"
          >
            <option value="">Selecione um Cliente (Opcional)</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} - {client.email}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field"
            style={{
              fontWeight: "bold",
              color: status === "CONCLUÍDO" ? "#27ae60" : "#f1c40f",
            }}
          >
            <option value="PROJETO">Em Projeto</option>
            <option value="FABRICAÇÃO">Em Fabricação</option>
            <option value="MONTAGEM">Em Montagem</option>
            <option value="CONCLUÍDO">Concluído</option>
          </select>
        </div>

        {/* LINHA 3: DATA DE PREVISÃO */}
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              color: "#888",
              fontSize: "0.8rem",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Previsão de Entrega
          </label>
          <input
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            className="input-field"
            style={{ width: "100%" }}
          />
        </div>

        <textarea
          placeholder="Descrição detalhada do projeto..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="input-field"
          style={{
            minHeight: "100px",
            resize: "vertical",
            marginBottom: "1rem",
          }}
        />

        {/* UPLOAD DE MÍDIAS */}
        <div className="file-upload" style={{ marginBottom: "1rem" }}>
                  
          {/* =========================================
              1. GALERIA DE PREVIEW DAS FOTOS
              ========================================= */}
          {imagePreviews.length > 0 && (
            <div style={{ display: "flex", gap: "15px", overflowX: "auto", padding: "10px 5px", marginBottom: "15px" }}>
              {imagePreviews.map((url, index) => (
                <div key={`img-${index}`} style={{ position: "relative", minWidth: "100px" }}>
                  <img
                    src={url}
                    alt={`Preview Imagem ${index}`}
                    style={{
                      width: "100px", height: "100px", objectFit: "cover",
                      borderRadius: "8px", border: "1px solid #333",
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeImage(index); // Certifique-se de que essa função atualiza imageFiles e imagePreviews
                    }}
                    style={{
                      position: "absolute", top: "-8px", right: "-8px", background: "#e74c3c", color: "white",
                      border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer",
                      fontSize: "12px", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* =========================================
              2. GALERIA DE PREVIEW DOS VÍDEOS
              ========================================= */}
          {videoPreviews.length > 0 && (
            <div style={{ display: "flex", gap: "15px", overflowX: "auto", padding: "10px 5px", marginBottom: "15px" }}>
              {videoPreviews.map((url, index) => (
                <div key={`vid-${index}`} style={{ position: "relative", minWidth: "150px" }}>
                  {/* Para preview de vídeos locais, usamos a tag video. 'url' é o blob criado */}
                  <video
                    src={url}
                    muted
                    controls
                    style={{
                      width: "150px", height: "100px", objectFit: "cover",
                      borderRadius: "8px", border: "1px solid #3498db", // Borda azul para diferenciar
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeVideo(index); // Você precisará criar essa função!
                    }}
                    style={{
                      position: "absolute", top: "-8px", right: "-8px", background: "#e74c3c", color: "white",
                      border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer",
                      fontSize: "12px", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* =========================================
              3. CONTAINER DOS BOTÕES DE UPLOAD
              ========================================= */}
          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            
            {/* BOTÃO 1: FOTOS */}
            <div
              onClick={() => {
                if (imageInputRef.current) imageInputRef.current.click();
              }}
              style={{
                flex: 1, color: "#f1c40f", fontWeight: "500", cursor: "pointer", padding: "15px 10px",
                border: "1px dashed #555", borderRadius: "8px", textAlign: "center", transition: "background 0.3s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(241, 196, 15, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {imagePreviews.length > 0
                ? `📸 Adicionar mais fotos (${imagePreviews.length})`
                : "📸 Clique para adicionar FOTOS"}
            </div>

            {/* BOTÃO 2: VÍDEOS */}
            <div
              onClick={() => {
                if (videoInputRef.current) videoInputRef.current.click();
              }}
              style={{
                flex: 1, color: "#3498db", fontWeight: "500", cursor: "pointer", padding: "15px 10px",
                border: "1px dashed #555", borderRadius: "8px", textAlign: "center", transition: "background 0.3s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(52, 152, 219, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {videoPreviews.length > 0
                ? `🎥 Adicionar mais vídeos (${videoPreviews.length})`
                : "🎥 Clique para adicionar VÍDEOS"}
            </div>
          </div>

          {/* =========================================
              4. OS INPUTS INVISÍVEIS
              ========================================= */}
          <input
            type="file"
            multiple
            accept="image/*"
            ref={imageInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange} 
          />

          <input
            type="file"
            multiple
            accept="video/*"
            ref={videoInputRef}
            style={{ display: "none" }}
            onChange={handleVideoChange} 
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`btn ${projectToEdit ? "btn-update" : "btn-primary"}`}
        >
          {loading
            ? "Processando..."
            : projectToEdit
              ? "Salvar Alterações"
              : "Cadastrar Projeto"}
        </button>
      </form>
    </div>
  );
}

export default ProjectForm;

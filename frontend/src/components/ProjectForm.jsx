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

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

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
      setStatus(projectToEdit.status || "PROJETO");
      setCompletionDate(projectToEdit.completionDate || "");
      setClientId(projectToEdit.clientId || "");

      let fotosSalvas = [];
      if (projectToEdit.imageUrls && projectToEdit.imageUrls.length > 0) {
        fotosSalvas = projectToEdit.imageUrls;
      } else if (projectToEdit.coverImageUrl) {
        fotosSalvas = [projectToEdit.coverImageUrl];
      }

      setPreviewUrls(fotosSalvas);
      setImages([]); // Resetamos o array de novos arquivos ao editar
    } else {
      clearForm();
    }
  }, [projectToEdit]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // ✅ Mantém as fotos antigas e adiciona as novas ao array de arquivos
      setImages((prevImages) => [...prevImages, ...files]);

      // ✅ Gera previews sem apagar os que já estavam na tela
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
    }
    // Limpa o valor do input para permitir selecionar o mesmo arquivo novamente se desejar
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (indexToRemove) => {
    // ❌ Remove do array de arquivos reais (ajustando o índice caso existam fotos vindas do banco)
    // Se a imagem for nova (existir no array images), removemos ela.
    // Como o previewUrls junta fotos do banco + fotos novas, precisamos de cuidado aqui.

    setPreviewUrls((prevUrls) => {
      const urlToRemove = prevUrls[indexToRemove];
      // Se for uma URL temporária do navegador, libera memória
      if (urlToRemove.startsWith("blob:")) {
        URL.revokeObjectURL(urlToRemove);
      }
      return prevUrls.filter((_, index) => index !== indexToRemove);
    });

    // Remove do array de arquivos (images) apenas se for uma foto recém adicionada
    // (As fotos do banco não estão no array 'images')
    setImages((prevImages) => {
      // O cálculo do índice aqui depende de como você organiza a ordem (banco primeiro ou novas primeiro)
      // Por simplicidade, se você estiver apenas adicionando fotos novas:
      return prevImages.filter((_, index) => index !== indexToRemove);
    });
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setCategory("MOVEIS_PLANEJADOS");
    setStatus("PROJETO");
    setCompletionDate("");
    setClientId("");
    setImages([]);
    // Limpa previews e revoga URLs para evitar vazamento de memória
    previewUrls.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });
    setPreviewUrls([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const existingImageUrls = previewUrls.filter(
      (url) => !url.startsWith("blob:"),
    );

    const formData = new FormData();
    const projectData = {
      title,
      status,
      description,
      category,
      completionDate,
      clientId: clientId,
      existingImageUrls: existingImageUrls,
    };

    formData.append("data", JSON.stringify(projectData));

    if (images && images.length > 0) {
      images.forEach((img) => formData.append("images", img));
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

        {/* UPLOAD DE IMAGENS COM BOTÃO DE REMOVER */}
        <div
          className={`file-upload ${previewUrls.length > 0 ? "has-image" : ""}`}
          style={{ marginBottom: "1rem" }}
        >
          <label style={{ cursor: "pointer", display: "block" }}>
            {previewUrls.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  overflowX: "auto",
                  padding: "10px 5px",
                }}
              >
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    style={{ position: "relative", minWidth: "100px" }}
                  >
                    <img
                      src={url}
                      alt={`Preview ${index}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #333",
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeImage(index);
                      }}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "#e74c3c",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <span
              style={{
                display: "block",
                marginTop: previewUrls.length > 0 ? "15px" : "0",
                color: "#f1c40f",
                fontWeight: "500",
              }}
            >
              {previewUrls.length > 0
                ? `Adicionar mais fotos (${previewUrls.length})`
                : "📸 Clique para adicionar fotos do projeto"}
            </span>

            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </label>
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

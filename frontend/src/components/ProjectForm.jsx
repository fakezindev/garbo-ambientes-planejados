import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

function ProjectForm({ onUploadSuccess, projectToEdit, onCancelEdit }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('PLANEJADOS');
    const [completionDate, setCompletionDate] = useState('');

    const [clients, setClients] = useState([]);
    const [clientId, setClientId] = useState(''); 

    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        api.get('/clients')
            .then(response => setClients(response.data))
            .catch(err => console.error("Erro ao carregar clientes:", err));
    }, []);

    useEffect(() => {
        if (projectToEdit) {
            setTitle(projectToEdit.title);
            setDescription(projectToEdit.description);
            setCategory(projectToEdit.category);
            setCompletionDate(projectToEdit.completionDate || '');
            setClientId(projectToEdit.clientId || '');

            let fotosSalvas = [];
            if (projectToEdit.imageUrls && projectToEdit.imageUrls.length > 0) {
                fotosSalvas = projectToEdit.imageUrls;
            } else if (projectToEdit.coverImageUrl) {
                fotosSalvas = [projectToEdit.coverImageUrl];
            }

            setPreviewUrls(fotosSalvas); 
            setImages([]); 
        } else {
            clearForm();
        }
    }, [projectToEdit]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setImages(files);
            const urls = files.map(file => URL.createObjectURL(file));
            setPreviewUrls(urls);
        }
    };

    const clearForm = () => {
        setTitle('');
        setDescription('');
        setCategory('PLANEJADOS');
        setCompletionDate('');
        setClientId(''); 
        setImages([]);
        setPreviewUrls([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();

        const projectData = {
            title,
            description,
            category,
            completionDate,
            clientId: clientId
        };
        
        // Agora envia apenas como String JSON simples (o Java se vira para ler)
        formData.append('data', JSON.stringify(projectData));

        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }
        }

        try {
            console.log(">>> Enviando projeto para o Java...");
            console.log(">>> Quantidade de fotos no pacote:", images.length);

            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            if (projectToEdit) {
                // Atualiza projeto existente
                await api.put(`/projects/${projectToEdit.id}`, formData, config);
                alert('Projeto atualizado com sucesso!');
            } else {
                // Cria projeto novo
                await api.post('/projects', formData, config);
                alert('Projeto criado com sucesso!');
            }
            
            clearForm();
            if (onUploadSuccess) onUploadSuccess();
            if (onCancelEdit) onCancelEdit();
            
        } catch (error) {
            console.error('>>> ERRO DETALHADO AO SALVAR:', error);
            if (error.code === 'ECONNABORTED') {
                alert('O upload está demorando um pouco, mas está sendo processado no fundo!');
            } else {
                alert('Erro ao salvar projeto. Verifique o console.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-card">
            <div className="form-header">
                <h2>{projectToEdit ? `✏️ Editando: ${projectToEdit.title}` : '🚀 Novo Projeto'}</h2>
                <br />
                {projectToEdit && (
                    <button onClick={onCancelEdit} className="btn btn-cancel">Cancelar</button>
                )}
            </div>
            <br />

            <form onSubmit={handleSubmit} className="form-group">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input
                        type="text" placeholder="Título do Projeto"
                        value={title} onChange={e => setTitle(e.target.value)}
                        required className="input-field"
                    />
                    <select
                        value={category} onChange={e => setCategory(e.target.value)}
                        className="input-field"
                    >
                        <option value="PLANEJADOS">Planejados</option>
                        <option value="COMERCIAL">Comercial</option>
                        <option value="INTERIORES">Interiores</option>
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <select
                        value={clientId}
                        onChange={e => setClientId(e.target.value)}
                        className="input-field"
                    >
                        <option value="">Selecione um Cliente (Opcional)</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.name} - {client.email}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={completionDate} onChange={e => setCompletionDate(e.target.value)}
                        className="input-field"
                    />
                </div>

                <textarea
                    placeholder="Descrição detalhada do projeto..."
                    value={description} onChange={e => setDescription(e.target.value)}
                    required className="input-field" style={{ minHeight: '100px', resize: 'vertical' }}
                />

                <div className={`file-upload ${previewUrls.length > 0 ? 'has-image' : ''}`}>
                    <label>
                        {previewUrls.length > 0 && (
                            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                                {previewUrls.map((url, index) => (
                                    <img key={index} src={url} alt={`Preview ${index}`} className="preview-image" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                ))}
                            </div>
                        )}

                        <span style={{ display: 'block', marginTop: previewUrls.length > 0 ? '10px' : '0' }}>
                            {images.length > 0 ? `${images.length} arquivo(s) selecionado(s)` : "📸 Clique para adicionar fotos do projeto"}
                        </span>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                <button type="submit" disabled={loading} className={`btn ${projectToEdit ? 'btn-update' : 'btn-primary'}`}>
                    {loading ? 'Processando...' : (projectToEdit ? 'Salvar Alterações' : 'Cadastrar Projeto')}
                </button>
            </form>
        </div>
    );
}

export default ProjectForm;
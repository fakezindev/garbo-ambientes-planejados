import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

function ProjectForm({ onUploadSuccess, projectToEdit, onCancelEdit }) {
    // Estados do Formulário
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('RESIDENCIAL');
    const [clientName, setClientName] = useState('');
    const [completionDate, setCompletionDate] = useState('');
    
    // Estados da Imagem
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // URL para mostrar a miniatura
    
    // Estado de Carregamento (Só pode ter UM desse)
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    // Efeito: Preenche o formulário quando clica em Editar
    useEffect(() => {
        if (projectToEdit) {
            setTitle(projectToEdit.title);
            setDescription(projectToEdit.description);
            setCategory(projectToEdit.category);
            setClientName(projectToEdit.clientName || '');
            setCompletionDate(projectToEdit.completionDate || '');
            // Se já tem foto, mostra ela
            setPreviewUrl(projectToEdit.coverImageUrl);
        } else {
            clearForm();
        }
    }, [projectToEdit]);

    // Função que gera o preview da imagem quando o usuário seleciona
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const clearForm = () => {
        setTitle('');
        setDescription('');
        setCategory('PLANEJADOS');
        setClientName('');
        setCompletionDate('');
        setImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        const projectData = JSON.stringify({
            title, description, category, clientName, completionDate
        });
        
        const jsonBlob = new Blob([projectData], { type: 'application/json' });
        formData.append('data', jsonBlob);

        if (image) {
            formData.append('images', image);
        }

        try {
            if (projectToEdit) {
                await api.put(`/projects/${projectToEdit.id}`, formData);
                alert('Projeto atualizado!');
            } else {
                await api.post('/projects', formData);
                alert('Projeto criado!');
            }
            
            clearForm();
            if (onUploadSuccess) onUploadSuccess();
            if (onCancelEdit) onCancelEdit();

        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar projeto.');
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
                    <button onClick={onCancelEdit} className="btn btn-cancel">
                        Cancelar
                    </button>
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
                    <input 
                        type="text" placeholder="Nome do Cliente" 
                        value={clientName} onChange={e => setClientName(e.target.value)} 
                        className="input-field"
                    />
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

                {/* Área de Upload com Preview */}
                <div className={`file-upload ${previewUrl ? 'has-image' : ''}`}>
                    <label>
                        {previewUrl && (
                            <img src={previewUrl} alt="Preview" className="preview-image" />
                        )}
                        
                        <span style={{color: 'var(--text-main)', display: 'block', marginTop: previewUrl ? '10px' : '0'}}>
                            {image ? `Arquivo selecionado: ${image.name}` : (projectToEdit && !image ? "Clique na imagem para alterar a foto" : "📸 Clique para adicionar foto de capa")}
                        </span>
                        
                        <input 
                            type="file" 
                            accept="image/*" 
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
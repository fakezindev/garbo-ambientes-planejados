import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

function ProjectForm({ onUploadSuccess, projectToEdit, onCancelEdit }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('PLANEJADOS');
    const [completionDate, setCompletionDate] = useState('');

    // 👇 NOVOS ESTADOS PARA O CLIENTE 👇
    const [clients, setClients] = useState([]);
    const [clientId, setClientId] = useState(''); // Guarda o ID do cliente selecionado

    const [images, setImages] = useState([]); 
    const [previewUrls, setPreviewUrls] = useState([]);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    // EFEITO 1: Busca a lista de clientes assim que o componente nasce
    useEffect(() => {
        api.get('/clients')
            .then(response => setClients(response.data))
            .catch(err => console.error("Erro ao carregar clientes:", err));
    }, []);

    // EFEITO 2: Preenche os dados quando clica em Editar
    useEffect(() => {
        if (projectToEdit) {
            setTitle(projectToEdit.title);
            setDescription(projectToEdit.description);
            setCategory(projectToEdit.category);
            setCompletionDate(projectToEdit.completionDate || '');
            
            // Tenta puxar o ID do cliente para deixar selecionado
            setClientId(projectToEdit.clientId || ''); 
            
            // 👇 LÓGICA INTELIGENTE PARA AS FOTOS 👇
            let fotosSalvas = [];
            if (projectToEdit.imageUrls && projectToEdit.imageUrls.length > 0) {
                // Projetos novos com várias fotos
                fotosSalvas = projectToEdit.imageUrls;
            } else if (projectToEdit.coverImageUrl) {
                // Projetos antigos com apenas uma foto
                fotosSalvas = [projectToEdit.coverImageUrl];
            }
            
            setPreviewUrls(fotosSalvas); // Coloca as fotos na vitrine
            setImages([]); // Deixa os arquivos vazios, pois não vamos reenviar o que já tá lá
            
        } else {
            clearForm();
        }
    }, [projectToEdit]);

    const handleImageChange = (e) => {
        // Pega todos os arquivos selecionados
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setImages(files);
            // Cria um link temporário para cada foto selecionada
            const urls = files.map(file => URL.createObjectURL(file));
            setPreviewUrls(urls);
        }
    };

    const clearForm = () => {
        setTitle('');
        setDescription('');
        setCategory('PLANEJADOS');
        setCompletionDate('');
        setClientId(''); // Limpa o cliente selecionado
        setImages([]);
        setPreviewUrls([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        try {
            // 👀 OLHOS DO DETETIVE NO REACT:
            console.log(">>> Enviando projeto para o Java...");
            console.log(">>> Quantidade de fotos no pacote:", images.length);

            if (projectToEdit) {
                // 👇 MUDAMOS DE api.put PARA api.post AQUI 👇
                await api.post(`/projects/${projectToEdit.id}`, formData);
                alert('Projeto atualizado com sucesso!');
            } else {
                await api.post('/projects', formData);
                alert('Projeto criado com sucesso!');
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
        
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();

        // 👇 Agora enviamos o clientId no pacote JSON 👇
        const projectData = JSON.stringify({
            title,
            description,
            category,
            completionDate,
            clientId: clientId ? parseInt(clientId) : null // Converte pra número ou manda null
        });

        const jsonBlob = new Blob([projectData], { type: 'application/json' });
        formData.append('data', jsonBlob);

        if (images.length > 0) {
            images.forEach(img => {
                formData.append('images', img);
            });
        }

        try {
            if (projectToEdit) {
                await api.put(`/projects/${projectToEdit.id}`, formData);
                alert('Projeto atualizado!');
            } else {
                await api.post('/projects', formData);
                alert('Projeto criado e vinculado ao cliente!');
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
                    {/* 👇 O NOVO CAMPO: DROPDOWN DE CLIENTES 👇 */}
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
                        {/* Se tiver miniaturas, mostra todas lado a lado */}
                        {previewUrls.length > 0 && (
                            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                                {previewUrls.map((url, index) => (
                                    <img key={index} src={url} alt={`Preview ${index}`} className="preview-image" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                ))}
                            </div>
                        )}
                        
                        <span style={{display: 'block', marginTop: previewUrls.length > 0 ? '10px' : '0'}}>
                            {images.length > 0 ? `${images.length} arquivo(s) selecionado(s)` : "📸 Clique para adicionar fotos do projeto"}
                        </span>
                        
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple /* A MÁGICA QUE PERMITE ESCOLHER VÁRIAS FOTOS */
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